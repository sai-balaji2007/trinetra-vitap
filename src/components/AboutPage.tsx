/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Compass, Eye, ShieldCheck, Zap, Users, GraduationCap, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigateExplore: () => void;
  onRequestContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateExplore, onRequestContact }) => {
  return (
    <div className="py-12 md:py-20 bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10182a] border border-[#f04432]/40 rounded-full text-xs font-semibold text-[#f04432] uppercase tracking-wider">
            <span>Our Origin & Purpose</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Democratizing Practical STEM Education Across India
          </h1>
          <p className="text-sm sm:text-lg text-[#a7b0c0] leading-relaxed">
            TRINETRA was founded with a singular conviction: theoretical knowledge without experiential
            validation limits potential. We bring interactive, hardware-accurate 3D simulations to every
            browser, breaking down economic and geographic barriers.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#10182a] border border-slate-800 rounded-3xl relative group hover:border-[#4b8bff]/50 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#4b8bff]/20 text-[#4b8bff] mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-sm text-[#a7b0c0] leading-relaxed">
              To create an educational landscape where every student in India—from premier urban institutes
              to regional rural polytechnics—has equal, unlimited access to world-class laboratory experimentation
              right in their pocket or personal device.
            </p>
          </div>

          <div className="p-8 bg-[#10182a] border border-slate-800 rounded-3xl relative group hover:border-[#f04432]/50 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f04432]/20 text-[#f04432] mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-sm text-[#a7b0c0] leading-relaxed">
              Make practical, experiential and interactive learning accessible to students regardless of their
              geographical or institutional limitations by engineering ultra-lightweight, browser-native 3D simulations
              grounded in certified curriculum frameworks.
            </p>
          </div>
        </div>

        {/* The Educational Accessibility Problem */}
        <div className="p-8 sm:p-10 bg-[#10182a] border border-slate-800 rounded-3xl space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono text-[#f04432] uppercase tracking-wider block mb-1">
              The Reality of Higher Education
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The Laboratory Accessibility Divide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-[#080d1a] border border-slate-800/80 rounded-2xl space-y-2">
              <div className="text-2xl font-bold font-mono text-[#f04432]">85%</div>
              <h4 className="text-sm font-semibold text-white">Hardware Bottlenecks</h4>
              <p className="text-xs text-[#a7b0c0] leading-relaxed">
                In majority of regional institutions, 6–8 students cluster around a single multimeter or optics bench,
                relegating most to passive observers rather than hands-on experimenters.
              </p>
            </div>

            <div className="p-5 bg-[#080d1a] border border-slate-800/80 rounded-2xl space-y-2">
              <div className="text-2xl font-bold font-mono text-[#4b8bff]">₹15L+</div>
              <h4 className="text-sm font-semibold text-white">Annual Maintenance & Capex</h4>
              <p className="text-xs text-[#a7b0c0] leading-relaxed">
                Physical lab equipment incurs heavy capital depreciation, recurring consumable costs, and frequent
                breakage, leaving labs out-of-order for months.
              </p>
            </div>

            <div className="p-5 bg-[#080d1a] border border-slate-800/80 rounded-2xl space-y-2">
              <div className="text-2xl font-bold font-mono text-emerald-400">1-Trial</div>
              <h4 className="text-sm font-semibold text-white">Fear of Failure</h4>
              <p className="text-xs text-[#a7b0c0] leading-relaxed">
                Fear of damaging expensive lab equipment prevents curious students from testing unconventional parameters,
                stifling true scientific discovery and learning.
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach to Experiential Learning */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider">Pedagogical Framework</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Our 4-Pillar Learning Model</h2>
            <p className="text-xs sm:text-sm text-[#a7b0c0]">
              Built upon cognitive constructivism, active experimentation, and instant feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Mathematical Fidelity',
                desc: 'Every parameter slider triggers authentic ODE and differential physics solvers rather than pre-rendered video animations.',
              },
              {
                icon: Compass,
                title: 'Infinite Sandbox Retries',
                desc: 'Students can test extreme edge cases—from zero gravity on the Moon to 1000K thermal excitation—without risk or cost.',
              },
              {
                icon: Award,
                title: 'Gamified Competency',
                desc: 'Interactive viva quizzes, telemetry export challenges, and milestone badges incentivize deeper mastery.',
              },
              {
                icon: Users,
                title: 'Campus Inclusivity',
                desc: 'Engineered to run seamlessly on low-cost dual-core Android phones, basic Chromebooks, and rural computer labs.',
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4b8bff]/15 text-[#4b8bff] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">{p.title}</h4>
                  <p className="text-xs text-[#a7b0c0] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 sm:p-12 bg-gradient-to-r from-[#10182a] via-[#132038] to-[#10182a] border border-[#4b8bff]/40 rounded-3xl text-center space-y-4">
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            Join the Experiential STEM Revolution
          </h3>
          <p className="text-xs sm:text-sm text-[#a7b0c0] max-w-xl mx-auto">
            Experience our interactive 3D simulations firsthand or partner with us to bring TRINETRA
            to your university campus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateExplore}
              className="px-6 py-3 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
            >
              Explore Simulations
            </button>
            <button
              onClick={onRequestContact}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all border border-slate-700"
            >
              Contact Our Academic Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
