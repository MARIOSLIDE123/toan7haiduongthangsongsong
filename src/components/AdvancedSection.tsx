/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AdvancedQuestion, StudentProfile, SessionData } from '../types.ts';
import { ADVANCED_QUESTIONS } from '../data/advancedQuestions.ts';
import { GeometryCanvas } from './GeometryCanvas.tsx';
import { sound } from '../utils/audio.ts';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Compass,
  Building2,
  Award,
  Eye,
  Check,
} from 'lucide-react';

interface AdvancedSectionProps {
  student: StudentProfile;
  onGoToLeaderboard: () => void;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({
  student,
  onGoToLeaderboard,
}) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Result state for current question
  const [currentResult, setCurrentResult] = useState<{
    isCorrect: boolean;
    earnedScore: number;
    explanation?: {
      summary: string;
      steps: string[];
      conclusion: string;
    };
  } | null>(null);

  const currentQ: AdvancedQuestion = ADVANCED_QUESTIONS[currentIndex];

  // Initialize or restore session
  const initAdvancedSession = async () => {
    try {
      const savedStorage = localStorage.getItem('toan7_vdc_session');
      if (savedStorage) {
        try {
          const parsed = JSON.parse(savedStorage);
          if (parsed && parsed.sessionId && parsed.student?.id === student.id) {
            setSession(parsed);
            setHasStarted(true);
            if (parsed.isFinished) {
              setIsFinished(true);
              return;
            }
            // Resume at first uncompleted question
            const completedIds = Object.keys(parsed.attempts || {});
            const nextIdx = Math.min(completedIds.length, ADVANCED_QUESTIONS.length - 1);
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
          moduleId: 'BAI9_VAN_DUNG_CAO',
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        localStorage.setItem('toan7_vdc_session', JSON.stringify(data.session));
      }
    } catch (e) {
      console.error('Lỗi khởi tạo phiên Vận dụng cao:', e);
    }
  };

  useEffect(() => {
    initAdvancedSession();
  }, [student.id]);

  // Sync state when index changes
  useEffect(() => {
    if (!currentQ) return;
    setSelectedOption(null);
    setCurrentResult(null);

    // If already attempted in session, restore locked state
    if (session && session.attempts[currentQ.id]) {
      const att = session.attempts[currentQ.id];
      setSelectedOption(att.userSelectedOptions as string);
      setCurrentResult({
        isCorrect: att.isCorrect,
        earnedScore: att.earnedScore,
        explanation: currentQ.explanation,
      });
    }
  }, [currentIndex, currentQ?.id]);

  // Start Challenge
  const handleStart = () => {
    sound.playClick();
    setHasStarted(true);
    setCurrentIndex(0);
  };

  // Submit Answer - STRICT NO RETRY: Lock immediately!
  const handleConfirmAnswer = async () => {
    if (!session || !selectedOption || isSubmitting || currentResult !== null) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionId: currentQ.id,
          selectedOptionId: selectedOption,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.isCorrect) {
          sound.playCorrect();
        } else {
          sound.playWrong();
        }

        setCurrentResult({
          isCorrect: data.isCorrect,
          earnedScore: data.earnedScore,
          explanation: data.explanation || currentQ.explanation,
        });

        // Update local session immediately and lock
        const updatedAttempts = { ...session.attempts };
        updatedAttempts[currentQ.id] = {
          questionId: currentQ.id,
          attemptsCount: 1,
          isCompleted: true,
          isCorrect: data.isCorrect,
          earnedScore: data.earnedScore,
          userSelectedOptions: selectedOption,
          canRetry: false,
        };

        const updatedSession: SessionData = {
          ...session,
          totalScore: data.totalScore,
          attempts: updatedAttempts,
        };

        setSession(updatedSession);
        localStorage.setItem('toan7_vdc_session', JSON.stringify(updatedSession));
      }
    } catch (err) {
      console.error('Lỗi khi xác nhận đáp án VDC:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go to next question or finalize
  const handleNext = async () => {
    sound.playClick();
    if (currentIndex < ADVANCED_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finalize session
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/session/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session?.sessionId }),
        });
        sound.playVictory();
        setIsFinished(true);

