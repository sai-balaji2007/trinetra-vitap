/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Compass,
  Zap,
  Cpu,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  Building2,
  Quote,
  Sparkles,
  Play,
} from 'lucide-react';
import { LabExperimentType } from '../types/simulation';

interface HomeContentSectionsProps {
  onNavigateExplore: () => void;
  onRequestPilot: () => void;
  onLaunchSimulation: (labId: LabExperimentType) => void;
}

export const HomeContentSections: React.FC<HomeContentSectionsProps> = ({
  onNavigateExplore,
  onRequestPilot,
  onLaunchSimulation,
}) => {
  return (
    <div className="space-y-20 py-12 md:py-20 bg-[#080d1a] text-white">
      {/* 1. Problem and Opportunity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10182a] border border-[#f04432]/40 rounded-full text-xs font-semibold text-[#f04432] uppercase tracking-wider">
            <span>The STEM Education Gap</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Physical Lab Crisis vs. The TRINETRA Solution
          </h2>
          <p className="text-sm text-[#a7b0c0] leading-relaxed">
            Bridging the gap between rote blackboard memorization and true tactile experimentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* The Problem Card */}
          <div className="p-8 bg-[#10182a] border border-red-900/40 rounded-3xl space-y-5">
            <div className="flex items-center gap-2.5 text-[#f04432]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider font-mono">
                The Physical Lab Bottleneck
              </h3>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#a7b0c0]">
              <li className="flex items-start gap-3">
                <span className="text-[#f04432] font-bold">✕</span>
                <span>
                  <strong className="text-white">Extreme Hardware Scarcity:</strong> Over 80% of students in tier-2 and tier-3 colleges never get individual apparatus access, forced to crowd into passive groups of 6–8.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#f04432] font-bold">✕</span>
                <span>
                  <strong className="text-white">Prohibitive Equipment Costs:</strong> A modern physics, chemistry, or electrical lab costs ₹15L–₹35L to set up and lakhs in annual maintenance.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#f04432] font-bold">✕</span>
                <span>
                  <strong className="text-white">Zero Pre-Lab Trial & Error:</strong> Fear of burning out expensive multimeters or breaking glass test tubes discourages curiosity and inquiry.
                </span>
              </li>
            </ul>
          </div>

          {/* The Opportunity Card */}
          <div className="p-8 bg-[#10182a] border border-[#4b8bff]/40 rounded-3xl space-y-5">
            <div className="flex items-center gap-2.5 text-[#4b8bff]">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider font-mono">
                The TRINETRA Experiential Paradigm
              </h3>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#a7b0c0]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">1:1 Student Apparatus Access:</strong> Every student controls their own full 3D interactive laboratory right in their browser with 60 FPS fluidity.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Infinite Sandbox Trials:</strong> Test extreme variables—zero gravity on the Moon, 700K molecular agitation, or short-circuit limits—safely.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Instant Data & CSV Export:</strong> Real-time velocity-time curves and telemetry logs eliminate fabricated observation tables in practical notebooks.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. How TRINETRA Works (4-Step Workflow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider">
            Experiential Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How TRINETRA Works</h2>
          <p className="text-xs sm:text-sm text-[#a7b0c0]">
            From conceptual curiosity to verifiable scientific mastery in 4 guided steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Select Lab Module',
              desc: 'Choose from 50+ modules aligned with CBSE Class 11-12 and AICTE undergraduate engineering syllabi.',
            },
            {
              step: '02',
              title: 'Interact in 3D',
              desc: 'Manipulate realistic physical apparatus: adjust launch angles, supply voltages, molecular geometries, and damping ratios.',
            },
            {
              step: '03',
              title: 'Analyze Real-Time Curves',
              desc: 'Observe instantaneous velocity-time plots, resonant peaks, and export RFC 4180 CSV telemetry records.',
            },
            {
              step: '04',
              title: 'Master Viva & Quizzes',
              desc: 'Validate theoretical retention with rubric-based quizzes, error analysis questions, and earn verified certificates.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl relative space-y-3">
              <span className="text-2xl font-mono font-extrabold text-[#4b8bff]/40">{item.step}</span>
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-[#a7b0c0] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Platform Core Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono text-[#f04432] uppercase tracking-wider">
            Engineered For Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Capabilities</h2>
          <p className="text-xs sm:text-sm text-[#a7b0c0]">
            State-of-the-art WebGL physics engine designed for consumer laptops and mobile screens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Physics & Mathematical Fidelity',
              desc: 'Real-time differential kinematic solvers compute trajectories, harmonic damping, and VSEPR repulsion with zero pre-rendered shortcuts.',
            },
            {
              icon: BarChart2,
              title: 'Live v-t Graph & CSV Export',
              desc: 'Embedded real-time velocity vs. time canvas curves allow students to visually correlate acceleration derivatives and displacement integrals.',
            },
            {
              icon: Award,
              title: 'Gamified Progress & Streaks',
              desc: 'XP points, level milestones, competency radar mapping, and verified completion certificates incentivize daily exploration.',
            },
            {
              icon: Cpu,
              title: 'Lightweight & Browser-First',
              desc: 'Runs at smooth 60 FPS in standard browsers with zero downloads, zero plugins, and seamless mobile touch-responsiveness.',
            },
            {
              icon: ShieldCheck,
              title: 'Institutional Audit Records',
              desc: 'Faculty can export digital lab execution logs and attendance records mapped directly to NAAC and NBA accreditation standards.',
            },
            {
              icon: Compass,
              title: 'Syllabus-Aligned Lab Manuals',
              desc: 'Every virtual experiment features official CBSE and university practical manual formulas, observation sheets, and viva checklists.',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#4b8bff]/15 text-[#4b8bff] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{f.title}</h4>
                <p className="text-xs text-[#a7b0c0] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Simulations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider block">
              Curated Curriculum Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured 3D Learning Simulations
            </h2>
          </div>
          <button
            onClick={onNavigateExplore}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4b8bff] hover:text-[#3d7be6]"
          >
            <span>View Full 50+ Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Kinematic Projectile & Ballistics Motion',
              labId: 'physics' as LabExperimentType,
              subject: 'Physics',
              difficulty: 'Beginner',
              desc: 'Tune elevation cannon angle, initial speed, and celestial gravity to evaluate parabolic range equations.',
            },
            {
              title: '3D VSEPR Molecular Bonding & Orbitals',
              labId: 'chemistry' as LabExperimentType,
              subject: 'Chemistry',
              difficulty: 'Intermediate',
              desc: 'Inspect lone pair repulsions and dipole vectors in H₂O, CO₂, CH₄, NH₃, and SF₆ in real-time 3D space.',
            },
            {
              title: 'Digital Logic Gates & Breadboard TTL ICs',
              labId: 'electronics' as LabExperimentType,
              subject: 'Electronics',
              difficulty: 'Beginner',
              desc: 'Flip tactile switches A and B on a digital breadboard with SN7408 ICs and watch live oscilloscope waves.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#10182a] border border-slate-800 hover:border-[#4b8bff]/60 rounded-2xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#4b8bff] font-mono font-semibold">{item.subject}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400">
                    Live 3D Sandbox
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-[#a7b0c0] leading-relaxed">{item.desc}</p>
              </div>

              <button
                onClick={() => onLaunchSimulation(item.labId)}
                className="w-full py-2.5 px-3 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch in 3D Sandbox</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Statistics Section (Clearly marked demonstration placeholders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 bg-[#10182a] border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Platform Velocity & Pilot Benchmarks</h3>
              <p className="text-xs text-[#a7b0c0]">Projected metrics from initial institutional sandbox trials.</p>
            </div>
            <span className="text-[11px] font-mono text-[#f04432] bg-[#f04432]/10 border border-[#f04432]/30 px-2.5 py-1 rounded">
              Demonstration / Pilot Indicators
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#4b8bff]">50+</span>
              <span className="text-xs text-[#a7b0c0] block">Interactive STEM Modules</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">100%</span>
              <span className="text-xs text-[#a7b0c0] block">Hardware Risk Elimination</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#f04432]">10x</span>
              <span className="text-xs text-[#a7b0c0] block">More Practice Trials per Student</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">&lt; 1.2s</span>
              <span className="text-xs text-[#a7b0c0] block">Browser Execution Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section (Clearly marked sample content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider">
            Academic Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Feedback from Pilot Educators
          </h2>
          <p className="text-xs text-[#a7b0c0] font-mono">
            Sample qualitative feedback from university faculty and secondary school instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'TRINETRA allowed our second-year engineering students to visualize vector decomposition in projectile motion before ever setting foot in our physical dynamics lab. Viva performance improved noticeably.',
              author: 'Dr. S. K. Narayanan',
              role: 'Professor of Mechanical Engineering, Bengaluru',
            },
            {
              quote:
                'In our electronics lab, gate chips and multimeters frequently burnt out due to incorrect breadboard wiring. With the virtual sandbox, students debug their logic safely before wiring real hardware.',
              author: 'Prof. Ananya Sen',
              role: 'HOD, Electronics & Communication Engineering',
            },
            {
              quote:
                'Seeing the lone pair orbitals distort the bond angle of water in 3D right on my smartphone made VSEPR theory click in 5 minutes after weeks of memorizing 2D textbook diagrams.',
              author: 'Kavya R.',
              role: 'Class 12 CBSE Science Student',
            },
          ].map((t, idx) => (
            <div key={idx} className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <Quote className="w-6 h-6 text-[#4b8bff] opacity-50" />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-bold text-white">{t.author}</div>
                <div className="text-[11px] text-[#a7b0c0]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 bg-gradient-to-r from-[#10182a] via-[#142340] to-[#10182a] border border-[#f04432]/40 rounded-3xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Turn Learning Into Experience Today
          </h2>
          <p className="text-xs sm:text-base text-[#a7b0c0] max-w-2xl mx-auto leading-relaxed">
            Discover how TRINETRA brings practical STEM experimentation within reach of every student and college in India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateExplore}
              className="px-7 py-3.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
            >
              Explore 3D Simulations
            </button>
            <button
              onClick={onRequestPilot}
              className="px-7 py-3.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(240,68,50,0.3)]"
            >
              Request Institutional Pilot
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
