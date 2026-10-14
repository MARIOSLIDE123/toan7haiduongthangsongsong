/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question, StudentProfile, SessionData, AttemptState } from '../types.ts';
import { GeometryCanvas } from './GeometryCanvas.tsx';
import { MathText } from './MathText.tsx';
import { sound } from '../utils/audio.ts';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Trophy,
  Share2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PracticeSectionProps {
  questions: Question[];
  student: StudentProfile;
  session: SessionData | null;
  onUpdateSession: (updated: SessionData) => void;
  onGoToLeaderboard: () => void;
  onRestartPractice: () => void;
}

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  questions,
  student,
  session,
  onUpdateSession,
  onGoToLeaderboard,
  onRestartPractice,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [finalSummary, setFinalSummary] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    sheetSyncStatus: string;
  } | null>(null);

  const currentQ = questions[currentIndex];
  const questionAttempts: AttemptState | undefined = session?.attempts[currentQ?.id];

  const handleSelectOption = (optId: string) => {
    if (questionAttempts?.isCompleted || isSubmitting) return;
    sound.playClick();
    setSelectedOption(optId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || isSubmitting || questionAttempts?.isCompleted) return;

    setIsSubmitting(true);

    // 1. TÍNH TOÁN KẾT QUẢ NGAY TỨC THÌ PHÍA CLIENT
    const currentAttempts = questionAttempts?.attemptsCount || 0;
    const nextAttempts = currentAttempts + 1;
    const isCorrect = selectedOption === currentQ.correctOptionId;
    let earnedScore = 0;
    let canRetry = false;
    let isCompleted = false;

    if (isCorrect) {
      isCompleted = true;
      canRetry = false;
      earnedScore = nextAttempts === 1 ? 10 : 5;
      if (nextAttempts === 1) sound.playCorrect();
      else sound.playRetrySuccess();
    } else {
      sound.playWrong();
      if (nextAttempts === 1) {
        canRetry = true;
        isCompleted = false;
        earnedScore = 0;
      } else {
        isCompleted = true;
        canRetry = false;
        earnedScore = 0;
      }
    }

    const currentTotal = session?.totalScore || 0;
    const updatedAttempts = { ...(session?.attempts || {}) };
    updatedAttempts[currentQ.id] = {
      questionId: currentQ.id,
      attemptsCount: nextAttempts,
      isCompleted,
      isCorrect,
      earnedScore,
      userSelectedOptions: [
        ...(updatedAttempts[currentQ.id]?.userSelectedOptions || []),
        selectedOption,
      ],
      canRetry,
    };

    const updatedSession: SessionData = {
      ...(session || {
        sessionId: 'practice_' + Date.now(),
        student,
        moduleId: 'BAI9_LUYEN_TAP_SGK',
        startTime: Date.now(),
        maxScore: 120,
        attempts: {},
        totalScore: 0,
        isFinished: false,
      }),
      totalScore: currentTotal + earnedScore,
      attempts: updatedAttempts,
    };

    onUpdateSession(updatedSession);
    if (canRetry) {
      setSelectedOption(null);
    }
    setIsSubmitting(false);

    // 2. GỬI NỀN LÊN MÁY CHỦ
    try {
      fetch('/api/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: updatedSession.sessionId,
          questionId: currentQ.id,
          selectedOptionId: selectedOption,
        }),
      }).catch(() => {});
    } catch {}
  };

  const handleNextQuestion = async () => {
    sound.playClick();
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Complete quiz
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/session/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session?.sessionId }),
        });
        const data = await response.json();
        sound.playVictory();
        setIsQuizComplete(true);
        setFinalSummary({
          score: session?.totalScore || 0,
          maxScore: session?.maxScore || 120,
          percentage: Math.round(((session?.totalScore || 0) / (session?.maxScore || 120)) * 1000) / 10,
          sheetSyncStatus: data.sheetSyncStatus,
        });
      } catch (e) {
        console.error('Error finalizing session:', e);
        sound.playVictory();
        setIsQuizComplete(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Completion Screen
  if (isQuizComplete && finalSummary) {
    const isMaster = finalSummary.percentage >= 90;
    const isProficient = finalSummary.percentage >= 70;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center text-4xl shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Tổng kết kết quả kiểm tra Toán 7
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
            Chúc mừng em, {student.name}!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Học sinh lớp <b>{student.className}</b> - <b>{student.school}</b>
          </p>
        </div>

        {/* Score Ring / Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-3">
          <div className="text-5xl md:text-6xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {finalSummary.score}
            <span className="text-2xl md:text-3xl font-normal text-slate-400">/{finalSummary.maxScore}</span>
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-slate-700 shadow-xs font-bold text-slate-700 dark:text-slate-200 text-sm">
            Tỷ lệ đạt chuẩn: {finalSummary.percentage}%
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Danh hiệu:{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {isMaster
                ? '🏆 Bậc thầy Hình học Song song'
                : isProficient
                ? '⭐ Ngôi sao Hình học Toán 7'
                : '🌱 Chiến binh Hình học Cố gắng'}
            </span>
          </p>
        </div>

        {/* Status of Sync */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4 text-emerald-500" />
          <span>
            {finalSummary.sheetSyncStatus === 'synced'
              ? 'Dữ liệu đã tự động đồng bộ trực tiếp lên Google Sheets của giáo viên!'
              : 'Dữ liệu đã được lưu trữ an toàn trong máy chủ nội bộ (Chế độ Demo / Offline Queue).'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onRestartPractice();
              setIsQuizComplete(false);
              setCurrentIndex(0);
              setSelectedOption(null);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Luyện tập lại
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onGoToLeaderboard();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            Xem Bảng xếp hạng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Info & Score Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl shadow-inner">
            {student.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base md:text-lg flex items-center gap-1.5">
              <span>{student.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
                {student.className}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {student.school} • Đang làm bài thi trắc nghiệm Toán 7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Điểm số hiện tại
            </span>
            <div className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {session?.totalScore || 0}
              <span className="text-xs font-normal text-slate-400">/{session?.maxScore || 120}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center font-bold text-xs font-mono text-slate-700 dark:text-slate-200">
            {currentIndex + 1}/{questions.length}
          </div>
        </div>
      </div>

      {/* Main Question Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Diagram Canvas */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hình minh họa bài toán
            </span>
            {currentQ.diagramConfig.knownAngles && (
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                Góc đã biết: {Object.entries(currentQ.diagramConfig.knownAngles).map(([k, v]) => `${k}=${v}°`).join(', ')}
              </span>
            )}
          </div>

          <GeometryCanvas
            baseAngle={currentQ.diagramConfig.baseAngle}
            isParallel={currentQ.diagramConfig.isParallel}
            tiltB={currentQ.diagramConfig.isParallel ? 0 : 8}
            highlightAngles={currentQ.diagramConfig.highlightAngles}
            knownAngles={currentQ.diagramConfig.knownAngles}
            customLabels={currentQ.diagramConfig.customLabels}
            lineALabel={currentQ.diagramConfig.lineALabel || 'a'}
            lineBLabel={currentQ.diagramConfig.lineBLabel || 'b'}
            lineCLabel={currentQ.diagramConfig.lineCLabel || 'c'}
          />
        </div>

        {/* Right: Question Prompt & Options */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentQ.title}
            </span>
            <h4 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 leading-snug">
              <MathText text={currentQ.prompt} />
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedOption === opt.id;
              const isCompleted = questionAttempts?.isCompleted;
              const isCorrectOpt = opt.id === currentQ.correctOptionId;
              const wasChosenByUser = questionAttempts?.userSelectedOptions.includes(opt.id);

              let optStyle =
                'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

              if (isSelected && !isCompleted) {
                optStyle =
                  'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/30';
              }

              if (isCompleted) {
                if (isCorrectOpt) {
                  optStyle =
                    'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/40';
                } else if (wasChosenByUser && !isCorrectOpt) {
                  optStyle =
                    'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-100 line-through opacity-80';
                } else {
                  optStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isCompleted || isSubmitting}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted && isCorrectOpt
                          ? 'bg-emerald-600 text-white'
                          : isCompleted && wasChosenByUser && !isCorrectOpt
                          ? 'bg-rose-600 text-white'
                          : isSelected && !isCompleted
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm md:text-base leading-relaxed pt-0.5">
                      <MathText text={opt.text.replace(/^[A-D]\.\s*/, '')} />
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isCompleted && isCorrectOpt && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {isCompleted && wasChosenByUser && !isCorrectOpt && (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Actions */}
          {!questionAttempts?.isCompleted ? (
            <div className="pt-2">
              {questionAttempts && questionAttempts.attemptsCount === 1 && !questionAttempts.isCorrect && (
                <div className="p-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-bold">Chưa chính xác ở lần thử 1!</p>
                    <p>Em được làm lại thêm 1 lần để nhận <b>50% điểm số (5 điểm)</b>. Hãy quan sát kỹ lại vị trí các góc trên hình vẽ nhé!</p>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedOption || isSubmitting}
                onClick={handleSubmitAnswer}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Đang chấm điểm...</span>
                ) : questionAttempts?.attemptsCount === 1 ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Xác nhận làm lại lần 2 (nhận tối đa 50% điểm)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Gửi câu trả lời
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Completed Question Card with Explanation */
            <div className="pt-2 space-y-3 animate-in fade-in duration-200">
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  questionAttempts.isCorrect
                    ? questionAttempts.earnedScore === 10
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {questionAttempts.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="font-bold text-sm">
                    {questionAttempts.isCorrect
                      ? questionAttempts.earnedScore === 10
                        ? 'Chính xác ngay lần đầu (+10 điểm)'
                        : 'Đúng sau lần làm lại (+5 điểm)'
                      : 'Chưa đúng sau 2 lần thử (0 điểm)'}
                  </span>
                </div>
                <span className="font-mono font-bold text-base">
                  +{questionAttempts.earnedScore}đ
                </span>
              </div>

              {/* Nút xem lời giải chi tiết */}
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{showExplanation ? 'Ẩn lời giải chi tiết' : '📖 Xem lời giải chi tiết'}</span>
                {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Explanation Steps */}
              {showExplanation && (
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs md:text-sm animate-in fade-in duration-200">
                  <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Lời giải chi tiết:
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    <MathText text={currentQ.explanation.summary} />
                  </p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-4 list-disc">
                    {currentQ.explanation.steps.map((st, i) => (
                      <li key={i}>
                        <MathText text={st} />
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-xs text-blue-700 dark:text-blue-300 border-t border-slate-200 dark:border-slate-700">
                    <b>Định lý áp dụng:</b> <MathText text={currentQ.explanation.geometricRule} />
                  </div>
                </div>
              )}

              {/* Next Question Button */}
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết bài thi'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
