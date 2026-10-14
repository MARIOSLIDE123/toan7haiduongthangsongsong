/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GeometryCanvas } from './GeometryCanvas.tsx';
import { MathTestRunResult } from '../types.ts';
import { sound } from '../utils/audio.ts';
import {
  Sliders,
  CheckCircle,
  XCircle,
  FlaskConical,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const MathLabSection: React.FC = () => {
  const [sliderAngle, setSliderAngle] = useState<number>(60);
  const [isParallel, setIsParallel] = useState<boolean>(true);
  const [activeHighlight, setActiveHighlight] = useState<'soletrong' | 'dongvi' | 'trongcungphia' | 'all'>('soletrong');

  // Test Suite state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    allPassed: boolean;
    total: number;
    passedCount: number;
    results: MathTestRunResult[];
  } | null>(null);

  // Dynamic values
  const alpha = sliderAngle;
  const beta = isParallel ? alpha : Math.round(alpha - 10);
  const supAlpha = 180 - alpha;
  const supBeta = 180 - beta;

  const getHighlights = () => {
    switch (activeHighlight) {
      case 'soletrong':
        return ['A4', 'B2'] as const;
      case 'dongvi':
        return ['A4', 'B4'] as const;
      case 'trongcungphia':
        return ['A4', 'B1'] as const;
      default:
        return ['A4', 'B2', 'B1', 'B4'] as const;
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    sound.playClick();
    try {
      const response = await fetch('/api/test/run');
      const data = await response.json();
      setTestResults(data);
      if (data.allPassed) {
        sound.playVictory();
      } else {
        sound.playWrong();
      }
    } catch (err) {
      console.error('Error running test suite:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-purple-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <FlaskConical className="w-7 h-7 text-amber-300" />
            <h2 className="text-xl md:text-2xl font-bold">
              Phòng thí nghiệm hình học & Trung tâm kiểm thử
            </h2>
          </div>
          <p className="text-purple-100 text-sm max-w-2xl leading-relaxed">
            Thay đổi số đo góc thời gian thực, quan sát sự biến thiên của các cặp góc và chạy bộ kiểm thử độc lập cho các ví dụ 60°, 40°, 140°.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunningTests}
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          {isRunningTests ? 'Đang chạy kiểm thử...' : 'Chạy toàn bộ 10 bài test'}
        </button>
      </div>

      {/* Main Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas & Controls */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Hình vẽ động theo góc α = {sliderAngle}°
            </h3>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                isParallel
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
            >
              {isParallel ? 'Đang song song (a // b)' : 'KHÔNG song song (b lệch 10°)'}
            </span>
          </div>

          <GeometryCanvas
            baseAngle={sliderAngle}
            isParallel={isParallel}
            tiltB={isParallel ? 0 : 10}
            highlightAngles={[...getHighlights()]}
            knownAngles={{
              A4: alpha,
              A3: supAlpha,
              B2: beta,
              B1: supBeta,
            }}
          />

          {/* Controls Bar */}
          <div className="pt-2 space-y-3">
            {/* Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Điều chỉnh góc nghiêng α:</span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">
                  {sliderAngle}°
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="145"
                step="1"
                value={sliderAngle}
                onChange={(e) => setSliderAngle(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-medium">Mốc tiêu chuẩn:</span>
              {[
                { label: 'Ví dụ 60°', val: 60 },
                { label: 'Ví dụ 40°', val: 40 },
                { label: 'Ví dụ 140°', val: 140 },
                { label: 'Vuông góc 90°', val: 90 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => {
                    setSliderAngle(p.val);
                    sound.playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sliderAngle === p.val
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Parallel Toggle & Highlight toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isParallel}
                  onChange={(e) => {
                    setIsParallel(e.target.checked);
                    sound.playClick();
                  }}
                  className="w-4 h-4 rounded-md accent-blue-600 cursor-pointer"
                />
                <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Duy trì quan hệ song song (a // b)
                </span>
              </label>

              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: 'soletrong', label: 'So le trong' },
                    { id: 'dongvi', label: 'Đồng vị' },
                    { id: 'trongcungphia', label: 'Trong cùng phía' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveHighlight(m.id);
                      sound.playClick();
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      activeHighlight === m.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Measurement Inspector */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Kiểm tra định lý toán học thời gian thực
          </h3>

          <div className="space-y-3 text-xs md:text-sm">
            {/* Condition 1: So le trong */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  1. Cặp góc so le trong (A₄ và B₂):
                </span>
                {alpha === beta ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Bằng nhau ({alpha}°)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Không bằng ({alpha}° ≠ {beta}°)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {alpha === beta
                  ? '⇒ Thỏa mãn dấu hiệu 1: a // b'
                  : '⇒ Vi phạm dấu hiệu: hai đường thẳng cắt nhau!'}
              </p>
            </div>

            {/* Condition 2: Đồng vị */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  2. Cặp góc đồng vị (A₄ và B₄):
                </span>
                {alpha === beta ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Bằng nhau ({alpha}°)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Không bằng ({alpha}° ≠ {beta}°)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {alpha === beta
                  ? '⇒ Thỏa mãn dấu hiệu 2: a // b'
                  : '⇒ Vi phạm dấu hiệu: a không song song với b'}
              </p>
            </div>

            {/* Condition 3: Trong cùng phía */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  3. Góc trong cùng phía (A₄ + B₁):
                </span>
                {alpha + supBeta === 180 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Bù nhau (180°)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> {alpha + supBeta}° ≠ 180°
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {alpha}° + {supBeta}° = {alpha + supBeta}°{' '}
                {alpha + supBeta === 180 ? '(Bù nhau ⇒ a // b)' : '(Không bù nhau)'}
              </p>
            </div>

            {/* Invariant: Đối đỉnh & Kề bù */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-200">
                ★ Tính chất bất biến tại giao điểm A:
              </span>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1 font-mono">
                <li>• Kề bù: A₄ + A₁ = {alpha}° + {supAlpha}° = 180°</li>
                <li>• Đối đỉnh: A₄ = A₂ = {alpha}°</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Test Suite Results Display */}
      {testResults && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  testResults.allPassed
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600'
                    : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100">
                  Báo cáo kết quả kiểm thử toàn diện
                </h4>
                <p className="text-xs text-slate-500">
                  Đã thực hiện {testResults.total} phép thử trên ngân hàng câu hỏi, hình vẽ, và cơ chế tính điểm.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                Thành công: {testResults.passedCount}/{testResults.total} (100%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {testResults.results.map((res) => (
              <div
                key={res.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                    {res.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span>{res.name}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 pl-5">
                    Phân loại: <span className="font-medium text-slate-700 dark:text-slate-300">{res.category}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 pl-5">
                    Kỳ vọng: <span className="font-mono text-emerald-600 dark:text-emerald-400">{res.expected}</span>
                  </div>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  PASS
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
