/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, SessionData } from './types.ts';
import { QUESTIONS_BANK } from './data/questions.ts';
import { TheorySection } from './components/TheorySection.tsx';
import { PracticeSection } from './components/PracticeSection.tsx';
import { ArenaSection } from './components/ArenaSection.tsx';
import { AdvancedSection } from './components/AdvancedSection.tsx';
import { MathLabSection } from './components/MathLabSection.tsx';
import { LeaderboardSection } from './components/LeaderboardSection.tsx';
import { StudentProfileModal } from './components/StudentProfileModal.tsx';
import { StudentWelcomeGate } from './components/StudentWelcomeGate.tsx';
import { sound } from './utils/audio.ts';
import { registerStudentOnline, logStudentActivityOnline } from './utils/googleSheetsSync.ts';
import {
  BookOpen,
  CheckSquare,
  FlaskConical,
  Trophy,
  Volume2,
  VolumeX,
  User,
  GraduationCap,
  Sparkles,
  Swords,
  Compass,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'theory' | 'practice' | 'arena' | 'advanced' | 'lab' | 'leaderboard'
  >('theory');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active time tracking (cộng dồn từng giây)
  const [activeSeconds, setActiveSeconds] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toan7_total_active_seconds');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSeconds((prev) => {
        const next = prev + 1;
        if (next % 10 === 0) {
          localStorage.setItem('toan7_total_active_seconds', String(next));
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mandatory registration gate state
  const [hasRegistered, setHasRegistered] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('toan7_profile_registered') === 'true';
    }
    return false;
  });

  // Student Profile state
  const [student, setStudent] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toan7_student_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      id: 'std_default',
      name: '',
      school: '',
      className: '',
      avatar: '👨‍🎓',
    };
  });

  const [session, setSession] = useState<SessionData | null>(null);

  // Initialize session on mount or when student changes
  const initSession = async (currentStudent: StudentProfile) => {
    if (!currentStudent.name.trim()) return;
    try {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: currentStudent }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch (e) {
      console.error('Lỗi khởi tạo session:', e);
    }
  };

  useEffect(() => {
    if (hasRegistered && student.name.trim()) {
      initSession(student);
    }
  }, [hasRegistered]);

  const handleWelcomeComplete = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    localStorage.setItem('toan7_student_profile', JSON.stringify(newProfile));
    localStorage.setItem('toan7_profile_registered', 'true');
    setHasRegistered(true);
    initSession(newProfile);

    // Ghi nhận thông tin học sinh và nhật ký thời gian thực ngay vào Google Sheets
    registerStudentOnline(newProfile);
    logStudentActivityOnline(newProfile, 'Đăng ký thông tin và bắt đầu học tập', `Lớp ${newProfile.className} - ${newProfile.school}`);
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    localStorage.setItem('toan7_student_profile', JSON.stringify(newProfile));
    localStorage.setItem('toan7_profile_registered', 'true');
    setIsProfileModalOpen(false);
    initSession(newProfile);
    registerStudentOnline(newProfile);
  };

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const navItems = [
    { id: 'theory', label: 'Lý thuyết cốt lõi', icon: BookOpen },
    { id: 'practice', label: 'Luyện tập SGK', icon: CheckSquare },
    { id: 'arena', label: 'Đấu trường trí tuệ (20 câu)', icon: Swords, badge: 'HOT' },
    { id: 'advanced', label: 'Vận dụng cao (10 câu)', icon: Compass, badge: 'KHÓ' },
    { id: 'lab', label: 'Phòng thí nghiệm & Test', icon: FlaskConical },
    { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Mandatory Student Welcome Gate */}
      {!hasRegistered && (
        <StudentWelcomeGate
          onComplete={handleWelcomeComplete}
          initialProfile={student.name ? student : null}
        />
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Toán 7: Bài 9
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Hai đường thẳng song song và dấu hiệu nhận biết
              </p>
            </div>
          </div>

          {/* Right Action Icons: Profile, Sound, Sheets Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student profile chip */}
            <button
              onClick={() => {
                sound.playClick();
                setIsProfileModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all text-xs font-semibold cursor-pointer"
            >
              <span className="text-base">{student.avatar}</span>
              <span className="hidden md:inline max-w-[120px] truncate">{student.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                {student.className}
              </span>
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/80">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const badge = (item as any).badge;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(item.id);
                    if (student.name) {
                      logStudentActivityOnline(student, `Xem phân hệ ${item.label}`, '', item.id, activeSeconds);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md font-black uppercase ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : badge === 'HOT'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1520px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'theory' && (
          <div className="space-y-6">
            {/* Two Big Feature Cards on Home Page for Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: ĐẤU TRƯỜNG TRÍ TUỆ */}
              <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-blue-500/30 shadow-xl flex flex-col justify-between group hover:border-blue-400/60 transition-all">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>20 CÂU HỎI ĐA DẠNG HÌNH THỨC</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    ĐẤU TRƯỜNG TRÍ TUỆ
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200/80 leading-relaxed">
                    Trắc nghiệm chọn nhiều, ghép cột kéo thả, đúng/sai, sắp xếp thứ tự, điền số, tương tác trực tiếp trên hình SVG. Đúng lần 1 nhận 5đ, được làm lại 1 lần nhận 2.5đ!
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400">Tối đa: 100 Điểm</div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('arena');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>VÀO THI ĐẤU</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 2: VẬN DỤNG CAO */}
              <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-amber-950/70 to-slate-900 text-white border border-amber-500/30 shadow-xl flex flex-col justify-between group hover:border-amber-400/60 transition-all">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>10 BÀI TOÁN THỰC TẾ KHÓ</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    VẬN DỤNG CAO
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
                    Nghiệm thu vạch đường, vì kèo mái nhà, kết cấu giàn cầu, pin mặt trời. Khóa ngay khi xác nhận đáp án — <strong>tuyệt đối không được làm lại</strong> (10đ/câu)!
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400">Tối đa: 100 Điểm</div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('advanced');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>THỬ THÁCH NGAY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <TheorySection />
          </div>
        )}

        {activeTab === 'practice' && (
          <PracticeSection
            questions={QUESTIONS_BANK}
            student={student}
            session={session}
            onUpdateSession={(updated) => setSession(updated)}
            onGoToLeaderboard={() => setActiveTab('leaderboard')}
            onRestartPractice={() => initSession(student)}
          />
        )}

        {activeTab === 'arena' && (
          <ArenaSection
            student={student}
            onGoToLeaderboard={() => setActiveTab('leaderboard')}
          />
        )}

        {activeTab === 'advanced' && (
          <AdvancedSection
            student={student}
            onGoToLeaderboard={() => setActiveTab('leaderboard')}
          />
        )}

        {activeTab === 'lab' && <MathLabSection />}

        {activeTab === 'leaderboard' && <LeaderboardSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-medium">
          Chương trình Hình học Toán 7 • Bài 9: Hai đường thẳng song song và dấu hiệu nhận biết
        </p>
        <p>
          Hình vẽ SVG tính toán chuẩn tọa độ hình học • Chấm điểm máy chủ chống gian lận 2 vòng (100% / 50% / 0%) • Tích hợp Google Sheets
        </p>
      </footer>

      {/* Modals */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        initialProfile={student}
        totalActiveSeconds={activeSeconds}
        onGoToLeaderboard={() => {
          setIsProfileModalOpen(false);
          setActiveTab('leaderboard');
        }}
      />
    </div>
  );
}
