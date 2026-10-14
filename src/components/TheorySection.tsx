/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GeometryCanvas } from './GeometryCanvas.tsx';
import { AngleName } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { BookOpen, CheckCircle, Info, Layers, Eye } from 'lucide-react';

export const TheorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'soletrong' | 'dongvi' | 'trongcungphia' | 'doidinh' | 'kebu'>('soletrong');

  const tabConfigs: Record<
    'soletrong' | 'dongvi' | 'trongcungphia' | 'doidinh' | 'kebu',
    {
      title: string;
      highlight: AngleName[];
      known: { [key in AngleName]?: number };
      description: string;
      rules: string[];
      mathProperty: string;
    }
  > = {
    soletrong: {
      title: '1. Hai góc so le trong',
      highlight: ['A4', 'B2'],
      known: { A4: 60, B2: 60 },
      description: 'Hai góc nằm ở miền trong (giữa hai đường thẳng a và b) và nằm về hai phía khác nhau đối với cát tuyến c.',
      rules: [
        'Cặp thứ nhất: Góc A₄ và góc B₂',
        'Cặp thứ hai: Góc A₃ và góc B₁',
        'Khi a // b: Hai góc so le trong bằng nhau (A₄ = B₂ = 60°, A₃ = B₁ = 120°).',
      ],
      mathProperty: 'a // b ⟺ A₄ = B₂ (hoặc A₃ = B₁)',
    },
    dongvi: {
      title: '2. Hai góc đồng vị',
      highlight: ['A4', 'B4'],
      known: { A4: 60, B4: 60 },
      description: 'Hai góc có cùng vị trí tương ứng so với cát tuyến c và hai đường thẳng a, b.',
      rules: [
        'Cặp 1: Góc A₁ và góc B₁ (cùng ở phía trên - bên phải)',
        'Cặp 2: Góc A₂ và góc B₂ (cùng ở phía trên - bên trái)',
        'Cặp 3: Góc A₃ và góc B₃ (cùng ở phía dưới - bên trái)',
        'Cặp 4: Góc A₄ và góc B₄ (cùng ở phía dưới - bên phải)',
        'Khi a // b: Các cặp góc đồng vị bằng nhau từng đôi một.',
      ],
      mathProperty: 'a // b ⟺ A₁ = B₁; A₂ = B₂; A₃ = B₃; A₄ = B₄',
    },
    trongcungphia: {
      title: '3. Hai góc trong cùng phía',
      highlight: ['A4', 'B1'],
      known: { A4: 60, B1: 120 },
      description: 'Hai góc nằm ở miền trong giữa hai đường thẳng a và b, đồng thời nằm về cùng một phía đối với cát tuyến c.',
      rules: [
        'Cặp bên phải: Góc A₄ và góc B₁',
        'Cặp bên trái: Góc A₃ và góc B₂',
        'Khi a // b: Hai góc trong cùng phía bù nhau (tổng số đo bằng 180°).',
        'Ví dụ: A₄ = 60° thì B₁ = 180° - 60° = 120°.',
      ],
      mathProperty: 'a // b ⟺ A₄ + B₁ = 180° và A₃ + B₂ = 180°',
    },
    doidinh: {
      title: '4. Hai góc đối đỉnh',
      highlight: ['A4', 'A2'],
      known: { A4: 60, A2: 60 },
      description: 'Hai góc mà mỗi cạnh của góc này là tia đối của một cạnh góc kia.',
      rules: [
        'Tại đỉnh A: Cặp (A₄, A₂) và cặp (A₁, A₃) là các cặp góc đối đỉnh.',
        'Tại đỉnh B: Cặp (B₄, B₂) và cặp (B₁, B₃) là các cặp góc đối đỉnh.',
        'Tính chất bất biến: Hai góc đối đỉnh luôn luôn bằng nhau, bất kể đường thẳng có song song hay không.',
      ],
      mathProperty: 'A₄ = A₂; A₁ = A₃; B₄ = B₂; B₁ = B₃',
    },
    kebu: {
      title: '5. Hai góc kề bù',
      highlight: ['A4', 'A1'],
      known: { A4: 60, A1: 120 },
      description: 'Hai góc vừa kề nhau vừa bù nhau, có một cạnh chung và hai cạnh còn lại là hai tia đối nhau.',
      rules: [
        'Tại đỉnh A: (A₁, A₄), (A₁, A₂), (A₂, A₃), (A₃, A₄) là các cặp góc kề bù.',
        'Tổng số đo hai góc kề bù luôn bằng 180° (tạo thành đường thẳng).',
        'Ví dụ: Nếu A₄ = 60° thì góc kề bù A₁ = 180° - 60° = 120°.',
      ],
      mathProperty: 'A₄ + A₁ = 180°; A₁ + A₂ = 180°; A₂ + A₃ = 180°; A₃ + A₄ = 180°',
    },
  };

  const currentTab = tabConfigs[activeTab];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-7 h-7 text-yellow-300" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Toán 7 - Bài 9: Hai đường thẳng song song và dấu hiệu nhận biết
          </h2>
        </div>
        <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
          Nắm vững định nghĩa, vị trí tương đối giữa các cặp góc và các định lý hình học nền tảng thông qua hình vẽ SVG trực quan tương tác.
        </p>
      </div>

      {/* Main Grid: Interactive Canvas & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Canvas & Interactive Selector */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Hình minh họa hình học chuẩn xác
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
              Quy ước SGK Toán 7
            </span>
          </div>

          <GeometryCanvas
            baseAngle={60}
            isParallel={true}
            highlightAngles={currentTab.highlight}
            knownAngles={currentTab.known}
            lineALabel="a"
            lineBLabel="b"
            lineCLabel="c"
          />

          {/* Interactive Tabs */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Bấm để xem vị trí các cặp góc:
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'soletrong', label: 'So le trong' },
                  { id: 'dongvi', label: 'Đồng vị' },
                  { id: 'trongcungphia', label: 'Trong cùng phía' },
                  { id: 'doidinh', label: 'Đối đỉnh' },
                  { id: 'kebu', label: 'Kề bù' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    sound.playClick();
                  }}
                  className={`px-3.5 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Detailed Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentTab.title}
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {currentTab.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quy tắc nhận diện & Tính chất
            </h4>
            <ul className="space-y-2">
              {currentTab.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider mb-1">
              <Info className="w-4 h-4" />
              Công thức hình học
            </div>
            <p className="font-mono text-sm md:text-base font-bold text-blue-900 dark:text-blue-200">
              {currentTab.mathProperty}
            </p>
          </div>
        </div>
      </div>

      {/* Dấu hiệu nhận biết hai đường thẳng song song Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            ★
          </span>
          Dấu hiệu nhận biết hai đường thẳng song song (Định lý cốt lõi)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Dấu hiệu 1: So le trong
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Nếu đường thẳng c cắt a và b tạo ra <b>một cặp góc so le trong bằng nhau</b> thì:
            </p>
            <p className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              a // b
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Dấu hiệu 2: Đồng vị
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Nếu đường thẳng c cắt a và b tạo ra <b>một cặp góc đồng vị bằng nhau</b> thì:
            </p>
            <p className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              a // b
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              Dấu hiệu 3: Trong cùng phía
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Nếu đường thẳng c cắt a và b tạo ra <b>một cặp góc trong cùng phía bù nhau</b> (tổng 180°) thì:
            </p>
            <p className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              a // b
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
