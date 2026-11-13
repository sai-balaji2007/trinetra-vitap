/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Users,
  BarChart3,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface InstitutionsPageProps {
  onRequestPilot: () => void;
}

export const InstitutionsPage: React.FC<InstitutionsPageProps> = ({ onRequestPilot }) => {
  const [selectedBatch, setSelectedBatch] = useState<'Section-A' | 'Section-B'>('Section-A');

  // Demonstration classroom analytics
  const batchAnalytics = {
    'Section-A': {
      enrolled: 64,
      avgCompletion: 89,
      avgAccuracy: 91,
      studentsNeedingAssistance: 4,
      flaggedModule: 'Projectile Kinematics (High Drag Scenarios)',
    },
    'Section-B': {
      enrolled: 62,
      avgCompletion: 76,
      avgAccuracy: 82,
      studentsNeedingAssistance: 9,
      flaggedModule: 'Digital Logic Gates (XOR Propagation Delay)',
    },
  };

  const studentsNeedingSupport = [
    {
      name: 'Rohan Deshmukh',
      id: 'SEC-A-014',
      issue: 'Failed projectile trajectory trial 3 times with negative angles.',
      remedy: 'Auto-assigned 10m tutorial module: Angular Decomposition.',
    },
    {
      name: 'Pooja Iyer',
      id: 'SEC-A-032',
      issue: 'Incomplete observation table in VSEPR bonding experiment.',
      remedy: 'Prompted with guided step-by-step checklist.',
    },
    {
      name: 'Vikas Reddy',
      id: 'SEC-A-058',
      issue: 'Timing discrepancy in pendulum period calculation.',
      remedy: 'Assigned damped oscillator calibration sandbox.',
    },
  ];

  const currentStats = batchAnalytics[selectedBatch];

  return (
    <div className="py-10 md:py-16 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10182a] border border-[#f04432]/40 rounded-full text-xs font-semibold text-[#f04432] uppercase tracking-wider">
            <span>Institutional Transformation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Institutional Laboratory Intelligence for Colleges & Universities
          </h1>
          <p className="text-sm sm:text-base text-[#a7b0c0] leading-relaxed">
            Eliminate laboratory bottlenecks, monitor student experimentation in real-time,
            and satisfy NAAC & NBA criteria with verified digital virtual lab audit logs.
          </p>
          <div className="pt-2">
            <button
              onClick={onRequestPilot}
              className="px-6 py-3.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(240,68,50,0.3)] inline-flex items-center gap-2"
            >
              <span>Schedule Institutional Faculty Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Institutional Benefits Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 bg-[#10182a] border border-slate-800 rounded-3xl space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#4b8bff]/15 text-[#4b8bff] flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Save ₹15L+ in Equipment Capex</h3>
            <p className="text-xs text-[#a7b0c0] leading-relaxed">
              No recurrent consumable replacement, burnt oscilloscope probes, shattered burettes, or
              expensive annual maintenance contracts (AMCs).
            </p>
          </div>

          <div className="p-7 bg-[#10182a] border border-slate-800 rounded-3xl space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#f04432]/15 text-[#f04432] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">NAAC & NBA Audit Readiness</h3>
            <p className="text-xs text-[#a7b0c0] leading-relaxed">
              One-click export of verifiable practical execution logs, student observation records,
              and learning outcome attainment mapped to AICTE benchmarks.
            </p>
          </div>

          <div className="p-7 bg-[#10182a] border border-slate-800 rounded-3xl space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Student Participation</h3>
            <p className="text-xs text-[#a7b0c0] leading-relaxed">
              Every single student operates their own individual 3D apparatus rather than passively
              watching from the back row in crowded physical lab sessions.
            </p>
          </div>
        </div>

        {/* Interactive Faculty Administration Console Preview */}
        <div className="p-6 sm:p-9 bg-[#10182a] border border-slate-800 rounded-3xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider block">
                Interactive Faculty Console
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Class-Wise Competency & Monitoring Dashboard
              </h2>
            </div>

            {/* Batch Selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-[#a7b0c0]">Select Batch:</span>
              <div className="flex items-center gap-1 bg-[#080d1a] p-1 rounded-lg border border-slate-800">
                {(['Section-A', 'Section-B'] as const).map((batch) => (
                  <button
                    key={batch}
                    onClick={() => setSelectedBatch(batch)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedBatch === batch
                        ? 'bg-[#4b8bff] text-white font-semibold'
                        : 'text-[#a7b0c0] hover:text-white'
                    }`}
                  >
                    {batch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-[#a7b0c0] uppercase font-mono block">Enrolled Students</span>
              <span className="text-xl font-mono font-bold text-white">{currentStats.enrolled}</span>
            </div>

            <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-[#a7b0c0] uppercase font-mono block">Avg. Completion Rate</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{currentStats.avgCompletion}%</span>
            </div>

            <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-[#a7b0c0] uppercase font-mono block">Accuracy Benchmark</span>
              <span className="text-xl font-mono font-bold text-[#4b8bff]">{currentStats.avgAccuracy}%</span>
            </div>

            <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-[#a7b0c0] uppercase font-mono block">Students Needing Help</span>
              <span className="text-xl font-mono font-bold text-[#f04432]">{currentStats.studentsNeedingAssistance}</span>
            </div>
          </div>

          {/* Identification of Students Requiring Additional Support */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#f04432]" />
                <h3 className="text-sm font-bold text-white">
                  Identified Students Requiring Academic Intervention
                </h3>
              </div>
              <span className="text-xs text-[#a7b0c0] font-mono">Automated Early Warning</span>
            </div>

            <div className="divide-y divide-slate-800 bg-[#080d1a] border border-slate-800 rounded-2xl p-4">
              {studentsNeedingSupport.map((st, i) => (
                <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{st.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {st.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#f04432] mt-0.5">{st.issue}</p>
                  </div>
                  <div className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg font-mono">
                    {st.remedy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Remediation Plan Banner */}
          <div className="p-5 bg-[#080d1a] border border-[#4b8bff]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Class-wide Remediation Suggested</h4>
              <p className="text-xs text-[#a7b0c0] mt-0.5">
                Targeted intervention suggested on: <strong className="text-cyan-400">{currentStats.flaggedModule}</strong>.
              </p>
            </div>
            <button
              onClick={onRequestPilot}
              className="px-4 py-2 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-semibold rounded-xl whitespace-nowrap transition-colors"
            >
              Assign Remediation Worksheet
            </button>
          </div>
        </div>

        {/* Institutional Onboarding CTA */}
        <div className="p-8 sm:p-12 bg-gradient-to-r from-[#10182a] via-[#142340] to-[#10182a] border border-[#f04432]/40 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Modernize Your Campus Laboratories?
          </h3>
          <p className="text-xs sm:text-sm text-[#a7b0c0] max-w-xl mx-auto leading-relaxed">
            Join forward-thinking engineering and science institutions delivering zero-barrier practical STEM education.
          </p>
          <div className="pt-2">
            <button
              onClick={onRequestPilot}
              className="px-6 py-3.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(240,68,50,0.3)] inline-flex items-center gap-2"
            >
              <span>Schedule Live Pilot Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
