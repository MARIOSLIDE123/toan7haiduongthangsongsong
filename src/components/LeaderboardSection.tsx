/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { Trophy, Medal, Clock, RefreshCw, Sparkles } from 'lucide-react';

const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwONwRDH8xAMIG3D6ebJJjPhQqfxOXMSyyUmdqBOrYdhTsKStSv4T3_dHrJXsisQVmH/exec';

export const LeaderboardSection: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  const fetchLeaderboard = async (mod: string = selectedModule) => {
    setLoading(true);
    let loadedEntries: LeaderboardEntry[] = [];
    try {
      const url = mod === 'ALL' ? '/api/leaderboard' : `/api/leaderboard?moduleId=${mod}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.leaderboard && Array.isArray(data.leaderboard)) {
          loadedEntries = data.leaderboard;
        }
      }
    } catch (err) {
      console.warn('Lỗi fetch /api/leaderboard, chuyển sang đồng bộ trực tiếp Google Sheets:', err);
    }

    // Direct Google Apps Script Web App Sync / Fallback
    try {
      const gsModParam = mod === 'ALL' ? 'BAI9_DAU_TRUONG_TRI_TUE' : mod;
      const gsRes = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?moduleId=${gsModParam}`, {
        redirect: 'follow',
      });
      if (gsRes.ok) {
        const gsData = await gsRes.json();
        if (gsData.status === 'success' && Array.isArray(gsData.leaderboard)) {
          const directEntries: LeaderboardEntry[] = gsData.leaderboard.map((item: any) => ({
            id: item.id || `direct_${Math.random()}`,
            moduleId: item.moduleId || gsModParam,
            name: item.name,
            school: item.school || 'THCS',
            className: item.className || '7A',
            avatar: '👨‍🎓',
            score: Number(item.score) || 0,
            maxScore: Number(item.maxScore) || 100,
            percentage: Number(item.percentage) || 0,
            timeSpentSeconds: Number(item.timeSpentSeconds) || 60,
            completedAt: String(item.completedAt || ''),
          }));

          directEntries.forEach((de) => {
            const exists = loadedEntries.some(
              (le) => le.name === de.name && le.className === de.className && le.moduleId === de.moduleId
            );
            if (!exists) {
              loadedEntries.push(de);
            }
          });
        }
      }
    } catch (gsErr) {
      console.warn('Direct Google Apps Script fetch skipped:', gsErr);
    }

    if (loadedEntries.length > 0) {
      loadedEntries.sort((a, b) => b.score - a.score || a.timeSpentSeconds - b.timeSpentSeconds);
      setEntries(loadedEntries);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard(selectedModule);
  }, [selectedModule]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return (
      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center justify-center">
        {rank}
      </span>
    );
  };

  const getModuleBadge = (mod?: string) => {
    if (mod === 'BAI9_DAU_TRUONG_TRI_TUE') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
          Đấu trường
        </span>
      );
    }
    if (mod === 'BAI9_VAN_DUNG_CAO') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
          Vận dụng cao
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
        Luyện tập SGK
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Trophy className="w-7 h-7 text-yellow-300" />
            <h2 className="text-xl md:text-2xl font-bold">
              Bảng vàng thành tích Toán 7 - Bài 9
            </h2>
          </div>
          <p className="text-amber-100 text-sm max-w-xl">
            Vinh danh những học sinh đạt điểm cao nhất trong Luyện tập SGK, Đấu trường trí tuệ và Vận dụng cao.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            fetchLeaderboard();
          }}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs md:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Module Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'Tất cả phân hệ' },
          { id: 'BAI9_DAU_TRUONG_TRI_TUE', label: '⚔️ Đấu trường trí tuệ' },
          { id: 'BAI9_VAN_DUNG_CAO', label: '🧭 Vận dụng cao' },
          { id: 'BAI9_LUYEN_TAP_SGK', label: '📘 Luyện tập SGK' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setSelectedModule(tab.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedModule === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 text-center w-16">Hạng</th>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Phân hệ</th>
                <th className="py-3.5 px-4">Lớp & Trường</th>
                <th className="py-3.5 px-4 text-center">Điểm số</th>
                <th className="py-3.5 px-4 text-center">Tỷ lệ</th>
                <th className="py-3.5 px-4 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {entries.map((item, idx) => {
                const rank = idx + 1;
                const isCurrent = item.isCurrentSession;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-850'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold">
                      <div className="flex items-center justify-center">
                        {getRankBadge(rank)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                                Của em
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            Hoàn thành: {item.completedAt}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getModuleBadge(item.moduleId)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Lớp {item.className}
                      </span>
                      <p className="text-xs text-slate-500">{item.school}</p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-base text-blue-600 dark:text-blue-400">
                        {item.score}
                      </span>
                      <span className="text-xs text-slate-400">/{item.maxScore}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.percentage >= 90
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : item.percentage >= 70
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {item.percentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.timeSpentSeconds}s</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
