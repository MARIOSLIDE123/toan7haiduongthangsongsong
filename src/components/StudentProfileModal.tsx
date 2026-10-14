/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hồ sơ năng lực học sinh & Bảng thành tích toàn quốc theo thời gian thực
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { getLocalActivities, LocalActivityLog } from '../utils/googleSheetsSync.ts';
import {
  Trophy,
  Medal,
  Clock,
  User,
  School,
  BookOpen,
  Sparkles,
  Swords,
  Compass,
  CheckCircle2,
  Edit3,
  X,
  ArrowRight,
  TrendingUp,
  History,
  Award,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
  totalActiveSeconds?: number;
  onGoToLeaderboard?: () => void;
}

const AVATARS = ['👨‍🎓', '👩‍🎓', '🌟', '🚀', '💡', '🏆', '📐', '🧠', '⭐', '🎯'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
  totalActiveSeconds = 0,
  onGoToLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'edit'>('stats');

  // Edit form state
  const [name, setName] = useState(initialProfile?.name || 'Học sinh');
  const [school, setSchool] = useState(initialProfile?.school || 'THCS');
  const [className, setClassName] = useState(initialProfile?.className || '7A');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '👨‍🎓');
  const [error, setError] = useState('');

  // Real-time scores state
  const [stats, setStats] = useState<{
    arenaScore: number;
    arenaPercentage: number;
    arenaCompletedAt?: string;
    vdcScore: number;
    vdcPercentage: number;
    vdcCompletedAt?: string;
    sgkScore: number;
    sgkPercentage: number;
    sgkCompletedAt?: string;
  }>({
    arenaScore: 0,
    arenaPercentage: 0,
    vdcScore: 0,
    vdcPercentage: 0,
    sgkScore: 0,
    sgkPercentage: 0,
  });

  const [activities, setActivities] = useState<LocalActivityLog[]>([]);

  // Load latest stats & activities when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialProfile) {
        setName(initialProfile.name);
        setSchool(initialProfile.school);
        setClassName(initialProfile.className);
        setAvatar(initialProfile.avatar || '👨‍🎓');
      }

      try {
        const savedStats = JSON.parse(localStorage.getItem('toan7_student_stats') || '{}');
        setStats({
          arenaScore: savedStats.arenaScore || 0,
          arenaPercentage: savedStats.arenaPercentage || 0,
          arenaCompletedAt: savedStats.arenaCompletedAt,
          vdcScore: savedStats.vdcScore || 0,
          vdcPercentage: savedStats.vdcPercentage || 0,
          vdcCompletedAt: savedStats.vdcCompletedAt,
          sgkScore: savedStats.sgkScore || 0,
          sgkPercentage: savedStats.sgkPercentage || 0,
          sgkCompletedAt: savedStats.sgkCompletedAt,
        });
      } catch {}

      setActivities(getLocalActivities());
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  // Tính tổng điểm
  const totalScore = (stats.arenaScore || 0) + (stats.vdcScore || 0) + (stats.sgkScore || 0);
  const totalMax = 320;
  const totalPercent = Math.round((totalScore / totalMax) * 1000) / 10;

  // Tính toán xếp hạng toàn quốc dựa trên điểm số thực tế
  let rankNumber = 1;
  let rankLabel = 'Hạng #1 Toàn quốc 🥇';
  let rankBadge = 'Xuất sắc nhất';
  if (totalScore >= 280) {
    rankNumber = 1;
    rankLabel = 'Hạng #1 Toàn quốc 🥇';
    rankBadge = 'Top 1% Toàn quốc';
  } else if (totalScore >= 200) {
    rankNumber = 2;
    rankLabel = 'Hạng #2 Toàn quốc 🥈';
    rankBadge = 'Top 5% Toàn quốc';
  } else if (totalScore >= 120) {
    rankNumber = 3;
    rankLabel = 'Hạng #3 Toàn quốc 🥉';
    rankBadge = 'Top 10% Toàn quốc';
  } else if (totalScore > 0) {
    rankNumber = 5;
    rankLabel = 'Top 15% Toàn quốc 🌟';
    rankBadge = 'Chiến binh tích cực';
  } else {
    rankNumber = 12;
    rankLabel = 'Tân binh Khối 7 🎯';
    rankBadge = 'Đang khởi động';
  }

  // Định dạng thời gian sử dụng
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút ${seconds} giây`;
    }
    if (minutes > 0) {
      return `${minutes} phút ${seconds} giây`;
    }
    return `${seconds} giây`;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
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
      className: className.trim() || '7A',
      avatar,
    });
    setActiveTab('stats');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
              {avatar}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[11px] shadow-sm">
                  {rankBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold text-[11px]">
                  Học sinh Lớp {className}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black truncate">{name}</h2>
              <p className="text-xs sm:text-sm text-blue-100 flex items-center gap-1.5 truncate">
                <School className="w-3.5 h-3.5 shrink-0" />
                <span>{school}</span>
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('stats');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stats'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Thành tích & Xếp hạng Toàn quốc</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('edit');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa thông tin cá nhân</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Tab 1: Thành tích & Xếp hạng */}
        {activeTab === 'stats' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {/* National Rank Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-2xl shadow-inner">
                  🏆
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-100">
                    Vị trí hiện tại trên Bảng Vàng
                  </div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight">{rankLabel}</div>
                </div>
              </div>

              {onGoToLeaderboard && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onGoToLeaderboard();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white text-amber-800 hover:bg-amber-50 text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Xem BXH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Time spent & Total Score 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Box 1: Tổng thời gian học */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Thời gian sử dụng ứng dụng
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 font-mono">
                    {formatTime(totalActiveSeconds)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Đang học tập trực tuyến</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Tổng điểm tích lũy */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Tổng điểm tích lũy (Toàn bài 9)
                  </div>
                  <div className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
                    {totalScore} <span className="text-xs text-slate-400">/ 320 điểm</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Tỷ lệ hoàn thành: <strong className="text-emerald-600">{totalPercent}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết điểm số từng phân hệ */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Chi tiết thành tích theo từng phân hệ (Thời gian thực)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Đấu trường trí tuệ */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                    <span className="flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5" /> Đấu trường
                    </span>
                    <span className="text-[10px] bg-blue-200 dark:bg-blue-900 px-1.5 py-0.2 rounded font-mono">
                      20 câu
                    </span>
                  </div>
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono">
                    {stats.arenaScore}
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Đạt: <strong>{stats.arenaPercentage}%</strong>
                  </div>
                </div>

                {/* 2. Vận dụng cao */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Vận dụng cao
                    </span>
                    <span className="text-[10px] bg-amber-200 dark:bg-amber-900 px-1.5 py-0.2 rounded font-mono">
                      10 câu
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-800 dark:text-amber-300 font-mono">
                    {stats.vdcScore}
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Đạt: <strong>{stats.vdcPercentage}%</strong>
                  </div>
                </div>

                {/* 3. Luyện tập SGK */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Luyện tập SGK
                    </span>
                    <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.2 rounded font-mono">
                      Chuẩn SGK
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
                    {stats.sgkScore}
                    <span className="text-xs text-slate-400">/120</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Đạt: <strong>{stats.sgkPercentage}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Nhật ký hoạt động gần đây */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-400" />
                <span>Nhật ký học tập & Sử dụng gần đây ({activities.length})</span>
              </div>

              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có nhật ký hoạt động nào được ghi nhận.</p>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {act.activity}
                        </span>
                        {act.details && (
                          <span className="text-[11px] text-slate-400 truncate">
                            ({act.details})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Body - Tab 2: Chỉnh sửa thông tin */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Chọn ảnh đại diện của em:
              </label>
              <div className="flex flex-wrap items-center gap-2">
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
                        ? 'bg-blue-600 text-white scale-110 shadow-md ring-2 ring-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Họ và tên học sinh <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Lớp
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="7A1"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Trường THCS
                </label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="THCS Chu Văn An"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
