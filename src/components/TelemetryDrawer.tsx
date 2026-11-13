/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Download, X, FileSpreadsheet, Info } from 'lucide-react';
import {
  ChemistryParams,
  ElectronicsParams,
  LabExperimentType,
  PhysicsParams,
  TelemetryPoint,
} from '../types/simulation';

interface TelemetryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: LabExperimentType;
  history: TelemetryPoint[];
  currentPoint: TelemetryPoint | null;
  physicsParams: PhysicsParams;
  chemistryParams: ChemistryParams;
  electronicsParams: ElectronicsParams;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  isOpen,
  onClose,
  experiment,
  history,
  currentPoint,
  physicsParams,
  chemistryParams,
  electronicsParams,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw sparkline telemetry graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen || history.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#070d18';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(30, 48, 80, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 20; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 40; x < width; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Determine scale bounds
    const val1Array = history.map((p) => p.val1);
    const maxVal1 = Math.max(...val1Array, 1);
    const minVal1 = Math.min(...val1Array, 0);
    const range1 = maxVal1 - minVal1 || 1;

    // Draw Line 1 (Cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = (i / (history.length - 1)) * (width - 20) + 10;
      const normalizedY = (pt.val1 - minVal1) / range1;
      const y = height - 15 - normalizedY * (height - 35);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Line 2 (Amber / Secondary)
    const val2Array = history.map((p) => p.val2);
    const maxVal2 = Math.max(...val2Array, 1);
    const minVal2 = Math.min(...val2Array, 0);
    const range2 = maxVal2 - minVal2 || 1;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = (i / (history.length - 1)) * (width - 20) + 10;
      const normalizedY = (pt.val2 - minVal2) / range2;
      const y = height - 15 - normalizedY * (height - 35);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }, [history, isOpen]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (history.length === 0) return;

    const label1 = currentPoint?.label1 || 'Metric 1';
    const label2 = currentPoint?.label2 || 'Metric 2';

    let csvContent = `Timestamp (s),${label1},${label2},Experiment,Status\n`;
    history.forEach((row) => {
      csvContent += `${row.time},${row.val1},${row.val2},${experiment},VERIFIED\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `trinetra_${experiment}_lab_telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-96 max-w-[calc(100vw-32px)] bg-[#0c1424] border border-slate-700/90 rounded-xl shadow-2xl z-30 p-4 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Live Telemetry & Analytics</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Numeric Values */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="bg-[#121c32] p-2.5 rounded-lg border border-cyan-500/30">
          <div className="text-[11px] text-slate-400 truncate">{currentPoint?.label1 || 'Primary'}</div>
          <div className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
            {currentPoint?.val1 ?? '0.00'}
          </div>
        </div>

        <div className="bg-[#121c32] p-2.5 rounded-lg border border-amber-500/30">
          <div className="text-[11px] text-slate-400 truncate">{currentPoint?.label2 || 'Secondary'}</div>
          <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
            {currentPoint?.val2 ?? '0.00'}
          </div>
        </div>
      </div>

      {/* Sparkline Canvas Graph */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-cyan-400 inline-block" />
            <span>{currentPoint?.label1 || 'Metric 1'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-amber-400 border-dashed inline-block" />
            <span>{currentPoint?.label2 || 'Metric 2'}</span>
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={350}
          height={110}
          className="w-full h-28 rounded-lg border border-slate-800 bg-[#070d18]"
        />
      </div>

      {/* Theoretical Formula Callout */}
      <div className="mt-3 p-2.5 bg-[#101a2e] border border-slate-800 rounded-lg text-xs space-y-1">
        <div className="flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Curriculum Laboratory Formula</span>
        </div>
        {experiment === 'physics' && (
          <div className="font-mono text-slate-300 text-[11px] space-y-0.5">
            <div>Range R = (v₀² · sin 2θ) / g</div>
            <div>Time of flight T = (2 · v₀ · sin θ) / g</div>
            <div>Pendulum Period T = 2π√(L / g)</div>
          </div>
        )}
        {experiment === 'chemistry' && (
          <div className="font-mono text-slate-300 text-[11px] space-y-0.5">
            <div>VSEPR Steric No. = ½[V + M - C + A]</div>
            <div>Kinetic Energy Ek = (3/2) · kB · T</div>
            <div>Dipole Moment μ = q · d (Debye)</div>
          </div>
        )}
        {experiment === 'electronics' && (
          <div className="font-mono text-slate-300 text-[11px] space-y-0.5">
            <div>Boolean Function: Q = f(A, B)</div>
            <div>Propagation Delay tpd ≈ 8.5 ns (TTL)</div>
            <div>Low Noise Margin VNL = 0.4 V</div>
          </div>
        )}
      </div>

      {/* CSV Export Action Button */}
      <button
        onClick={handleExportCSV}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-lg"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export Telemetry (CSV)</span>
      </button>
    </div>
  );
};
