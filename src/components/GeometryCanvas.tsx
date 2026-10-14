/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AngleName } from '../types.ts';

interface GeometryCanvasProps {
  baseAngle?: number; // e.g. 60 or 40 (degrees)
  isParallel?: boolean; // whether line a || line b
  tiltB?: number; // tilt angle deviation for line b if not parallel (e.g. +10 deg)
  highlightAngles?: AngleName[];
  selectedAngle?: AngleName | null;
  knownAngles?: { [key in AngleName]?: number };
  customLabels?: { [key in AngleName]?: string };
  lineALabel?: string;
  lineBLabel?: string;
  lineCLabel?: string;
  interactive?: boolean;
  onAngleClick?: (angle: AngleName) => void;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({
  baseAngle = 60,
  isParallel = true,
  tiltB = 0,
  highlightAngles = [],
  selectedAngle = null,
  knownAngles = {},
  customLabels = {},
  lineALabel = 'a',
  lineBLabel = 'b',
  lineCLabel = 'c',
  interactive = false,
  onAngleClick,
  className = '',
}) => {
  // SVG Canvas dimensions: enlarged to 640x380 for crystal-clear readability
  const viewBoxWidth = 640;
  const viewBoxHeight = 380;

  // Vertex coordinates with larger separation
  const yA = 105;
  const yB = 265;
  const deltaY = yB - yA; // 160px (generous distance between parallel lines)

  // Clamp baseAngle safely between 30 and 150
  const alphaDeg = Math.max(30, Math.min(150, baseAngle));
  const alphaRad = (alphaDeg * Math.PI) / 180;

  // Calculate deltaX so transversal inclination matches alphaDeg exactly
  // dx = dy / tan(alpha)
  const deltaX = deltaY / Math.tan(alphaRad);

  const xA = 260;
  const xB = xA + deltaX;

  // Extension lengths for transversal line c
  const topExt = 55;
  const botExt = 55;

  const topTransversalX = xA - topExt / Math.tan(alphaRad);
  const topTransversalY = yA - topExt;

  const botTransversalX = xB + botExt / Math.tan(alphaRad);
  const botTransversalY = yB + botExt;

  // Horizontal lines a and b
  const xLineStart = 35;
  const xLineEnd = 595;

  // Effective tilt of line b if non-parallel
  const effectiveTiltB = isParallel ? 0 : tiltB !== 0 ? tiltB : 12;
  const tiltRad = (effectiveTiltB * Math.PI) / 180;
  const yBStart = yB - (xB - xLineStart) * Math.sin(tiltRad);
  const yBEnd = yB + (xLineEnd - xB) * Math.sin(tiltRad);

  // Helper to generate SVG arc path given center, radius, startAngle (deg), endAngle (deg)
  const createArcPath = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number
  ): string => {
    let start = ((startDeg % 360) + 360) % 360;
    let end = ((endDeg % 360) + 360) % 360;
    if (end < start) end += 360;
    const diff = end - start;

    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArcFlag = diff > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Helper to compute angle bisector position for angle label with ample spacing
  const getLabelPos = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number
  ) => {
    let start = ((startDeg % 360) + 360) % 360;
    let end = ((endDeg % 360) + 360) % 360;
    if (end < start) end += 360;
    const midDeg = (start + end) / 2;
    const midRad = (midDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(midRad),
      y: cy + r * Math.sin(midRad),
      angle: midDeg,
    };
  };

  // Standard angle definitions for A and B
  // A4: between 0 deg (right) and alphaDeg (down-right). Measure = alphaDeg
  // A3: between alphaDeg and 180 deg (left). Measure = 180 - alphaDeg
  // A2: between 180 deg and 180 + alphaDeg. Measure = alphaDeg
  // A1: between 180 + alphaDeg and 360 deg. Measure = 180 - alphaDeg

  // For B (taking into account tilt if any):
  const bLineAngle = effectiveTiltB;
  const bTransversalAngle = 180 + alphaDeg;

  // B1: between bTransversalAngle and 360 + bLineAngle
  // B2: between 180 + bLineAngle and bTransversalAngle
  // B3: between alphaDeg and 180 + bLineAngle
  // B4: between bLineAngle and alphaDeg

