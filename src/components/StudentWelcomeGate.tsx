/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile } from '../types.ts';
import { sound } from '../utils/audio.ts';
import {
  GraduationCap,
  User,
  School,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface StudentWelcomeGateProps {
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

const AVATARS = ['👨‍🎓', '👩‍🎓', '🌟', '🚀', '💡', '🏆', '📐', '🧠', '⭐', '🎯'];

export const StudentWelcomeGate: React.FC<StudentWelcomeGateProps> = ({
  onComplete,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [className, setClassName] = useState(initialProfile?.className || '');
  const [school, setSchool] = useState(initialProfile?.school || '');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '👨‍🎓');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên của em.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Họ và tên phải có ít nhất 3 ký tự.';
    }

    if (!className.trim()) {
      newErrors.className = 'Vui lòng nhập lớp học (ví dụ: 7A1, 7A2...).';
    }

    if (!school.trim()) {
      newErrors.school = 'Vui lòng nhập tên trường THCS.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      sound.playWrong();
      return;
    }

    sound.playCorrect();

    const profile: StudentProfile = {
      id: initialProfile?.id || 'std_' + Date.now(),
      name: name.trim(),
      className: className.trim(),
      school: school.trim(),
      avatar,
    };

    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl w-full bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-2">
            <GraduationCap className="w-9 h-9" />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
            HÌNH HỌC TOÁN 7 • BÀI 9
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200">
            CHÀO MỪNG EM ĐẾN VỚI LỚP HỌC!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Trước khi bắt đầu bài học <strong className="text-amber-300">"Hai đường thẳng song song và dấu hiệu nhận biết"</strong>, em hãy điền đầy đủ thông tin để hệ thống ghi nhận điểm số và vinh danh trên Bảng xếp hạng nhé.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={validateAndSubmit} className="space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
              Chọn ảnh đại diện của em:
            </label>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAvatar(av);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    avatar === av
                      ? 'bg-blue-600 scale-110 shadow-lg ring-2 ring-blue-300 ring-offset-2 ring-offset-slate-900'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Họ và tên học sinh <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Ví dụ: Nguyễn Lê Thùy Trang"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/90 border text-white text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-400 font-medium mt-1 pl-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Class and School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Class */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Lớp học <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    if (errors.className) setErrors({ ...errors, className: '' });
                  }}
                  placeholder="Ví dụ: 7A1"
                  className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-800/90 border text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.className ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.className && (
                <p className="text-xs text-rose-400 font-medium mt-1 pl-1">
                  {errors.className}
                </p>
              )}
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Trường THCS <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => {
                    setSchool(e.target.value);
                    if (errors.school) setErrors({ ...errors, school: '' });
                  }}
                  placeholder="Ví dụ: THCS Chu Văn An"
                  className={`w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-800/90 border text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.school ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.school && (
                <p className="text-xs text-rose-400 font-medium mt-1 pl-1">
                  {errors.school}
                </p>
              )}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Thông tin của em được bảo mật và dùng để lưu kết quả bài làm, bảng xếp hạng và đồng bộ Google Sheets.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-98"
          >
            <span>BẮT ĐẦU HỌC TẬP & THI ĐẤU NGAY</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};
