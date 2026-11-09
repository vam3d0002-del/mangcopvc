'use client';

import { useState, useEffect } from 'react';
import {
  Calculator,
  Box,
  Cylinder,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  Info,
  RotateCcw,
  Sliders,
} from 'lucide-react';

interface Props {
  hotline?: string;
  companyName?: string;
}

export default function ShrinkFilmCalculator({
  hotline = '0935 909 747',
  companyName = 'Bao Bì Thành Phát',
}: Props) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [shape, setShape] = useState<'box' | 'round'>('box');
  const [length, setLength] = useState<string>('20');
  const [width, setWidth] = useState<string>('12');
  const [height, setHeight] = useState<string>('8');
  const [diameter, setDiameter] = useState<string>('6.5');
  const [roundHeight, setRoundHeight] = useState<string>('4');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cleanPhone = hotline.replace(/\s|\./g, '');

  let flatCm = 0;
  let cutLenCm = 0;

  if (shape === 'box') {
    const l = parseFloat(length.replace(',', '.')) || 0;
    const w = parseFloat(width.replace(',', '.')) || 0;
    const h = parseFloat(height.replace(',', '.')) || 0;
    flatCm = Math.round((w + h) * 1.1 * 10) / 10;
    cutLenCm = Math.round((l + h) * 1.1 * 10) / 10;
  } else {
    const d = parseFloat(diameter.replace(',', '.')) || 0;
    const hr = parseFloat(roundHeight.replace(',', '.')) || 0;
    flatCm = Math.round(((Math.PI * d) / 2) * 1.05 * 10) / 10;
    cutLenCm = Math.round((hr + 1) * 10) / 10;
  }

  function handleReset() {
    if (shape === 'box') {
      setLength('20');
      setWidth('12');
      setHeight('8');
    } else {
      setDiameter('6.5');
      setRoundHeight('4');
    }
  }

  function applyPreset(type: 'box-tea' | 'box-gift' | 'box-food' | 'round-water' | 'round-bottle' | 'round-jar') {
    if (type === 'box-tea') {
      setShape('box');
      setLength('10');
      setWidth('10');
      setHeight('18');
    } else if (type === 'box-gift') {
      setShape('box');
      setLength('32');
      setWidth('22');
      setHeight('10');
    } else if (type === 'box-food') {
      setShape('box');
      setLength('20');
      setWidth('12');
      setHeight('8');
    } else if (type === 'round-water') {
      setShape('round');
      setDiameter('6.5');
      setRoundHeight('18');
    } else if (type === 'round-bottle') {
      setShape('round');
      setDiameter('6.8');
      setRoundHeight('4.5');
    } else if (type === 'round-jar') {
      setShape('round');
      setDiameter('9.5');
      setRoundHeight('11');
    }
  }

  function handleCopySpecs() {
    const specsText =
      shape === 'box'
        ? `Quy cách hộp: ${length}x${width}x${height} cm -> Khổ màng đề xuất: ${flatCm} cm (~${Math.round(flatCm * 10)} mm), Dài cắt: ${cutLenCm} cm`
        : `Quy cách chai tròn: Đường kính Ø${diameter} cm, Cao ${roundHeight} cm -> Khổ màng đề xuất: ${flatCm} cm (~${Math.round(flatCm * 10)} mm), Dài cắt: ${cutLenCm} cm`;
    
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(specsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (!mounted) {
    return (
      <div
        className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_44px_-10px_rgba(2,132,199,0.12)] p-8 sm:p-12 min-h-[460px] flex items-center justify-center transition-all"
        suppressHydrationWarning
      >
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse">
            <Calculator className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Đang tải công cụ ước tính khổ màng...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_44px_-10px_rgba(2,132,199,0.12)] overflow-hidden transition-all"
      suppressHydrationWarning
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ================= LEFT COLUMN: TRỰC QUAN HÓA & HƯỚNG DẪN ================= */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 via-blue-50/40 to-sky-50/30 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between">
          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Công Cụ Đo Tự Động</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#072554] tracking-tight mb-2.5">
              Ước Tính Khổ Màng Co Chuẩn Xác
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Nhập thông số kích thước để hệ thống tính toán khổ màng dẹp (Lay-flat) và chiều dài cắt tối ưu, giúp hạn chế hao hụt màng từ <strong>15% – 25%</strong> cho mỗi lô đóng gói.
            </p>

            {/* Visual 3D Product Mockup Simulation */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-[0_4px_20px_-4px_rgba(2,132,199,0.12)] mb-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#072554] tracking-tight uppercase leading-none">
                      Mô Phỏng 3D &amp; Thước Đo Kỹ Thuật
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      Tự động tính tỉ lệ chuẩn • Hiệu ứng màng co ôm sát
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black font-mono border border-blue-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {shape === 'box' ? 'Khối Chữ Nhật' : 'Khối Trụ Tròn'}
                  </span>
                </div>
              </div>

              {/* 3D Blueprint Canvas */}
              <div className="w-full bg-gradient-to-b from-slate-50 via-sky-50/40 to-blue-50/30 rounded-xl border border-slate-200/80 p-1 relative overflow-hidden flex items-center justify-center">
                {shape === 'box' ? (
                  /* ================= 3D BOX WITH SHRINK WRAP & CAD DIMENSIONS ================= */
                  (() => {
                    const numL = Math.max(parseFloat(length.replace(',', '.')) || 20, 0.5);
                    const numW = Math.max(parseFloat(width.replace(',', '.')) || 12, 0.5);
                    const numH = Math.max(parseFloat(height.replace(',', '.')) || 8, 0.5);
                    const maxDim = Math.max(numL, numW, numH, 1);

                    const lNorm = Math.min(Math.max(numL / maxDim, 0.42), 1.0);
                    const wNorm = Math.min(Math.max(numW / maxDim, 0.42), 1.0);
                    const hNorm = Math.min(Math.max(numH / maxDim, 0.35), 1.0);

                    const baseL = 84 * lNorm;
                    const baseW = 84 * wNorm;
                    const baseH = 76 * hNorm;

                    const cx = 160;
                    const cy = 146;

                    const P0 = { x: cx, y: cy };
                    const P1 = { x: cx - baseW * 0.866, y: cy - baseW * 0.5 };
                    const P2 = { x: cx + (baseL - baseW) * 0.866, y: cy - (baseL + baseW) * 0.5 };
                    const P3 = { x: cx + baseL * 0.866, y: cy - baseL * 0.5 };

                    const T0 = { x: P0.x, y: P0.y - baseH };
                    const T1 = { x: P1.x, y: P1.y - baseH };
                    const T2 = { x: P2.x, y: P2.y - baseH };
                    const T3 = { x: P3.x, y: P3.y - baseH };

                    return (
                      <svg
                        viewBox="0 0 320 215"
                        className="w-full max-w-[320px] h-auto drop-shadow-sm select-none"
                        aria-label="Bản vẽ 3D hộp chữ nhật"
                      >
                        <defs>
                          {/* Background Grid */}
                          <pattern id="boxGridPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0284c7" strokeWidth="0.5" strokeOpacity="0.09" />
                          </pattern>

                          {/* Soft Floor Shadow Blur */}
                          <filter id="boxFloorBlur" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="7" />
                          </filter>

                          {/* Specular Highlight Filter */}
                          <filter id="boxSpecularGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1.5" result="glow" />
                            <feComposite in="SourceGraphic" in2="glow" operator="over" />
                          </filter>

                          {/* CAD Dimension Arrowhead Markers */}
                          <marker id="arrowStart" viewBox="0 0 6 6" refX="1" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 5 1 L 1 3 L 5 5 z" fill="#0284c7" />
                          </marker>
                          <marker id="arrowEnd" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 1 1 L 5 3 L 1 5 z" fill="#0284c7" />
                          </marker>

                          {/* Gradients */}
                          <linearGradient id="faceTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#bae6fd" />
                            <stop offset="40%" stopColor="#38bdf8" />
                            <stop offset="85%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#0369a1" />
                          </linearGradient>

                          <linearGradient id="faceLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0284c7" />
                            <stop offset="45%" stopColor="#0369a1" />
                            <stop offset="100%" stopColor="#075985" />
                          </linearGradient>

                          <linearGradient id="faceRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0369a1" />
                            <stop offset="55%" stopColor="#075985" />
                            <stop offset="100%" stopColor="#0c4a6e" />
                          </linearGradient>

                          <linearGradient id="topSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
                            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Technical Blueprint Grid */}
                        <rect width="100%" height="100%" fill="url(#boxGridPattern)" rx="12" />

                        {/* Realistic Floor Shadow */}
                        <ellipse
                          cx={cx + (baseL - baseW) * 0.433}
                          cy={cy - (baseL + baseW) * 0.25 + 10}
                          rx={Math.max(baseL, baseW) * 0.95}
                          ry={Math.max(baseL, baseW) * 0.35}
                          fill="#0f172a"
                          fillOpacity="0.18"
                          filter="url(#boxFloorBlur)"
                        />

                        {/* Left Face */}
                        <polygon
                          points={`${P1.x},${P1.y} ${P0.x},${P0.y} ${T0.x},${T0.y} ${T1.x},${T1.y}`}
                          fill="url(#faceLeftGrad)"
                          stroke="#0369a1"
                          strokeWidth="1.2"
                        />

                        {/* Right Face */}
                        <polygon
                          points={`${P0.x},${P0.y} ${P3.x},${P3.y} ${T3.x},${T3.y} ${T0.x},${T0.y}`}
                          fill="url(#faceRightGrad)"
                          stroke="#075985"
                          strokeWidth="1.2"
                        />

                        {/* Top Face */}
                        <polygon
                          points={`${T0.x},${T0.y} ${T3.x},${T3.y} ${T2.x},${T2.y} ${T1.x},${T1.y}`}
                          fill="url(#faceTopGrad)"
                          stroke="#0284c7"
                          strokeWidth="1.2"
                        />

                        {/* Shrink Film Specular Light Sheen */}
                        <polygon
                          points={`${T0.x},${T0.y} ${(T0.x + T3.x) / 2},${(T0.y + T3.y) / 2} ${(T1.x + T2.x) / 2},${(T1.y + T2.y) / 2} ${T1.x},${T1.y}`}
                          fill="url(#topSheen)"
                        />

                        {/* Heat-Seam Line (Đường seal nhiệt giữa mặt hộp) */}
                        <line
                          x1={(T1.x + T3.x) / 2}
                          y1={(T1.y + T3.y) / 2}
                          x2={T2.x}
                          y2={T2.y}
                          stroke="rgba(255,255,255,0.7)"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />

                        {/* Vertical Center Specular Glint */}
                        <line
                          x1={P0.x}
                          y1={P0.y}
                          x2={T0.x}
                          y2={T0.y}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          opacity="0.9"
                          filter="url(#boxSpecularGlow)"
                        />

                        {/* Translucent Shrink Wrap Contour */}
                        <polygon
                          points={`${P1.x - 2},${P1.y - 1} ${P0.x},${P0.y + 2} ${P3.x + 2},${P3.y - 1} ${T3.x + 2},${T3.y - 2} ${T2.x},${T2.y - 3} ${T1.x - 2},${T1.y - 2}`}
                          fill="none"
                          stroke="rgba(186, 230, 253, 0.75)"
                          strokeWidth="1.5"
                        />

                        {/* ================= CAD DIMENSION LINES & BADGES ================= */}
                        {/* 1. Chiều Cao (H) */}
                        <g>
                          <line
                            x1={P0.x - 20}
                            y1={P0.y}
                            x2={P0.x - 20}
                            y2={T0.y}
                            stroke="#0284c7"
                            strokeWidth="1.5"
                            markerStart="url(#arrowStart)"
                            markerEnd="url(#arrowEnd)"
                          />
                          <line x1={P0.x - 26} y1={P0.y} x2={P0.x - 14} y2={P0.y} stroke="#0284c7" strokeWidth="1.2" />
                          <line x1={P0.x - 26} y1={T0.y} x2={P0.x - 14} y2={T0.y} stroke="#0284c7" strokeWidth="1.2" />
                          <rect
                            x={P0.x - 56}
                            y={(P0.y + T0.y) / 2 - 9}
                            width="50"
                            height="18"
                            rx="5"
                            fill="#ffffff"
                            stroke="#0284c7"
                            strokeWidth="1.2"
                          />
                          <text
                            x={P0.x - 31}
                            y={(P0.y + T0.y) / 2 + 4}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fontFamily="monospace"
                            fill="#0369a1"
                          >
                            H: {numH}cm
                          </text>
                        </g>

                        {/* 2. Chiều Rộng (W) */}
                        <g>
                          <line
                            x1={P1.x - 10}
                            y1={P1.y + 14}
                            x2={P0.x - 10}
                            y2={P0.y + 14}
                            stroke="#0284c7"
                            strokeWidth="1.5"
                            markerStart="url(#arrowStart)"
                            markerEnd="url(#arrowEnd)"
                          />
                          <line x1={P1.x - 14} y1={P1.y + 9} x2={P1.x - 6} y2={P1.y + 19} stroke="#0284c7" strokeWidth="1.2" />
                          <line x1={P0.x - 14} y1={P0.y + 9} x2={P0.x - 6} y2={P0.y + 19} stroke="#0284c7" strokeWidth="1.2" />
                          <rect
                            x={(P1.x + P0.x) / 2 - 38}
                            y={(P1.y + P0.y) / 2 + 18}
                            width="54"
                            height="18"
                            rx="5"
                            fill="#ffffff"
                            stroke="#0284c7"
                            strokeWidth="1.2"
                          />
                          <text
                            x={(P1.x + P0.x) / 2 - 11}
                            y={(P1.y + P0.y) / 2 + 31}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fontFamily="monospace"
                            fill="#0369a1"
                          >
                            Rộng: {numW}cm
                          </text>
                        </g>

                        {/* 3. Chiều Dài (L) */}
                        <g>
                          <line
                            x1={P0.x + 10}
                            y1={P0.y + 14}
                            x2={P3.x + 10}
                            y2={P3.y + 14}
                            stroke="#0284c7"
                            strokeWidth="1.5"
                            markerStart="url(#arrowStart)"
                            markerEnd="url(#arrowEnd)"
                          />
                          <line x1={P0.x + 6} y1={P0.y + 19} x2={P0.x + 14} y2={P0.y + 9} stroke="#0284c7" strokeWidth="1.2" />
                          <line x1={P3.x + 6} y1={P3.y + 19} x2={P3.x + 14} y2={P3.y + 9} stroke="#0284c7" strokeWidth="1.2" />
                          <rect
                            x={(P0.x + P3.x) / 2 - 14}
                            y={(P0.y + P3.y) / 2 + 18}
                            width="52"
                            height="18"
                            rx="5"
                            fill="#ffffff"
                            stroke="#0284c7"
                            strokeWidth="1.2"
                          />
                          <text
                            x={(P0.x + P3.x) / 2 + 12}
                            y={(P0.y + P3.y) / 2 + 31}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fontFamily="monospace"
                            fill="#0369a1"
                          >
                            Dài: {numL}cm
                          </text>
                        </g>
                      </svg>
                    );
                  })()
                ) : (
                  /* ================= 3D CYLINDER WITH SHRINK SLEEVE & CAD DIMENSIONS ================= */
                  (() => {
                    const numD = Math.max(parseFloat(diameter.replace(',', '.')) || 6.5, 0.5);
                    const numHr = Math.max(parseFloat(roundHeight.replace(',', '.')) || 12, 0.5);
                    const maxCylDim = Math.max(numD, numHr, 1);

                    const dNorm = Math.min(Math.max(numD / maxCylDim, 0.38), 1.0);
                    const hrNorm = Math.min(Math.max(numHr / maxCylDim, 0.38), 1.0);

                    const radiusX = 46 * dNorm;
                    const radiusY = Math.max(radiusX * 0.32, 10);
                    const cylH = 96 * hrNorm;

                    const cylCx = 160;
                    const cylCy = 142;
                    const cylTopY = cylCy - cylH;

                    return (
                      <svg
                        viewBox="0 0 320 215"
                        className="w-full max-w-[320px] h-auto drop-shadow-sm select-none"
                        aria-label="Bản vẽ 3D khối trụ tròn"
                      >
                        <defs>
                          <pattern id="cylGridPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0284c7" strokeWidth="0.5" strokeOpacity="0.09" />
                          </pattern>

                          <filter id="cylFloorBlur" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="7" />
                          </filter>

                          <marker id="cylArrowStart" viewBox="0 0 6 6" refX="1" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 5 1 L 1 3 L 5 5 z" fill="#0284c7" />
                          </marker>
                          <marker id="cylArrowEnd" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 1 1 L 5 3 L 1 5 z" fill="#0284c7" />
                          </marker>

                          <linearGradient id="cylBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0369a1" />
                            <stop offset="25%" stopColor="#38bdf8" />
                            <stop offset="48%" stopColor="#e0f2fe" />
                            <stop offset="75%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#075985" />
                          </linearGradient>

                          <linearGradient id="cylTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#bae6fd" />
                            <stop offset="65%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>

                          <linearGradient id="shrinkSleeveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.85" />
                            <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.95" />
                            <stop offset="70%" stopColor="#2563eb" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.85" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid */}
                        <rect width="100%" height="100%" fill="url(#cylGridPattern)" rx="12" />

                        {/* Floor Shadow */}
                        <ellipse
                          cx={cylCx}
                          cy={cylCy + 10}
                          rx={radiusX * 1.3}
                          ry={radiusY * 1.25}
                          fill="#0f172a"
                          fillOpacity="0.18"
                          filter="url(#cylFloorBlur)"
                        />

                        {/* Cylinder Body */}
                        <path
                          d={`M ${cylCx - radiusX} ${cylTopY} A ${radiusX} ${radiusY} 0 0 0 ${cylCx + radiusX} ${cylTopY} L ${cylCx + radiusX} ${cylCy} A ${radiusX} ${radiusY} 0 0 1 ${cylCx - radiusX} ${cylCy} Z`}
                          fill="url(#cylBodyGrad)"
                          stroke="#0284c7"
                          strokeWidth="1.2"
                        />

                        {/* Bottom Front Curve */}
                        <path
                          d={`M ${cylCx - radiusX} ${cylCy} A ${radiusX} ${radiusY} 0 0 0 ${cylCx + radiusX} ${cylCy}`}
                          fill="none"
                          stroke="#0369a1"
                          strokeWidth="1.5"
                        />

                        {/* Shrink Film Sleeve (Màng co nhiệt bọc thân chai) */}
                        <rect
                          x={cylCx - radiusX - 1.5}
                          y={cylCy - cylH * 0.72}
                          width={radiusX * 2 + 3}
                          height={cylH * 0.54}
                          rx="4"
                          fill="url(#shrinkSleeveGrad)"
                          stroke="#60a5fa"
                          strokeWidth="1.2"
                        />
                        <line
                          x1={cylCx - radiusX * 0.4}
                          y1={cylCy - cylH * 0.72}
                          x2={cylCx - radiusX * 0.4}
                          y2={cylCy - cylH * 0.18}
                          stroke="rgba(255,255,255,0.7)"
                          strokeWidth="2.5"
                        />
                        <text
                          x={cylCx}
                          y={cylCy - cylH * 0.45}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          letterSpacing="1"
                          fill="#ffffff"
                          opacity="0.95"
                        >
                          MÀNG CO NHIỆT
                        </text>

                        {/* Top Ellipse (Mặt nắp chai/lọ) */}
                        <ellipse
                          cx={cylCx}
                          cy={cylTopY}
                          rx={radiusX}
                          ry={radiusY}
                          fill="url(#cylTopGrad)"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                        />
                        <ellipse
                          cx={cylCx}
                          cy={cylTopY}
                          rx={radiusX * 0.55}
                          ry={radiusY * 0.55}
                          fill="#e0f2fe"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />

                        {/* CAD Dimension: Đường kính (Ø) */}
                        <g>
                          <line
                            x1={cylCx - radiusX}
                            y1={cylTopY - 14}
                            x2={cylCx + radiusX}
                            y2={cylTopY - 14}
                            stroke="#0284c7"
                            strokeWidth="1.5"
                            markerStart="url(#cylArrowStart)"
                            markerEnd="url(#cylArrowEnd)"
                          />
                          <line x1={cylCx - radiusX} y1={cylTopY - 20} x2={cylCx - radiusX} y2={cylTopY - 8} stroke="#0284c7" strokeWidth="1.2" />
                          <line x1={cylCx + radiusX} y1={cylTopY - 20} x2={cylCx + radiusX} y2={cylTopY - 8} stroke="#0284c7" strokeWidth="1.2" />
                          <rect
                            x={cylCx - 28}
                            y={cylTopY - 32}
                            width="56"
                            height="18"
                            rx="5"
                            fill="#ffffff"
                            stroke="#0284c7"
                            strokeWidth="1.2"
                          />
                          <text
                            x={cylCx}
                            y={cylTopY - 19}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fontFamily="monospace"
                            fill="#0369a1"
                          >
                            Ø: {numD}cm
                          </text>
                        </g>

                        {/* CAD Dimension: Chiều Cao (H) */}
                        <g>
                          <line
                            x1={cylCx + radiusX + 18}
                            y1={cylTopY}
                            x2={cylCx + radiusX + 18}
                            y2={cylCy}
                            stroke="#0284c7"
                            strokeWidth="1.5"
                            markerStart="url(#cylArrowStart)"
                            markerEnd="url(#cylArrowEnd)"
                          />
                          <line x1={cylCx + radiusX + 12} y1={cylTopY} x2={cylCx + radiusX + 24} y2={cylTopY} stroke="#0284c7" strokeWidth="1.2" />
                          <line x1={cylCx + radiusX + 12} y1={cylCy} x2={cylCx + radiusX + 24} y2={cylCy} stroke="#0284c7" strokeWidth="1.2" />
                          <rect
                            x={cylCx + radiusX + 24}
                            y={(cylTopY + cylCy) / 2 - 9}
                            width="52"
                            height="18"
                            rx="5"
                            fill="#ffffff"
                            stroke="#0284c7"
                            strokeWidth="1.2"
                          />
                          <text
                            x={cylCx + radiusX + 50}
                            y={(cylTopY + cylCy) / 2 + 4}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fontFamily="monospace"
                            fill="#0369a1"
                          >
                            Cao: {numHr}cm
                          </text>
                        </g>
                      </svg>
                    );
                  })()
                )}
              </div>

              {/* Status & formula footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-blue-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Chu vi mặt cắt ngang:{' '}
                  <strong className="font-mono text-blue-900">
                    {shape === 'box'
                      ? `${Math.round(((parseFloat(width.replace(',', '.')) || 12) + (parseFloat(height.replace(',', '.')) || 8)) * 2 * 10) / 10} cm`
                      : `${Math.round(Math.PI * (parseFloat(diameter.replace(',', '.')) || 6.5) * 10) / 10} cm`}
                  </strong>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Hệ số an toàn: +10% lồng vừa
                </span>
              </div>
            </div>
          </div>

          {/* Hotline Box Contact */}
          <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tư vấn viên kỹ thuật</p>
              <p className="text-xs font-black text-[#072554]">{companyName}</p>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>{hotline}</span>
            </a>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORM & KPI RESULT ================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Shape Switcher: 2 Big Visual Buttons */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                1. Chọn hình dạng sản phẩm cần bọc
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShape('box')}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                    shape === 'box'
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white border-transparent shadow-md shadow-blue-500/25 scale-[1.01]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                  }`}
                >
                  <Box className={`w-4 h-4 ${shape === 'box' ? 'text-white' : 'text-blue-600'}`} />
                  <span>Hộp / Khối Chữ Nhật</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShape('round')}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                    shape === 'round'
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white border-transparent shadow-md shadow-blue-500/25 scale-[1.01]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                  }`}
                >
                  <Cylinder className={`w-4 h-4 ${shape === 'round' ? 'text-white' : 'text-blue-600'}`} />
                  <span>Chai / Lọ / Khối Tròn</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-blue-600" />
                  Mẫu phổ biến (Click chọn nhanh):
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Mặc định
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {shape === 'box' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => applyPreset('box-food')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      Hộp Thực Phẩm (20x12x8)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('box-tea')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      Hộp Trà / Mỹ Phẩm (10x10x18)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('box-gift')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      Giỏ Quà / Hộp Lớn (32x22x10)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => applyPreset('round-bottle')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      Nắp Bình 20L (Ø6.8 x 4.5)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('round-water')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      Chai Nước 500ml (Ø6.5 x 18)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('round-jar')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                    >
                      Hũ Mỹ Phẩm / Bánh (Ø9.5 x 11)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Input Dimension Fields */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                2. Nhập số đo sản phẩm (đơn vị: centimet - cm)
              </label>

              {shape === 'box' ? (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Chiều Dài (L)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0.1"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="20"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        cm
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Chiều Rộng (W)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0.1"
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="12"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        cm
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Chiều Cao (H)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0.1"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="8"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        cm
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Đường Kính Lớn Nhất (Ø)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0.1"
                        step="0.1"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        placeholder="6.5"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        cm
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Chiều Cao Phần Cần Bọc
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0.1"
                        step="0.1"
                        value={roundHeight}
                        onChange={(e) => setRoundHeight(e.target.value)}
                        placeholder="4"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        cm
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= HIGH-TECH KPI RESULT CARD ================= */}
          <div className="rounded-2xl bg-gradient-to-br from-[#072554] via-[#0d3b7a] to-[#072554] p-5 sm:p-6 text-white shadow-xl shadow-blue-950/25 relative overflow-hidden border border-blue-500/30">
            {/* Background Ambient Radial Light */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Kết Quả Tính Toán Tối Ưu
                </span>
                <button
                  type="button"
                  onClick={handleCopySpecs}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white transition-all flex items-center gap-1"
                >
                  {copied ? (
                    <span className="text-emerald-300 font-black">✓ Đã copy!</span>
                  ) : (
                    <span>Sao chép kết quả</span>
                  )}
                </button>
              </div>

              {/* 2 KPI Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                {/* KPI 1: Khổ màng ép dẹp */}
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <p className="text-[11px] font-bold text-sky-200 uppercase tracking-wide mb-1">
                    Khổ màng dẹp gợi ý (Lay-flat)
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black font-mono text-white tracking-tight">
                      {flatCm.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-base font-bold text-sky-300">cm</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 font-mono">
                    ~ {Math.round(flatCm * 10)} mm (khổ cuộn/túi)
                  </p>
                </div>

                {/* KPI 2: Chiều dài cắt đoạn */}
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <p className="text-[11px] font-bold text-amber-200 uppercase tracking-wide mb-1">
                    Chiều dài cắt / đoạn túi
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black font-mono text-amber-300 tracking-tight">
                      {cutLenCm.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-base font-bold text-amber-200">cm</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 font-mono">
                    ~ {Math.round(cutLenCm * 10)} mm (gồm mép co)
                  </p>
                </div>
              </div>

              {/* CTA Link to Quote */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/15">
                <span className="text-xs text-slate-300 text-center sm:text-left">
                  Xưởng hỗ trợ cắt túi &amp; chia cuộn theo đúng kích thước trên.
                </span>
                <a
                  href="#bao-gia"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-md shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Gửi Quy Cách Nhận Báo Giá</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
