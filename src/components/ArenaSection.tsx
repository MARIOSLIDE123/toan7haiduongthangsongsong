/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArenaQuestion, StudentProfile, SessionData, AngleName } from '../types.ts';
import { ARENA_QUESTIONS } from '../data/arenaQuestions.ts';
import { GeometryCanvas } from './GeometryCanvas.tsx';
import { MathText } from './MathText.tsx';
import { gradeArenaQuestionLocally } from '../utils/localGrading.ts';
import { sound } from '../utils/audio.ts';
import {
  Trophy,
  Swords,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  BookOpen,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Check,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ArenaSectionProps {
  student: StudentProfile;
  onGoToLeaderboard: () => void;
}

export const ArenaSection: React.FC<ArenaSectionProps> = ({ student, onGoToLeaderboard }) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // User input states for current question
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState<string | null>(null);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>([]);
  const [numericAnswer, setNumericAnswer] = useState<string>('');
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');
  const [matchingPairs, setMatchingPairs] = useState<{ [key: string]: string }>({});
  const [selectedColA, setSelectedColA] = useState<string | null>(null);
  const [trueFalseAnswers, setTrueFalseAnswers] = useState<{ [key: string]: boolean }>({});
  const [orderingItems, setOrderingItems] = useState<string[]>([]);
  const [svgSelectedAngle, setSvgSelectedAngle] = useState<AngleName | null>(null);

  // Immediate question feedback state
  const [questionResult, setQuestionResult] = useState<{
    isCorrect: boolean;
    attemptsCount: number;
    canRetry: boolean;
    isCompleted: boolean;
    earnedScore: number;
    hint?: string;
    explanation?: string;
    positiveFeedback?: string;
    encouragingFeedback?: string;
  } | null>(null);

  // Final summary stats
  const [finalStats, setFinalStats] = useState<{
    totalScore: number;
    maxScore: number;
    percentage: number;
    firstTryCount: number;
    retryCount: number;
    wrongCount: number;
    masteredTopics: string[];
    reviewTopics: string[];
  } | null>(null);

  const currentQ: ArenaQuestion = ARENA_QUESTIONS[currentIndex];

  // Initialize or restore session
  const initArenaSession = async () => {
    try {
      // Check saved session in localStorage
      const savedStorage = localStorage.getItem('toan7_arena_session');
      if (savedStorage) {
        try {
          const parsed = JSON.parse(savedStorage);
          if (parsed && parsed.sessionId && parsed.student?.id === student.id && !parsed.isFinished) {
            setSession(parsed);
            setHasStarted(true);
            // Resume at first uncompleted question
            const completedCount = Object.keys(parsed.attempts || {}).length;
            const nextIdx = Math.min(completedCount, ARENA_QUESTIONS.length - 1);
            setCurrentIndex(nextIdx);
            return;
          }
        } catch {}
      }

      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          moduleId: 'BAI9_DAU_TRUONG_TRI_TUE',
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        localStorage.setItem('toan7_arena_session', JSON.stringify(data.session));
      }
    } catch (e) {
      console.error('Lỗi khởi tạo phiên Đấu trường:', e);
    }
  };

  useEffect(() => {
    initArenaSession();
  }, [student.id]);

  // Reset inputs when current question changes
  useEffect(() => {
    if (!currentQ) return;
    setSingleChoiceAnswer(null);
    setMultipleChoiceAnswers([]);
    setNumericAnswer('');
    setFillBlankAnswer('');
    setMatchingPairs({});
    setSelectedColA(null);
    setTrueFalseAnswers({});
    setSvgSelectedAngle(null);
    setQuestionResult(null);
    setShowExplanation(false);

    // Initial order for ordering questions
    if (currentQ.type === 'ordering' && currentQ.orderingData) {
      // Scrambled initial order: a, b, c, d
      setOrderingItems(currentQ.orderingData.items.map((i) => i.id));
    }

    // Restore if already completed in session
    if (session && session.attempts[currentQ.id]) {
      const att = session.attempts[currentQ.id];
      setQuestionResult({
        isCorrect: att.isCorrect,
        attemptsCount: att.attemptsCount,
        canRetry: false,
        isCompleted: true,
        earnedScore: att.earnedScore,
        explanation: currentQ.explanation,
      });
    }
  }, [currentIndex, currentQ?.id]);

  // Handle start button
  const handleStartArena = () => {
    sound.playClick();
    setHasStarted(true);
    setCurrentIndex(0);
  };

  // Check if student has entered/selected an answer
  const isAnswerProvided = (): boolean => {
    if (currentQ.type === 'single_choice') return Boolean(singleChoiceAnswer);
    if (currentQ.type === 'multiple_choice') return multipleChoiceAnswers.length > 0;
    if (currentQ.type === 'numeric_input') return Boolean(numericAnswer.trim());
    if (currentQ.type === 'fill_blank') return Boolean(fillBlankAnswer.trim());
    if (currentQ.type === 'matching') return Object.keys(matchingPairs).length >= (currentQ.matchingData?.colA.length || 0);
    if (currentQ.type === 'true_false') return Object.keys(trueFalseAnswers).length >= (currentQ.trueFalseData?.statements.length || 0);
    if (currentQ.type === 'ordering') return true;
    if (currentQ.type === 'svg_angle_click') return Boolean(svgSelectedAngle);
    return false;
  };

  // Submit answer for grading
  const handleSubmit = async () => {
    if (isSubmitting || questionResult?.isCompleted) return;

    let payloadAnswer: any = null;

    if (currentQ.type === 'single_choice') {
      if (!singleChoiceAnswer) return;
      payloadAnswer = singleChoiceAnswer;
    } else if (currentQ.type === 'multiple_choice') {
      if (multipleChoiceAnswers.length === 0) return;
      payloadAnswer = multipleChoiceAnswers;
    } else if (currentQ.type === 'numeric_input') {
      if (!numericAnswer.trim()) return;
      payloadAnswer = numericAnswer.trim();
    } else if (currentQ.type === 'fill_blank') {
      if (!fillBlankAnswer.trim()) return;
      payloadAnswer = fillBlankAnswer.trim();
    } else if (currentQ.type === 'matching') {
      if (Object.keys(matchingPairs).length < (currentQ.matchingData?.colA.length || 0)) {
        return; // require full pairs
      }
      payloadAnswer = matchingPairs;
    } else if (currentQ.type === 'true_false') {
      if (Object.keys(trueFalseAnswers).length < (currentQ.trueFalseData?.statements.length || 0)) {
        return; // require all statements answered
      }
      payloadAnswer = trueFalseAnswers;
    } else if (currentQ.type === 'ordering') {
      payloadAnswer = orderingItems;
    } else if (currentQ.type === 'svg_angle_click') {
      if (!svgSelectedAngle) return;
      payloadAnswer = svgSelectedAngle;
    }

    setIsSubmitting(true);

    // 1. TÍNH TOÁN KẾT QUẢ NGAY TỨC THÌ PHÍA CLIENT (0 GIÂY ĐỘ TRỄ)
    const currentAttempts = questionResult?.attemptsCount || 0;
    const localResult = gradeArenaQuestionLocally(currentQ, payloadAnswer, currentAttempts);

    if (localResult.isCorrect) {
      if (localResult.attemptsCount === 1) {
        sound.playCorrect();
      } else {
        sound.playRetrySuccess();
      }
    } else {
      sound.playWrong();
    }

    setQuestionResult({
      ...localResult,
      positiveFeedback: currentQ.positiveFeedback,
      encouragingFeedback: currentQ.encouragingFeedback,
    });

    // 2. CẬP NHẬT SESSION VÀ BỘ NHỚ LOCALSTORAGE NGAY LẬP TỨC
    const activeSession: SessionData = session || {
      sessionId: 'arena_' + Date.now(),
      student,
      moduleId: 'BAI9_DAU_TRUONG_TRI_TUE',
      startTime: Date.now(),
      maxScore: 100,
      attempts: {},
      totalScore: 0,
      isFinished: false,
    };

    const currentScore = activeSession.totalScore || 0;
    const updatedAttempts = { ...(activeSession.attempts || {}) };
    updatedAttempts[currentQ.id] = {
      questionId: currentQ.id,
      attemptsCount: localResult.attemptsCount,
      isCompleted: localResult.isCompleted,
      isCorrect: localResult.isCorrect,
      earnedScore: localResult.earnedScore,
      userSelectedOptions: payloadAnswer,
      canRetry: localResult.canRetry,
    };

    const updatedSession: SessionData = {
      ...activeSession,
      totalScore: currentScore + localResult.earnedScore,
      attempts: updatedAttempts,
    };

    setSession(updatedSession);
    localStorage.setItem('toan7_arena_session', JSON.stringify(updatedSession));
    setIsSubmitting(false);

    // 3. ĐỒNG BỘ NỀN LÊN MÁY CHỦ (BACKGROUND FETCH - KHÔNG CHẶN GIAO DIỆN)
    try {
      fetch('/api/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: updatedSession.sessionId,
          questionId: currentQ.id,
          selectedOptionId: typeof payloadAnswer === 'string' ? payloadAnswer : undefined,
          responseData: payloadAnswer,
        }),
      }).catch(() => {});
    } catch {}
  };

  // Handle retry
  const handleRetry = () => {
    sound.playClick();
    setQuestionResult(null);
    if (currentQ.type === 'single_choice') setSingleChoiceAnswer(null);
    if (currentQ.type === 'multiple_choice') setMultipleChoiceAnswers([]);
    if (currentQ.type === 'numeric_input') setNumericAnswer('');
    if (currentQ.type === 'fill_blank') setFillBlankAnswer('');
    if (currentQ.type === 'matching') {
      setMatchingPairs({});
      setSelectedColA(null);
    }
    if (currentQ.type === 'true_false') setTrueFalseAnswers({});
    if (currentQ.type === 'svg_angle_click') setSvgSelectedAngle(null);
  };

  // Next Question or Finish
  const handleNext = async () => {
    sound.playClick();
    if (currentIndex < ARENA_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finalize Arena Session
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/session/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session?.sessionId }),
        });
        const data = await res.json();
        sound.playVictory();

        // Calculate topics
        const mastered: string[] = [];
        const review: string[] = [];
        ARENA_QUESTIONS.forEach((q) => {
          const att = session?.attempts[q.id];
          if (att?.isCorrect) {
            mastered.push(q.knowledgeTopic);
          } else {
            review.push(q.knowledgeTopic);
          }
        });

        setFinalStats({
          totalScore: session?.totalScore || 0,
          maxScore: 100,
          percentage: Math.round(((session?.totalScore || 0) / 100) * 1000) / 10,
          firstTryCount: data.firstTryCorrectCount || 0,
          retryCount: data.retryCorrectCount || 0,
          wrongCount: data.wrongCount || 0,
          masteredTopics: Array.from(new Set(mastered)),
          reviewTopics: Array.from(new Set(review)),
        });

        setIsFinished(true);
        localStorage.removeItem('toan7_arena_session');
      } catch (err) {
        console.error('Lỗi kết thúc Đấu trường:', err);
        setIsFinished(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Start fresh arena challenge
  const handleRestartChallenge = async () => {
    localStorage.removeItem('toan7_arena_session');
    setHasStarted(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setFinalStats(null);
    await initArenaSession();
  };

  // Helper for ordering
  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    if (questionResult?.isCompleted) return;
    sound.playClick();
    const updated = [...orderingItems];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderingItems(updated);
  };

  // ========================================================
  // RENDER: SCREEN 1 - INTRO OVERVIEW
  // ========================================================
  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-blue-500/30">
          {/* Decorative glow elements */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold mb-6">
            <Swords className="w-4 h-4 text-amber-400" />
            <span>Phân Hệ Thi Đấu Tương Tác Cao</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200">
            ĐẤU TRƯỜNG TRÍ TUỆ
          </h2>
          <p className="text-base sm:text-lg text-blue-200/90 font-medium mb-6">
            Chủ đề: <span className="text-amber-300 font-bold">Chinh phục hai đường thẳng song song</span>
          </p>

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Chào mừng <strong className="text-amber-300 font-bold">{student.name}</strong> ({student.className})!
            Đấu trường trí tuệ gồm <strong>20 thử thách đa dạng hình thức</strong>: trắc nghiệm chọn một hoặc nhiều phương án, điền số, kéo thả ghép cột, đúng/sai, sắp xếp bước chứng minh, chọn trực tiếp góc trên hình SVG và điền từ khóa.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-black text-white">20</div>
              <div className="text-xs text-slate-400">Câu hỏi thử thách</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-black text-amber-400">100</div>
              <div className="text-xs text-slate-400">Điểm tối đa (5đ/câu)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-black text-emerald-400">1 Lần</div>
              <div className="text-xs text-slate-400">Làm lại nhận 2.5đ</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              <div className="text-2xl font-black text-rose-400">8 Dạng</div>
              <div className="text-xs text-slate-400">Tương tác phong phú</div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleStartArena}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-95"
            >
              <span>BẮT ĐẦU THỬ THÁCH</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoToLeaderboard}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Xem Bảng Xếp Hạng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER: SCREEN 2 - COMPLETION SUMMARY
  // ========================================================
  if (isFinished && finalStats) {
    const isMaster = finalStats.percentage >= 90;
    const isProficient = finalStats.percentage >= 70;

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 text-white">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
            Chúc mừng {student.name}!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
            Em đã hoàn thành xuất sắc 20 thử thách của <strong className="text-blue-600 dark:text-blue-400">Đấu trường trí tuệ</strong>! Kết quả của em đã được lưu và cập nhật lên hệ thống.
          </p>

          {/* Big Score Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-sm mx-auto mb-8">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
              Tổng điểm đạt được
            </div>
            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-1">
              {finalStats.totalScore}
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-500"> / 100</span>
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tỷ lệ chính xác: <span className="text-emerald-600 font-bold">{finalStats.percentage}%</span>
            </div>
          </div>

          {/* Detailed stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto text-center">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {finalStats.firstTryCount}
              </div>
              <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                Đúng lần 1 (+5đ)
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {finalStats.retryCount}
              </div>
              <div className="text-[11px] font-medium text-blue-800 dark:text-blue-300">
                Đúng lần 2 (+2.5đ)
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <div className="text-xl font-bold text-rose-700 dark:text-rose-400">
                {finalStats.wrongCount}
              </div>
              <div className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
                Chưa đúng (0đ)
              </div>
            </div>
          </div>

          {/* Knowledge mastery section */}
          <div className="text-left mb-8 space-y-4">
            {finalStats.masteredTopics.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kiến thức đã nắm vững ({finalStats.masteredTopics.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {finalStats.masteredTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {finalStats.reviewTopics.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Kiến thức cần lưu ý ôn tập ({finalStats.reviewTopics.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {finalStats.reviewTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToLeaderboard}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Xem Bảng Xếp Hạng</span>
            </button>

            <button
              onClick={handleRestartChallenge}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại thử thách mới</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER: SCREEN 3 - QUESTION ARENA PLAYGROUND
  // ========================================================
  return (
    <div className="max-w-[1440px] mx-auto py-4 px-2 sm:px-6 space-y-6">
      {/* Top Status Bar: Progress, Question Number & Score */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/20">
            {currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Đấu Trường Trí Tuệ • Câu {currentIndex + 1}/20
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {currentQ.knowledgeTopic}
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentQ.title}
            </div>
          </div>
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400">Điểm hiện tại</div>
            <div className="text-xl font-black text-amber-500 flex items-center gap-1 justify-end">
              <Trophy className="w-5 h-5" />
              <span>{session?.totalScore ?? 0}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / ARENA_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card with Responsive 2-Column Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className={currentQ.diagramConfig ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "max-w-4xl mx-auto space-y-6"}>
          {/* LEFT COLUMN: Large Diagram Canvas (if any) */}
          {currentQ.diagramConfig && (
            <div className="lg:col-span-6 xl:col-span-6 space-y-3">
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-inner">
                <GeometryCanvas
                  baseAngle={currentQ.diagramConfig.baseAngle}
                  isParallel={currentQ.diagramConfig.isParallel}
                  highlightAngles={currentQ.diagramConfig.highlightAngles}
                  knownAngles={currentQ.diagramConfig.knownAngles}
                  customLabels={currentQ.diagramConfig.customLabels}
                  interactive={currentQ.type === 'svg_angle_click' && !questionResult?.isCompleted}
                  selectedAngle={svgSelectedAngle}
                  onAngleClick={(angle) => {
                    if (currentQ.type === 'svg_angle_click' && !questionResult?.isCompleted) {
                      sound.playClick();
                      setSvgSelectedAngle(angle);
                    }
                  }}
                />
              </div>

              {currentQ.type === 'svg_angle_click' && !questionResult?.isCompleted ? (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                  <p className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                    👉 Hãy chạm/bấm trực tiếp vào vùng góc trên hình vẽ ở trên!
                  </p>
                  {svgSelectedAngle && (
                    <div className="mt-1.5 inline-block px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-sm">
                      Góc em đang chọn: ∠{svgSelectedAngle}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-center text-slate-400 italic">
                  Sơ đồ hình học chuẩn: đường thẳng c cắt hai đường thẳng a và b
                </p>
              )}
            </div>
          )}

          {/* RIGHT COLUMN: Prompt, Question Interaction Area, Submit & Feedback */}
          <div className={currentQ.diagramConfig ? "lg:col-span-6 xl:col-span-6 space-y-6" : "space-y-6"}>
            {/* Prompt */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                <MathText text={currentQ.prompt} />
              </p>
            </div>

            {/* Interaction Area */}

        {/* 1. SINGLE CHOICE */}
        {currentQ.type === 'single_choice' && currentQ.options && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = singleChoiceAnswer === opt.id;
                const isLocked = Boolean(questionResult?.isCompleted);
                const isCorrectOption = opt.id === currentQ.correctSingleOption;
                const cleanText = opt.text.replace(/^[A-F]\.\s*/, '');

                let buttonStyle =
                  'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs';

                if (!isLocked) {
                  if (isSelected) {
                    buttonStyle =
                      'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/30 shadow-sm';
                  }
                } else {
                  if (isCorrectOption) {
                    buttonStyle =
                      'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/40 shadow-sm';
                  } else if (isSelected && !questionResult?.isCorrect) {
                    buttonStyle =
                      'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-100 line-through opacity-85';
                  } else {
                    buttonStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      sound.playClick();
                      setSingleChoiceAnswer(opt.id);
                    }}
                    className={`w-full p-4 sm:p-4.5 rounded-2xl text-left font-semibold text-base sm:text-lg border transition-all flex items-center justify-between cursor-pointer group active:scale-98 ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <span
                        className={`w-8 h-8 rounded-xl font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-colors ${
                          isLocked && isCorrectOption
                            ? 'bg-emerald-600 text-white'
                            : isLocked && isSelected && !questionResult?.isCorrect
                            ? 'bg-rose-600 text-white'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <MathText text={cleanText} className="text-base sm:text-lg leading-relaxed" />
                    </div>

                    <div className="shrink-0 ml-2">
                      {isLocked && isCorrectOption && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      )}
                      {isLocked && isSelected && !questionResult?.isCorrect && (
                        <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                      )}
                      {!isLocked && isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. MULTIPLE CHOICE */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic">
              👉 Em hãy tích chọn tất cả các phương án đúng rồi bấm "Xác nhận câu trả lời":
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = multipleChoiceAnswers.includes(opt.id);
                const isLocked = Boolean(questionResult?.isCompleted);
                const isShouldBeSelected = currentQ.correctMultipleOptions?.includes(opt.id);
                const cleanText = opt.text.replace(/^[A-F]\.\s*/, '');

                let btnStyle =
                  'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                if (!isLocked) {
                  if (isSelected) {
                    btnStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20';
                  }
                } else {
                  if (isShouldBeSelected) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold';
                  } else if (isSelected && !isShouldBeSelected) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-100 line-through opacity-85';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      sound.playClick();
                      if (isSelected) {
                        setMultipleChoiceAnswers(multipleChoiceAnswers.filter((id) => id !== opt.id));
                      } else {
                        setMultipleChoiceAnswers([...multipleChoiceAnswers, opt.id]);
                      }
                    }}
                    className={`p-4 rounded-2xl text-left font-semibold text-sm sm:text-base border transition-all flex items-center gap-3.5 cursor-pointer ${btnStyle}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                        isLocked && isShouldBeSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isLocked && isSelected && !isShouldBeSelected
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {((isLocked && isShouldBeSelected) || isSelected) && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <MathText text={cleanText} className="text-base sm:text-lg" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. NUMERIC INPUT */}
        {currentQ.type === 'numeric_input' && (
          <div className="max-w-md mx-auto my-4 space-y-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Nhập kết quả số:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled={questionResult?.isCompleted}
                value={numericAnswer}
                onChange={(e) => setNumericAnswer(e.target.value)}
                placeholder="Ví dụ: 67 hoặc 67°"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xl font-bold text-slate-500">°</span>
            </div>
          </div>
        )}

        {/* 4. FILL IN BLANK */}
        {currentQ.type === 'fill_blank' && (
          <div className="max-w-md mx-auto my-4 space-y-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Nhập cụm từ còn thiếu:
            </label>
            <input
              type="text"
              disabled={questionResult?.isCompleted}
              value={fillBlankAnswer}
              onChange={(e) => setFillBlankAnswer(e.target.value)}
              placeholder="Nhập cụm từ vào đây..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* 5. MATCHING COLUMNS */}
        {currentQ.type === 'matching' && currentQ.matchingData && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Hướng dẫn: Bấm vào một mục ở <strong>Cột A</strong> rồi bấm vào định nghĩa tương ứng ở <strong>Cột B</strong> để ghép đôi!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column A */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cột A: Khái niệm / Cặp góc
                </div>
                {currentQ.matchingData.colA.map((item) => {
                  const isSelected = selectedColA === item.id;
                  const matchedTarget = matchingPairs[item.id];
                  const isLocked = questionResult?.isCompleted;

                  return (
                    <button
                      key={item.id}
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return;
                        sound.playClick();
                        setSelectedColA(item.id);
                      }}
                      className={`w-full p-3.5 rounded-xl text-left text-sm font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500/30'
                          : matchedTarget
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <MathText text={item.text} />
                      {matchedTarget && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shrink-0 ml-2">
                          ➜ {matchedTarget}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Column B */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cột B: Định nghĩa / Kết luận
                </div>
                {currentQ.matchingData.colB.map((item) => {
                  const isLocked = questionResult?.isCompleted;
                  // check which colA is matched with this
                  const matchedFrom = Object.keys(matchingPairs).find((k) => matchingPairs[k] === item.id);

                  return (
                    <button
                      key={item.id}
                      disabled={isLocked || !selectedColA}
                      onClick={() => {
                        if (isLocked || !selectedColA) return;
                        sound.playClick();
                        setMatchingPairs({
                          ...matchingPairs,
                          [selectedColA]: item.id,
                        });
                        setSelectedColA(null);
                      }}
                      className={`w-full p-3.5 rounded-xl text-left text-sm border transition-all flex items-center justify-between cursor-pointer ${
                        selectedColA
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                          : matchedFrom
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <MathText text={item.text} />
                      {matchedFrom && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shrink-0 ml-2">
                          Ghép với: {matchedFrom}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {Object.keys(matchingPairs).length > 0 && !questionResult?.isCompleted && (
              <div className="text-right">
                <button
                  onClick={() => setMatchingPairs({})}
                  className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                >
                  Xóa tất cả các cặp đã ghép để làm lại
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. TRUE / FALSE */}
        {currentQ.type === 'true_false' && currentQ.trueFalseData && (
          <div className="space-y-3">
            {currentQ.trueFalseData.statements.map((stmt, idx) => {
              const currentVal = trueFalseAnswers[stmt.id];
              const isLocked = questionResult?.isCompleted;

              return (
                <div
                  key={stmt.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <strong className="text-blue-600 shrink-0">Ý {idx + 1}:</strong>
                    <MathText text={stmt.text} />
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return;
                        sound.playClick();
                        setTrueFalseAnswers({ ...trueFalseAnswers, [stmt.id]: true });
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentVal === true
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      ĐÚNG
                    </button>
                    <button
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return;
                        sound.playClick();
                        setTrueFalseAnswers({ ...trueFalseAnswers, [stmt.id]: false });
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentVal === false
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      SAI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 7. ORDERING STEPS */}
        {currentQ.type === 'ordering' && currentQ.orderingData && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Sử dụng các nút mũi tên lên/xuống để sắp xếp các bước theo đúng trình tự lập luận:
            </p>
            <div className="space-y-2">
              {orderingItems.map((itemId, idx) => {
                const itemObj = currentQ.orderingData?.items.find((i) => i.id === itemId);
                const isLocked = questionResult?.isCompleted;

                return (
                  <div
                    key={itemId}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <MathText text={itemObj?.text || ''} className="text-sm font-medium text-slate-800 dark:text-slate-200" />
                    </div>

                    {!isLocked && (
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveOrderItem(idx, idx - 1)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === orderingItems.length - 1}
                          onClick={() => moveOrderItem(idx, idx + 1)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SUBMIT / RETRY / NEXT ACTION BAR
        ======================================================== */}
        {/* ========================================================
            SUBMIT / RETRY / NEXT ACTION BAR
        ======================================================== */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {!questionResult?.isCompleted && !questionResult?.canRetry && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleSubmit}
                disabled={!isAnswerProvided() || isSubmitting}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 ${
                  isAnswerProvided() && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 ring-2 ring-blue-400/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <span>XÁC NHẬN CÂU TRẢ LỜI (5đ)</span>
                <Sparkles className="w-5 h-5" />
              </button>

              {!isAnswerProvided() && (
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic font-medium">
                  👉 Em hãy chọn hoặc nhập câu trả lời ở trên trước khi bấm xác nhận
                </span>
              )}
            </div>
          )}

          {/* Feedback & Navigation when finished or retry */}
          {questionResult && (
            <div className="w-full space-y-4 animate-in fade-in duration-300">
              {/* Feedback Alert Box */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  questionResult.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : questionResult.canRetry
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {questionResult.isCorrect ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : questionResult.canRetry ? (
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <div className="font-black text-base sm:text-lg">
                      {questionResult.isCorrect
                        ? `🎉 Chính xác, ${student.name}! Em nhận được +${questionResult.earnedScore} điểm.`
                        : questionResult.canRetry
                        ? `⚠️ Chưa chính xác rồi, ${student.name}. Em còn 1 cơ hội làm lại để nhận 2,5 điểm!`
                        : `❌ Rất tiếc, ${student.name}. Em nhận 0 điểm cho câu này. Hãy xem kỹ lời giải nhé!`}
                    </div>

                    {questionResult.hint && questionResult.canRetry && (
                      <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                        💡 <strong>Gợi ý:</strong> <MathText text={questionResult.hint} />
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nút xem lời giải chi tiết (Hiện khi đã hoàn thành hoặc sai lần 1) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{showExplanation ? 'Ẩn lời giải chi tiết' : '📖 Xem lời giải chi tiết'}</span>
                  {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Các nút hành động chính */}
                <div className="flex items-center gap-3 ml-auto">
                  {questionResult.canRetry && !questionResult.isCompleted && (
                    <button
                      onClick={handleRetry}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/25 active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>LÀM LẠI CÂU NÀY (2.5đ)</span>
                    </button>
                  )}

                  {questionResult.isCompleted && (
                    <button
                      onClick={handleNext}
                      className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{currentIndex < ARENA_QUESTIONS.length - 1 ? 'CÂU TIẾP THEO' : 'XEM KẾT QUẢ TỔNG KẾT'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Khung nội dung lời giải chi tiết (hiển thị khi bấm nút) */}
              {showExplanation && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-blue-200 dark:border-blue-800/80 shadow-inner space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Lời giải chi tiết từng bước:</span>
                  </div>
                  <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed pl-1">
                    <MathText text={questionResult.explanation || currentQ.explanation} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};
