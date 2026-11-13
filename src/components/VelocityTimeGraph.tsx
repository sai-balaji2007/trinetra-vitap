/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Activity, TrendingUp, X, Minimize2, Maximize2 } from 'lucide-react';
import { VelocityTimePoint } from '../types/simulation';

interface VelocityTimeGraphProps {
  data: VelocityTimePoint[];
  currentVelocity: number;
  unit?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VelocityTimeGraph: React.FC<VelocityTimeGraphProps> = ({
  data,
  currentVelocity,
  unit = 'm/s',
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [minimized, setMinimized] = React.useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen || minimized) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background deep navy
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, width, height);

    // Padding for axis labels
    const padLeft = 45;
    const padBottom = 26;
    const padTop = 15;
    const padRight = 15;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(75, 139, 255, 0.15)';
    ctx.lineWidth = 1;

    // Horizontal grid
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }

    // Vertical grid
    for (let i = 0; i <= 5; i++) {
      const x = padLeft + (plotW / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, height - padBottom);
      ctx.stroke();
    }

    if (data.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Awaiting kinematic telemetry...', width / 2, height / 2);
      return;
    }

    // Velocity scale calculation
    const velocities = data.map((d) => d.velocity);
    const maxV = Math.max(Math.ceil(Math.max(...velocities, currentVelocity, 5) / 5) * 5, 10);
    const minV = 0;

    // Time window calculation (last 10 seconds or total elapsed)
    const lastTime = data[data.length - 1].time;
    const firstTime = Math.max(0, lastTime - 12);
    const timeSpan = lastTime - firstTime || 1;

    // Axis Labels Y
    ctx.fillStyle = '#a7b0c0';
    ctx.font = '10px IBM Plex Mono, monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotH / 4) * i;
      const val = maxV - (maxV / 4) * i;
      ctx.fillText(`${val.toFixed(0)}`, padLeft - 6, y + 3);
    }

    // Axis Labels X
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const x = padLeft + (plotW / 4) * i;
      const tVal = firstTime + (timeSpan / 4) * i;
      ctx.fillText(`${tVal.toFixed(1)}s`, x, height - 8);
    }

    // Title / Axis indicator
    ctx.fillStyle = '#4b8bff';
    ctx.font = 'bold 9px IBM Plex Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('v (m/s)', padLeft - 38, padTop - 3);

    // Filter points in current view window
    const windowPoints = data.filter((d) => d.time >= firstTime);
    if (windowPoints.length < 2) return;

    // Draw Velocity Curve Area Gradient
    const gradient = ctx.createLinearGradient(0, padTop, 0, height - padBottom);
    gradient.addColorStop(0, 'rgba(75, 139, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(75, 139, 255, 0.0)');

    ctx.beginPath();
    windowPoints.forEach((pt, i) => {
      const x = padLeft + ((pt.time - firstTime) / timeSpan) * plotW;
      const normalizedV = Math.min(1, Math.max(0, pt.velocity / maxV));
      const y = height - padBottom - normalizedV * plotH;
      if (i === 0) ctx.moveTo(x, height - padBottom);
      ctx.lineTo(x, y);
      if (i === windowPoints.length - 1) {
        ctx.lineTo(x, height - padBottom);
      }
    });
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Velocity Stroke Line
    ctx.strokeStyle = '#4b8bff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    windowPoints.forEach((pt, i) => {
      const x = padLeft + ((pt.time - firstTime) / timeSpan) * plotW;
      const normalizedV = Math.min(1, Math.max(0, pt.velocity / maxV));
      const y = height - padBottom - normalizedV * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Latest Point Pulsing Dot
    const lastPt = windowPoints[windowPoints.length - 1];
    const lastX = padLeft + ((lastPt.time - firstTime) / timeSpan) * plotW;
    const lastY = height - padBottom - Math.min(1, Math.max(0, lastPt.velocity / maxV)) * plotH;

    ctx.fillStyle = '#f04432';
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, currentVelocity, isOpen, minimized]);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute bottom-24 left-4 z-30 transition-all duration-300 rounded-xl bg-[#080d1a]/95 border border-[#4b8bff]/40 shadow-2xl backdrop-blur-md pointer-events-auto ${
        minimized ? 'w-56' : 'w-80 sm:w-96'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#4b8bff]" />
          <h4 className="text-xs font-bold text-white tracking-wide">Velocity vs. Time (v-t)</h4>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={minimized ? 'Expand Graph' : 'Minimize Graph'}
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Close Graph"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {!minimized ? (
        <div className="p-3 space-y-2.5">
          {/* Real-time Numeric Readout Banner */}
          <div className="flex items-center justify-between bg-[#10182a] p-2.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] text-[#a7b0c0] uppercase font-mono block">
                Instantaneous Velocity v(t)
              </span>
              <span className="text-lg font-mono font-bold text-white tabular-nums">
                {currentVelocity.toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#4b8bff]">{unit}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#a7b0c0] uppercase font-mono block">Peak Observed</span>
              <span className="text-sm font-mono font-semibold text-[#f04432] tabular-nums">
                {Math.max(...(data.map((d) => d.velocity) || [0]), currentVelocity).toFixed(1)} {unit}
              </span>
            </div>
          </div>

          {/* HTML5 2D Canvas Graph */}
          <canvas
            ref={canvasRef}
            width={340}
            height={150}
            className="w-full h-36 rounded-lg border border-slate-800/80 bg-[#080d1a]"
          />

          <div className="flex items-center justify-between text-[10px] text-[#a7b0c0] font-mono">
            <span>dv/dt = acceleration</span>
            <span>∫ v dt = displacement</span>
          </div>
        </div>
      ) : (
        <div className="p-2.5 flex items-center justify-between">
          <span className="text-xs text-[#a7b0c0] font-mono">v(t):</span>
          <span className="text-sm font-mono font-bold text-[#4b8bff]">
            {currentVelocity.toFixed(2)} {unit}
          </span>
        </div>
      )}
    </div>
  );
};
