/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, DollarSign, BookOpen, BarChart3, Check } from 'lucide-react';

export const BenefitsGrid: React.FC = () => {
  const benefits = [
    {
      icon: Cpu,
      title: 'Browser-Native Speed',
      highlight: 'Zero Software Installs',
      desc: 'Instant WebGL execution directly in Chrome, Firefox, or Edge. Engineered for budget student laptops, mobile phones, and low-spec college computer lab workstations with 60 FPS fluidity.',
      stats: 'Loads in < 1.2s · 0 MB Local Footprint',
    },
    {
      icon: DollarSign,
      title: 'Zero Lab Hardware Cost',
      highlight: 'Save ₹15 Lakhs+ per Lab',
      desc: 'Completely eliminate component burnout, multimeter replacements, broken glassware, and expensive optical benches. Students practice unlimited trials without risking equipment damage.',
      stats: '₹0 Replacement Cost · 100% Student Safety',
    },
    {
      icon: BookOpen,
      title: 'Guided Step-by-Step Experiments',
      highlight: 'CBSE & AICTE Lab Alignment',
      desc: 'Each simulation includes standard practical steps, observation tables, theoretical error percentages, and viva voce practice questions matching Indian board and university syllabi.',
      stats: '50+ Verified Modules · Practical Viva Prep',
    },
    {
      icon: BarChart3,
      title: 'Campus Analytics & LMS Sync',
      highlight: 'Faculty Administration Dashboard',
      desc: 'Department heads and professors track real-time lab batch attendance, completion logs, parameter error distributions, and export verified digital lab records for NAAC & NBA audits.',
      stats: 'Automated Grading · NAAC/NBA Compliance',
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-[#0a0f1d] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Designed for Indian Universities & Colleges
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Indian Colleges & Students Choose Trinetra
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Bridging the infrastructure gap between premier IITs and regional engineering & polytechnic institutions through immersive browser-first laboratory technology.
          </p>
        </div>

        {/* 4-Card Benefit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 mb-5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-xs font-semibold text-cyan-400 mb-1">{b.highlight}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{b.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{b.stats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
