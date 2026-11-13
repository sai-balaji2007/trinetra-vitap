/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Building2, User, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface PricingSectionProps {
  onRequestPilot: (type?: 'student' | 'college') => void;
  isStandalonePage?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onRequestPilot,
  isStandalonePage = false,
}) => {
  const [studentBatchSize, setStudentBatchSize] = useState<number>(300);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // College savings calculation: physical lab setup ~ ₹15,00,000 capex
  const annualCollegeCost = studentBatchSize * 500;
  const estimatedPhysicalSavings = 1500000 - annualCollegeCost;

  return (
    <section
      id="pricing"
      className={`py-16 md:py-24 bg-[#080d1a] border-b border-slate-800/80 ${
        isStandalonePage ? 'pt-10' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs font-semibold text-[#4b8bff] uppercase tracking-wider">
            <span>Transparent Academic Plans</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-[#a7b0c0] font-normal normal-case">Proposed Pilot Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Fair & Transparent STEM Simulation Pricing
          </h2>
          <p className="text-[#a7b0c0] text-sm sm:text-base leading-relaxed">
            Eliminate prohibitive laboratory capital expenditures. Empower every student and department with
            browser-native virtual experimentation.
          </p>

          {/* Pilot Disclaimer Tag */}
          <div className="p-3 bg-[#10182a]/80 border border-slate-800 rounded-xl text-xs text-[#a7b0c0] max-w-2xl mx-auto">
            <span className="text-[#f04432] font-semibold">Note on Proposed Pricing:</span> Figures shown reflect current proposed pilot pricing for validation. Custom enterprise licenses and university multi-year consortium rates are arranged via academic consultation.
          </div>
        </div>

        {/* 3 Pricing Cards: Stacked vertically on small viewports, 3-column on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Plan 1: Free Student Starter */}
          <div className="flex flex-col justify-between p-7 bg-[#10182a] border border-slate-800 hover:border-slate-700 rounded-2xl relative transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-slate-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Student Starter</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800/90 px-2.5 py-0.5 rounded-full">
                  Free Tier
                </span>
              </div>

              <p className="text-xs text-[#a7b0c0] mb-6 leading-relaxed">
                Foundational interactive access for students exploring core physics and logic concepts.
              </p>

              {/* Price Tag */}
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-[#a7b0c0]">/ lifetime</span>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 mb-8 text-xs text-slate-300">
                {[
                  '10 Foundational 3D simulations (Mechanics & Logic)',
                  'Real-time parameter controls & interactive sliders',
                  'Standard lab theory & observation sheets',
                  'Community forum access & student discussions',
                  '100% Browser-native on mobile and laptop',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#4b8bff] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onRequestPilot('student')}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Get Free Student Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 2: Premium Student Pass */}
          <div className="flex flex-col justify-between p-7 bg-[#0d1526] border border-[#4b8bff]/40 hover:border-[#4b8bff]/80 rounded-2xl relative shadow-lg transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#4b8bff]/20 rounded-lg text-[#4b8bff]">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Student Lab Pass</h3>
                </div>
                <span className="text-xs font-semibold text-[#4b8bff] bg-[#4b8bff]/15 px-2.5 py-0.5 rounded-full border border-[#4b8bff]/30">
                  Individual B2C
                </span>
              </div>

              <p className="text-xs text-[#a7b0c0] mb-6 leading-relaxed">
                Designed for CBSE 11–12 and B.Tech engineering students mastering practical vivas and competitive exams.
              </p>

              {/* Price Tag (Proposed placeholder) */}
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">₹199</span>
                <span className="text-xs text-[#a7b0c0]">/ month (proposed)</span>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 mb-8 text-xs text-slate-300">
                {[
                  'Full access to all 50+ 3D simulations across disciplines',
                  'Unlimited CSV telemetry data downloads for lab writeups',
                  'Real-time Velocity vs. Time & transient waveform graphs',
                  'Step-by-step viva voce questions & rubric prep',
                  'Personalized learning gap detection & certificates',
                  'Priority updates on newly released university modules',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#4b8bff] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onRequestPilot('student')}
              className="w-full py-3 px-4 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Student Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 3: College Campus License */}
          <div className="flex flex-col justify-between p-7 bg-[#10182a] border-2 border-[#f04432]/60 hover:border-[#f04432] rounded-2xl relative shadow-[0_0_25px_rgba(240,68,50,0.15)] transition-all">
            {/* Top Institutional Badge */}
            <div className="absolute -top-3 right-6 bg-[#f04432] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              Campus License
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#f04432]/20 rounded-lg text-[#f04432]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">College Enterprise</h3>
                </div>
                <span className="text-xs font-semibold text-[#f04432] bg-[#f04432]/15 px-2.5 py-0.5 rounded-full border border-[#f04432]/30">
                  Institutional B2B
                </span>
              </div>

              <p className="text-xs text-[#a7b0c0] mb-6 leading-relaxed">
                Campus-wide deployment for engineering colleges and polytechnics with full faculty administration.
              </p>

              {/* Price Tag (Proposed placeholder) */}
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#f04432]">₹500</span>
                <span className="text-xs text-[#a7b0c0]">/ student / year (proposed)</span>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 mb-8 text-xs text-slate-300">
                {[
                  'Central Faculty Dashboard for batch & class tracking',
                  'Bulk student onboarding via CSV or Moodle/Google LMS',
                  'Custom state technical university syllabus mapping (VTU, Anna Univ, etc.)',
                  'Automated student competency logs & viva readiness reports',
                  'NAAC Criterion 2 & NBA digital audit compliance records',
                  'Dedicated faculty onboarding workshops & technical support',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#f04432] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onRequestPilot('college')}
              className="w-full py-3 px-4 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(240,68,50,0.3)] flex items-center justify-center gap-2"
            >
              <span>Contact Us / Request Pilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive College Batch Cost & Savings Calculator */}
        <div className="mt-14 max-w-4xl mx-auto p-6 md:p-8 bg-[#10182a] border border-slate-800 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                Institutional Investment & Savings Estimator
              </h4>
              <p className="text-xs text-[#a7b0c0]">
                Simulate your college batch size to project estimated virtual lab savings compared to physical apparatus maintenance.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-[#a7b0c0] block uppercase font-mono">Proposed Annual License</span>
              <span className="text-2xl font-mono font-bold text-[#4b8bff]">
                ₹{annualCollegeCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Batch Volume: <strong className="text-[#4b8bff]">{studentBatchSize} students</strong></span>
              <span>Est. Physical Lab Equipment Savings: <strong className="text-emerald-400">₹{Math.max(0, estimatedPhysicalSavings).toLocaleString('en-IN')}</strong></span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={studentBatchSize}
              onChange={(e) => setStudentBatchSize(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#a7b0c0] font-mono">
              <span>50 Students (Single Dept)</span>
              <span>500 Students</span>
              <span>1,000 Students</span>
              <span>2,000+ Students (Full Campus)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
