/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Component hiển thị ký hiệu góc chuẩn SGK Toán 7 Việt Nam:
 * Chữ cái in hoa (A, B, C...) có dấu mũ góc toán học trên đầu (^), và chỉ số ở chân (1, 2, 3, 4...).
 * Ví dụ: góc A₁, góc B₂, góc A₄, góc B₃...
 */
export const MathAngle: React.FC<{
  letter: string;
  index?: string | number;
  className?: string;
}> = ({ letter, index, className = '' }) => {
  return (
    <span className={`inline-flex items-baseline mx-1 font-sans select-none ${className}`}>
      <span className="relative inline-flex flex-col items-center">
        {/* Dấu mũ góc chuẩn hình học toán học Việt Nam */}
        <svg
          className="w-3.5 h-1.5 text-blue-600 dark:text-blue-400 mb-[-2px] shrink-0"
          viewBox="0 0 14 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.5 5.2L7 1.2L12.5 5.2"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-extrabold text-inherit leading-none tracking-tight">{letter}</span>
      </span>
      {index !== undefined && index !== null && (
        <sub className="font-extrabold text-[11px] ml-0.5 leading-none text-inherit">
          {index}
        </sub>
      )}
    </span>
  );
};

/**
 * Component MathText tự động tìm và chuyển đổi các ký hiệu góc:
 * - ∠A₁, ∠A₂, ∠B₃...
 * - ∠A1, ∠B2...
 * - \widehat{A1}, \widehat{A_1}...
 * - góc A₁, góc B₂, Góc A₁...
 * thành biểu diễn dấu mũ góc toán học chuẩn SGK Việt Nam.
 */
export const MathText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  // Regex bao phủ:
  // 1) \widehat{A1}, \widehat{A_1}
  // 2) \angle A_1, \angle A1
  // 3) ∠\s*A₁, ∠\s*A1
  // 4) [Gg]óc\s*A₁, [Gg]óc\s*A1
  const regex = /(?:\\widehat\{([A-Z])_?([0-9])\}|\\angle\s*([A-Z])_?([0-9])|∠\s*([A-Z])([0-9₁₂₃₄])|[Gg]óc\s+([A-Z])([0-9₁₂₃₄]))/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const subscriptMap: { [key: string]: string } = {
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
  };

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const letter = match[1] || match[3] || match[5] || match[7];
    const rawIdx = match[2] || match[4] || match[6] || match[8];
    const index = rawIdx ? subscriptMap[rawIdx] || rawIdx : undefined;

    parts.push(
      <MathAngle
        key={`angle_${match.index}_${letter}_${index}`}
        letter={letter}
        index={index}
      />
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
};
