/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { User, School, BookOpen, Sparkles } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onSave: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
}

const AVATARS = ['👨‍🎓', '👩‍🎓', '🌟', '🚀', '💡', '🏆', '📐', '✏️'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onSave,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Nguyễn Văn An');
  const [school, setSchool] = useState(initialProfile?.school || 'THCS Chu Văn An');
  const [className, setClassName] = useState(initialProfile?.className || '7A1');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '👨‍🎓');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên của em.');
      return;
    }
    sound.playClick();
    onSave({
      id: initialProfile?.id || 'std_' + Date.now(),
      name: name.trim(),
      school: school.trim() || 'THCS',
      className: className.trim() || '7',
      avatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
            {avatar}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Hồ sơ học sinh Toán 7
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nhập thông tin để hệ thống cá nhân hóa lời giải, chấm điểm và vinh danh trên bảng xếp hạng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Chọn ảnh đại diện
            </label>
            <div className="flex items-center justify-center gap-2 py-1">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    setAvatar(av);
                    sound.playClick();
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                    avatar === av
                      ? 'bg-blue-600 text-white scale-110 shadow-md ring-2 ring-blue-300'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Họ và tên học sinh <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Lớp
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="7A1"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Trường THCS
              </label>
              <div className="relative">
                <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="THCS Chu Văn An"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            Bắt đầu học & Luyện tập ngay
          </button>
        </form>
      </div>
    </div>
  );
};
