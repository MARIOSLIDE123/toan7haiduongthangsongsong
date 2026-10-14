/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArenaQuestion, AdvancedQuestion } from '../types.ts';

function normalizeText(str: string): string {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Chấm điểm Đấu trường trí tuệ độc lập phía Client (Instant & Offline Ready)
 */
export function gradeArenaQuestionLocally(
  question: ArenaQuestion,
  userSubmission: any,
  currentAttemptsCount: number
): {
  isCorrect: boolean;
  attemptsCount: number;
  canRetry: boolean;
  isCompleted: boolean;
  earnedScore: number;
  hint?: string;
  explanation: string;
} {
  let isCorrect = false;

  switch (question.type) {
    case 'single_choice': {
      const userStr = String(userSubmission || '').trim().toUpperCase();
      const correctStr = String(question.correctSingleOption || '').trim().toUpperCase();
      isCorrect = userStr === correctStr;
      break;
    }
    case 'multiple_choice': {
      const correctOpts = (question.correctMultipleOptions || [])
        .map((s) => String(s).trim().toUpperCase())
        .sort();
      const userOpts = (Array.isArray(userSubmission) ? userSubmission : [])
        .map((s) => String(s).trim().toUpperCase())
        .sort();
      isCorrect =
        correctOpts.length > 0 &&
        correctOpts.length === userOpts.length &&
        correctOpts.every((val, idx) => val === userOpts[idx]);
      break;
    }
    case 'numeric_input': {
      const rawStr = String(userSubmission || '').replace(/°|độ|deg/gi, '').trim();
      const numVal = parseFloat(rawStr);
      const accepted = question.numericAnswer?.acceptedStrings || [];
      const matchesAccepted = accepted.some(
        (acc: string) => normalizeText(acc) === normalizeText(String(userSubmission || ''))
      );
      isCorrect =
        (!isNaN(numVal) && numVal === question.numericAnswer?.exact) || matchesAccepted;
      break;
    }
    case 'fill_blank': {
      const cleanUser = normalizeText(String(userSubmission || ''));
      const acceptedList = question.fillBlankAnswer?.acceptedPhrases || [];
      isCorrect = acceptedList.some((p: string) => normalizeText(p) === cleanUser);
      break;
    }
    case 'matching': {
      const correctPairs = question.matchingData?.correctPairs || {};
      const userPairs = userSubmission || {};
      const keys = Object.keys(correctPairs);
      isCorrect =
        keys.length > 0 &&
        keys.every(
          (k) =>
            String(userPairs[k] || '')
              .trim()
              .toLowerCase() === String(correctPairs[k] || '').trim().toLowerCase()
        );
      break;
    }
    case 'true_false': {
      const stmts = question.trueFalseData?.statements || [];
      const userAnswers = userSubmission || {};
      isCorrect =
        stmts.length > 0 &&
        stmts.every((st) => userAnswers[st.id] === st.correct);
      break;
    }
    case 'ordering': {
      const correctOrder = question.orderingData?.correctOrder || [];
      const userOrder = Array.isArray(userSubmission) ? userSubmission : [];
      isCorrect =
        correctOrder.length > 0 &&
        correctOrder.length === userOrder.length &&
        correctOrder.every(
          (id, idx) =>
            String(userOrder[idx] || '').trim().toLowerCase() ===
            id.trim().toLowerCase()
        );
      break;
    }
    case 'svg_angle_click': {
      isCorrect =
        String(userSubmission || '').trim().toUpperCase() ===
        question.svgAngleTarget?.trim().toUpperCase();
      break;
    }
    default:
      isCorrect = false;
  }

  const nextAttemptsCount = currentAttemptsCount + 1;
  let earnedScore = 0;
  let canRetry = false;
  let isCompleted = false;

  if (isCorrect) {
    isCompleted = true;
    canRetry = false;
    earnedScore = nextAttemptsCount === 1 ? 5 : 2.5;
  } else {
    if (nextAttemptsCount === 1) {
      canRetry = true;
      isCompleted = false;
      earnedScore = 0;
    } else {
      isCompleted = true;
      canRetry = false;
      earnedScore = 0;
    }
  }

  return {
    isCorrect,
    attemptsCount: nextAttemptsCount,
    canRetry,
    isCompleted,
    earnedScore,
    hint: canRetry ? question.hint : undefined,
    explanation: question.explanation,
  };
}

/**
 * Chấm điểm Vận dụng cao độc lập phía Client (10 điểm, không có làm lại)
 */
export function gradeAdvancedQuestionLocally(
  question: AdvancedQuestion,
  userOptionId: string
): {
  isCorrect: boolean;
  earnedScore: number;
  isCompleted: boolean;
  canRetry: boolean;
  explanation: {
    summary: string;
    steps: string[];
    conclusion: string;
  };
} {
  const isCorrect =
    String(userOptionId || '').trim().toUpperCase() ===
    String(question.correctOptionId || '').trim().toUpperCase();

  return {
    isCorrect,
    earnedScore: isCorrect ? 10 : 0,
    isCompleted: true,
    canRetry: false,
    explanation: question.explanation,
  };
}
