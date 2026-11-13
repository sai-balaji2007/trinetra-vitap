/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, CheckCircle2, ChevronRight, Compass, Sparkles, Zap } from 'lucide-react';

interface HeroProps {
  onExploreSimulations: () => void;
  onDiscoverTrinetra: () => void;
  onLaunchDemo: () => void;
  onOpenCurriculum: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreSimulations,
  onDiscoverTrinetra,
  onLaunchDemo,
  onOpenCurriculum,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-800/80 bg-[#080d1a]">
      {/* Background glow radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#4b8bff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-[#f04432]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs text-slate-300">
            <span className="text-[#f04432] font-semibold">TRINETRA</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-[#a7b0c0]">Experience Learning Beyond Boundaries.</span>
          </div>

          {/* Exact Required Headline */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Turn Learning Into{' '}
            <span className="bg-gradient-to-r from-[#4b8bff] via-sky-300 to-[#f04432] bg-clip-text text-transparent">
              Experience.
            </span>
          </h1>

          {/* Exact Required Supporting Text */}
          <p
            className="text-base sm:text-lg md:text-xl text-[#a7b0c0] max-w-3xl mx-auto font-normal leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            Explore, experiment and master concepts through interactive virtual simulations. TRINETRA
            brings practical learning closer to every student.
          </p>

          {/* Two Required CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onExploreSimulations}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(240,68,50,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Simulations</span>
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={onDiscoverTrinetra}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#10182a] hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              <span>Discover TRINETRA</span>
              <ArrowDown className="w-4 h-4 text-[#4b8bff]" />
            </button>
          </div>

          {/* Secondary Trust & Curriculum Indicators */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#a7b0c0]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4b8bff]" />
              <span>Zero Hardware Barrier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>60 FPS on Any Device</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f04432]" />
              <span>Live v-t Graph & CSV Export</span>
            </div>
            <button
              onClick={onOpenCurriculum}
              className="flex items-center gap-1 text-[#4b8bff] hover:underline font-medium cursor-pointer"
            >
              <span>View CBSE & AICTE Syllabus Mapping</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