        if (session) {
          const finishedSession: SessionData = { ...session, isFinished: true };
          setSession(finishedSession);
          localStorage.setItem('toan7_vdc_session', JSON.stringify(finishedSession));
        }
      } catch (err) {
        console.error('Lỗi hoàn thành VDC:', err);
        setIsFinished(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ========================================================
  // RENDER: SCREEN 1 - INTRO OVERVIEW
  // ========================================================
  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-amber-500/30">
          {/* Subtle amber glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Thử Thách Tư Duy — Vận Dụng Hình Học Vào Cuộc Sống</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
            VẬN DỤNG CAO
          </h2>
          <p className="text-base sm:text-lg text-amber-300/90 font-medium mb-6">
            Giải quyết các tình huống kỹ thuật và đời sống thực tế với Toán 7 Bài 9
          </p>

          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            Thử thách đặc biệt dành cho <strong className="text-white font-bold">{student.name}</strong> ({student.className})!
            Bộ đề gồm <strong>10 bài toán thực tế có độ khó cao</strong>: từ nghiệm thu vạch kẻ đường giao thông, kiểm tra vì kèo mái nhà, kết cấu giàn cầu thép đến lắp đặt tấm pin mặt trời và quy hoạch nút giao nội bộ.
          </p>

          {/* Strict Rule Warning Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3 mb-8">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong>QUY CHẾ THI CHÍNH THỨC (KHÔNG LÀM LẠI):</strong> Mỗi câu hỏi chỉ có <strong>duy nhất một lượt chọn và xác nhận</strong>. Ngay khi bấm “XÁC NHẬN ĐÁP ÁN”, hệ thống sẽ khóa câu hỏi và chấm điểm vĩnh viễn (10 điểm nếu đúng, 0 điểm nếu sai). Em hãy suy nghĩ và tính toán thật cẩn thận trước khi bấm xác nhận nhé!
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-black text-white">10</div>
              <div className="text-xs text-slate-400">Tình huống thực tế</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-black text-amber-400">100</div>
              <div className="text-xs text-slate-400">Điểm tối đa (10đ/câu)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <ShieldAlert className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              <div className="text-2xl font-black text-rose-400">1 Lượt</div>
              <div className="text-xs text-slate-400">Không có làm lại</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-black text-cyan-400">100%</div>
              <div className="text-xs text-slate-400">Khóa & Lưu bảo mật</div>
            </div>
          </div>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-95"
            >
              <span>BẮT ĐẦU THỬ THÁCH VẬN DỤNG CAO</span>
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
  if (isFinished && !reviewMode) {
    const totalScore = session?.totalScore || 0;
    const correctCount = Object.values(session?.attempts || {}).filter((a) => a.isCorrect).length;
    const percentage = Math.round((totalScore / 100) * 1000) / 10;

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 text-white">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
            Chúc mừng {student.name} đã hoàn thành thử thách Vận dụng cao!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
            Kết quả của em đã được ghi nhận chính thức và khóa bảo vệ chống sửa đổi.
          </p>

          {/* Big Score Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto mb-8">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
              Điểm Vận Dụng Cao
            </div>
            <div className="text-5xl font-black text-amber-600 dark:text-amber-400 mb-1">
              {totalScore}
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-500"> / 100</span>
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Đúng: <strong className="text-emerald-600">{correctCount} / 10 câu</strong> ({percentage}%)
            </div>
          </div>

          {/* Buttons: Review and Leaderboard */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                setReviewMode(true);
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Xem lại bài làm & Lời giải 10 câu</span>
            </button>

            <button
              onClick={onGoToLeaderboard}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Xem Bảng Xếp Hạng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER: SCREEN 3 - QUESTION DETAILS (LIVE OR REVIEW)
  // ========================================================
  const isQuestionLocked = currentResult !== null || Boolean(session?.attempts[currentQ.id]?.isCompleted);

  return (
    <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto py-4 px-2 sm:px-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-amber-500/20">
            {currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Câu {currentIndex + 1} / 10
              </span>
              <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-800">
                VẬN DỤNG CAO
              </span>
              {reviewMode && (
                <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                  Chế độ xem lại
                </span>
              )}
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentQ.title}
            </div>
          </div>
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Điểm tích lũy</div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 justify-end">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>{session?.totalScore ?? 0}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / ADVANCED_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Two-Column Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* CỘT TRÁI: BỐI CẢNH THỰC TẾ & HÌNH VẼ SVG TO LỚN */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5">
            {/* Real-life context box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5">
                <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Bối cảnh thực tế:</span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-amber-950 dark:text-amber-200 leading-relaxed italic font-medium">
                "{currentQ.realLifeContext}"
              </p>
            </div>

            {/* Diagram SVG */}
            {currentQ.diagramConfig && (
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-inner">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Mô hình hình học thực địa</span>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Quy chuẩn SVG Toán 7
                  </span>
                </div>
                <div className="w-full flex items-center justify-center">
                  <GeometryCanvas
                    baseAngle={currentQ.diagramConfig.baseAngle}
                    isParallel={currentQ.diagramConfig.isParallel}
                    highlightAngles={currentQ.diagramConfig.highlightAngles}
                    knownAngles={currentQ.diagramConfig.knownAngles}
                    customLabels={currentQ.diagramConfig.customLabels}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: ĐỀ BÀI, 4 PHƯƠNG ÁN TRẮC NGHIỆM VÀ PHẢN HỒI LỜI GIẢI */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            {/* Prompt */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <p className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                {currentQ.prompt}
              </p>
            </div>

            {/* 4 Options: A, B, C, D */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                const isSelected = selectedOption === opt.id;
                const isCorrectOption = currentQ.correctOptionId === opt.id;

                let buttonStyle =
                  'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs';

                if (!isQuestionLocked && isSelected) {
                  buttonStyle =
                    'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30 shadow-md';
                } else if (isQuestionLocked) {
                  if (isCorrectOption) {
                    buttonStyle =
                      'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm';
                  } else if (isSelected && !currentResult?.isCorrect) {
                    buttonStyle =
                      'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-950 dark:text-rose-100 line-through opacity-90';
                  } else {
                    buttonStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isQuestionLocked}
                    onClick={() => {
                      if (isQuestionLocked) return;
                      sound.playClick();
                      setSelectedOption(opt.id);
                    }}
                    className={`w-full p-4 sm:p-4.5 rounded-2xl text-left font-semibold text-sm sm:text-base lg:text-lg border transition-all flex items-center justify-between cursor-pointer group active:scale-98 ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <span
                        className={`w-8 h-8 rounded-xl font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-colors ${
                          isSelected && !isQuestionLocked
                            ? 'bg-amber-500 text-white'
                            : isQuestionLocked && isCorrectOption
                            ? 'bg-emerald-600 text-white'
                            : isQuestionLocked && isSelected && !currentResult?.isCorrect
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {optLetter}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected && !isQuestionLocked && (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      {isQuestionLocked && isCorrectOption && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      )}
                      {isQuestionLocked && isSelected && !currentResult?.isCorrect && (
                        <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Lock Warning Note before confirming */}
            {!isQuestionLocked && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium italic flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Lưu ý: Sau khi bấm "XÁC NHẬN ĐÁP ÁN", câu hỏi sẽ bị khóa vĩnh viễn và không thể làm lại.
                </span>
              </div>
            )}

            {/* Action Button: Confirm or Result Feedback */}
            <div className="pt-2">
              {!isQuestionLocked ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 active:scale-95"
                >
                  <span>XÁC NHẬN ĐÁP ÁN (10 ĐIỂM)</span>
                  <Sparkles className="w-5 h-5" />
                </button>
              ) : (
                <div className="space-y-5">
                  {/* Feedback box */}
                  <div
                    className={`p-5 sm:p-6 rounded-2xl border ${
                      currentResult?.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {currentResult?.isCorrect ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-3 flex-1">
                        <div className="font-black text-base sm:text-lg">
                          {currentResult?.isCorrect
                            ? `Xuất sắc, ${student.name}! Em đã vận dụng chính xác dấu hiệu nhận biết hai đường thẳng song song (+10 điểm).`
                            : `Chưa chính xác rồi, ${student.name}. Em nhận 0 điểm cho câu này (Vận dụng cao không có lượt làm lại).`}
                        </div>

                        {currentResult?.explanation && (
                          <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-300">
                            <p className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                              {currentResult.explanation.summary}
                            </p>
                            <div className="space-y-1.5 pl-3 border-l-2 border-amber-500/60 dark:border-amber-400/60">
                              {currentResult.explanation.steps.map((st, i) => (
                                <p key={i} className="leading-relaxed">{st}</p>
                              ))}
                            </div>
                            <p className="font-bold text-blue-600 dark:text-blue-400 pt-1">
                              {currentResult.explanation.conclusion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation button */}
                  <div className="flex items-center justify-between gap-3">
                    {reviewMode && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          if (currentIndex > 0) setCurrentIndex((p) => p - 1);
                        }}
                        disabled={currentIndex === 0}
                        className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                      >
                        ← Câu trước
                      </button>
                    )}

                    <div className="ml-auto">
                      <button
                        onClick={handleNext}
                        className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <span>
                          {currentIndex < ADVANCED_QUESTIONS.length - 1
                            ? 'CÂU TIẾP THEO'
                            : reviewMode
                            ? 'HOÀN TẤT XEM LẠI'
                            : 'XEM KẾT QUẢ VẬN DỤNG CAO'}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