  const anglesConfig: Record<
    AngleName,
    {
      cx: number;
      cy: number;
      startDeg: number;
      endDeg: number;
      color: string;
      fillColor: string;
      labelName: string;
      measure: number;
    }
  > = {
    // Góc A1: Phía dưới bên trái (Bottom-Left)
    A1: {
      cx: xA,
      cy: yA,
      startDeg: alphaDeg,
      endDeg: 180,
      color: '#3b82f6',
      fillColor: 'rgba(59, 130, 246, 0.28)',
      labelName: '1',
      measure: 180 - alphaDeg,
    },
    // Góc A2: Phía trên bên trái (Top-Left)
    A2: {
      cx: xA,
      cy: yA,
      startDeg: 180,
      endDeg: 180 + alphaDeg,
      color: '#f97316',
      fillColor: 'rgba(249, 115, 22, 0.28)',
      labelName: '2',
      measure: alphaDeg,
    },
    // Góc A3: Phía trên bên phải (Top-Right)
    A3: {
      cx: xA,
      cy: yA,
      startDeg: 180 + alphaDeg,
      endDeg: 360,
      color: '#8b5cf6',
      fillColor: 'rgba(139, 92, 246, 0.28)',
      labelName: '3',
      measure: 180 - alphaDeg,
    },
    // Góc A4: Phía dưới bên phải (Bottom-Right)
    A4: {
      cx: xA,
      cy: yA,
      startDeg: 0,
      endDeg: alphaDeg,
      color: '#10b981',
      fillColor: 'rgba(16, 185, 129, 0.28)',
      labelName: '4',
      measure: alphaDeg,
    },
    // Góc B1: Phía dưới bên trái (Bottom-Left)
    B1: {
      cx: xB,
      cy: yB,
      startDeg: alphaDeg,
      endDeg: 180 + bLineAngle,
      color: '#3b82f6',
      fillColor: 'rgba(59, 130, 246, 0.28)',
      labelName: '1',
      measure: isParallel ? 180 - alphaDeg : Math.round(180 - (alphaDeg - effectiveTiltB)),
    },
    // Góc B2: Phía trên bên trái (Top-Left)
    B2: {
      cx: xB,
      cy: yB,
      startDeg: 180 + bLineAngle,
      endDeg: bTransversalAngle,
      color: '#f97316',
      fillColor: 'rgba(249, 115, 22, 0.28)',
      labelName: '2',
      measure: isParallel ? alphaDeg : Math.round(alphaDeg - effectiveTiltB),
    },
    // Góc B3: Phía trên bên phải (Top-Right)
    B3: {
      cx: xB,
      cy: yB,
      startDeg: bTransversalAngle,
      endDeg: 360 + bLineAngle,
      color: '#8b5cf6',
      fillColor: 'rgba(139, 92, 246, 0.28)',
      labelName: '3',
      measure: isParallel ? 180 - alphaDeg : Math.round(180 - (alphaDeg - effectiveTiltB)),
    },
    // Góc B4: Phía dưới bên phải (Bottom-Right)
    B4: {
      cx: xB,
      cy: yB,
      startDeg: bLineAngle,
      endDeg: alphaDeg,
      color: '#10b981',
      fillColor: 'rgba(16, 185, 129, 0.28)',
      labelName: '4',
      measure: isParallel ? alphaDeg : Math.round(alphaDeg - effectiveTiltB),
    },
  };

