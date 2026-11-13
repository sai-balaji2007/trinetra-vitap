/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookCheck, Check, GraduationCap } from 'lucide-react';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperiment: (exp: 'physics' | 'chemistry' | 'electronics') => void;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
  onSelectExperiment,
}) => {
  if (!isOpen) return null;

  const curriculumData = [
    {
      domain: 'Physics Mechanics & Dynamics',
      expId: 'physics' as const,
      board: 'CBSE Class 11 & First-Year Engineering',
      experiments: [
        {
          code: 'PHY-LAB-01',
          name: 'Projectile Motion & Trajectory Analysis',
          objective: 'Measure variation of horizontal range R and peak altitude H with launch angle θ and initial velocity v₀.',
          formula: 'R = (v₀² · sin 2θ) / g',
        },
        {
          code: 'PHY-LAB-02',
          name: 'Simple Harmonic Motion of a Damped Pendulum',
          objective: 'Determine acceleration due to gravity g by plotting L vs T² graph and evaluate fluid drag damping ratios.',
          formula: 'T = 2π√(L / g)',
        },
      ],
    },
    {
      domain: 'Chemical Bonding & Molecular Architecture',
      expId: 'chemistry' as const,
      board: 'CBSE Class 11 Unit 4 & B.Tech Engg Chemistry',
      experiments: [
        {
          code: 'CHM-LAB-01',
          name: 'VSEPR Molecular Geometry & Lone Pair Distortion',
          objective: 'Analyze steric numbers and bond angle deviations in H₂O (104.5°), NH₃ (107°), CH₄ (109.5°), and SF₆ (90°).',
          formula: 'Steric No. = ½[V + M - C + A]',
        },
        {
          code: 'CHM-LAB-02',
          name: 'Molecular Dipole Vectors & Thermal Kinetic Vibrations',
          objective: 'Demonstrate vector dipole cancellation in symmetric molecules (CO₂, SF₆) vs polar molecules (H₂O, NH₃).',
          formula: 'μ = Σ(qᵢ · dᵢ)',
        },
      ],
    },
    {
      domain: 'Digital & Analog Electronics',
      expId: 'electronics' as const,
      board: 'AICTE First-Year BEEE / State Technical Universities',
      experiments: [
        {
          code: 'ECE-LAB-01',
          name: 'Verification of Digital Logic Gates (74xx Series)',
          objective: 'Verify truth tables for basic and universal gates (AND 7408, OR 7432, NOT 7404, NAND 7400, XOR 7486).',
          formula: 'TTL Voltage Thresholds: VIL = 0.8V, VIH = 2.0V',
        },
        {
          code: 'ECE-LAB-02',
          name: 'Oscilloscopic Waveform & Propagation Delay',
          objective: 'Observe dynamic waveform rise time, clock pulse response, and compute gate propagation delay tpd.',
          formula: 'tpd = ½(tPLH + tPHL) ≈ 8.5 ns',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c1424] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-950/80 border border-cyan-800/60 rounded-xl text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Indian STEM Curriculum Syllabus Mapping
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Direct alignment with CBSE, AICTE Model Curriculum, VTU, Anna Univ, and AKTU lab requirements.
            </p>
          </div>
        </div>

        {/* Curriculum Sections */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {curriculumData.map((sec, idx) => (
            <div key={idx} className="p-4 bg-[#10192d] border border-slate-800 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">{sec.domain}</h4>
                  <span className="text-xs text-cyan-400 font-mono">{sec.board}</span>
                </div>
                <button
                  onClick={() => {
                    onSelectExperiment(sec.expId);
                    onClose();
                  }}
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors"
                >
                  Load in 3D Lab →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.experiments.map((exp, eIdx) => (
                  <div key={eIdx} className="p-3 bg-[#0a101f] border border-slate-800/80 rounded-lg text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                      <span>{exp.code}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    </div>
                    <div className="font-semibold text-slate-200">{exp.name}</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{exp.objective}</p>
                    <div className="p-1.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-cyan-400">
                      {exp.formula}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>All experiments generate verifiable RFC 4180 CSV telemetry records.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