  const angleKeys: AngleName[] = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];

  return (
    <div className={`relative w-full overflow-hidden flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full max-h-[360px] h-auto drop-shadow-sm transition-all duration-300"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle grid pattern for mathematical notebook look */}
          <pattern id="mathGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
          </pattern>
          {/* Arrow markers */}
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
          </marker>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#mathGrid)" rx="12" />

        {/* Angle sectors and arcs */}
        {angleKeys.map((key) => {
          const cfg = anglesConfig[key];
          const isSelected = selectedAngle === key;
          const isHighlighted = highlightAngles.includes(key) || isSelected;
          const hasKnownMeasure = knownAngles[key] !== undefined;
          const displayMeasure = knownAngles[key] !== undefined ? `${knownAngles[key]}°` : `${cfg.measure}°`;
          const customLabel = customLabels[key];

          const arcR = isSelected ? 52 : isHighlighted ? 42 : 32;
          const labelDist = isSelected ? 70 : isHighlighted ? 62 : 50;
          const labelPos = getLabelPos(cfg.cx, cfg.cy, labelDist, cfg.startDeg, cfg.endDeg);
          const arcPath = createArcPath(cfg.cx, cfg.cy, arcR, cfg.startDeg, cfg.endDeg);
          const hitPath = createArcPath(cfg.cx, cfg.cy, 75, cfg.startDeg, cfg.endDeg);

          const isClickable = interactive || Boolean(onAngleClick);

          return (
            <g
              key={key}
              className={`transition-all duration-200 ${isClickable ? 'cursor-pointer group' : ''}`}
              onClick={() => isClickable && onAngleClick && onAngleClick(key)}
            >
              {/* Invisible large touch hit area for reliable clicks */}
              {isClickable && (
                <path
                  d={hitPath}
                  fill="transparent"
                  className="cursor-pointer"
                />
              )}

              {/* Sector fill & arc stroke */}
              <path
                d={arcPath}
                fill={
                  isSelected
                    ? 'rgba(234, 88, 12, 0.45)'
                    : isHighlighted
                    ? cfg.fillColor
                    : 'transparent'
                }
                stroke={isSelected ? '#ea580c' : isHighlighted ? cfg.color : '#94a3b8'}
                strokeWidth={isSelected ? 4 : isHighlighted ? 3 : 1.8}
                className="transition-all duration-300"
              />

              {/* Angle Number Badge */}
              <circle
                cx={labelPos.x}
                cy={labelPos.y}
                r={isSelected ? 17 : isHighlighted ? 15 : 13}
                fill={isSelected ? '#ea580c' : isHighlighted ? cfg.color : '#ffffff'}
                stroke={isSelected ? '#ffffff' : isHighlighted ? '#ffffff' : '#cbd5e1'}
                strokeWidth={isSelected ? '2.5' : '1.8'}
                className="shadow-md transition-all duration-200"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isSelected ? '16' : isHighlighted ? '14' : '12'}
                fontWeight="extrabold"
                fill={isSelected || isHighlighted ? '#ffffff' : '#334155'}
              >
                {cfg.labelName}
              </text>

              {/* Degree or Custom Value Badge if highlighted or known */}
              {(isHighlighted || hasKnownMeasure || customLabel) && (
                <g>
                  {/* Subtle offset badge for degree */}
                  <rect
                    x={labelPos.x + (labelPos.x > cfg.cx ? 14 : -54)}
                    y={labelPos.y - 12}
                    width="44"
                    height="22"
                    rx="5"
                    fill="#0f172a"
                    className="opacity-95 shadow-sm"
                  />
                  <text
                    x={labelPos.x + (labelPos.x > cfg.cx ? 36 : -32)}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#f8fafc"
                  >
                    {customLabel || displayMeasure}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Line a */}
        <line
          x1={xLineStart}
          y1={yA}
          x2={xLineEnd}
          y2={yA}
          stroke="#0f172a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Line a label */}
        <text
          x={xLineEnd + 16}
          y={yA + 6}
          fontSize="22"
          fontWeight="bold"
          fontStyle="italic"
          fill="#0f172a"
        >
          {lineALabel}
        </text>

        {/* Line b */}
        <line
          x1={xLineStart}
          y1={yBStart}
          x2={xLineEnd}
          y2={yBEnd}
          stroke="#0f172a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Line b label */}
        <text
          x={xLineEnd + 16}
          y={yBEnd + 6}
          fontSize="22"
          fontWeight="bold"
          fontStyle="italic"
          fill="#0f172a"
        >
          {lineBLabel}
        </text>

        {/* Transversal Line c */}
        <line
          x1={topTransversalX}
          y1={topTransversalY}
          x2={botTransversalX}
          y2={botTransversalY}
          stroke="#2563eb"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Line c label */}
        <text
          x={topTransversalX - 20}
          y={topTransversalY - 8}
          fontSize="22"
          fontWeight="bold"
          fontStyle="italic"
          fill="#2563eb"
        >
          {lineCLabel}
        </text>

        {/* Vertex A */}
        <circle cx={xA} cy={yA} r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
        <text
          x={xA - 22}
          y={yA - 10}
          fontSize="22"
          fontWeight="black"
          fill="#dc2626"
        >
          A
        </text>

        {/* Vertex B */}
        <circle cx={xB} cy={yB} r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
        <text
          x={xB - 22}
          y={yB + 24}
          fontSize="22"
          fontWeight="black"
          fill="#dc2626"
        >
          B
        </text>

        {/* Parallel mark indication if parallel */}
        {isParallel && (
          <g fill="none" stroke="#2563eb" strokeWidth="2">
            {/* Arrows indicating parallel lines */}
            <path d={`M ${xA - 100} ${yA - 6} L ${xA - 90} ${yA} L ${xA - 100} ${yA + 6}`} />
            <path d={`M ${xB - 100} ${yB - 6} L ${xB - 90} ${yB} L ${xB - 100} ${yB + 6}`} />
          </g>
        )}
      </svg>
    </div>
  );
};
