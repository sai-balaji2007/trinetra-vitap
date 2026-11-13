/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, Play, CheckCircle2, Star, Clock, Sparkles, BookOpen } from 'lucide-react';
import { SIMULATION_CATALOG } from '../data/simulationCatalog';
import { CatalogSimulation, LabExperimentType } from '../types/simulation';

interface ExplorePageProps {
  onLaunchSimulation: (labId?: LabExperimentType) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onLaunchSimulation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedSimDetail, setSelectedSimDetail] = useState<CatalogSimulation | null>(null);

  const subjects = ['All', 'Physics', 'Electronics', 'Electrical', 'Mechanical', 'Computer Science'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered simulations
  const filteredSimulations = useMemo(() => {
    return SIMULATION_CATALOG.filter((sim) => {
      const matchesSearch =
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || sim.subject === selectedSubject;
      const matchesDiff = selectedDifficulty === 'All' || sim.difficulty === selectedDifficulty;
      return matchesSearch && matchesSubject && matchesDiff;
    });
  }, [searchQuery, selectedSubject, selectedDifficulty]);

  return (
    <div className="py-10 md:py-16 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs font-semibold text-[#4b8bff] uppercase tracking-wider">
            <span>Simulation Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Explore 3D STEM Virtual Simulations
          </h1>
          <p className="text-sm text-[#a7b0c0] leading-relaxed">
            Search our growing catalog of interactive engineering and science laboratory experiments.
            Test parameters, analyze telemetry, and verify theoretical laws without hardware barriers.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#a7b0c0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search simulations, concepts, or formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4b8bff]"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[#a7b0c0]">
              <span className="font-medium">Difficulty:</span>
              <div className="flex items-center gap-1 bg-[#080d1a] p-1 rounded-lg border border-slate-800">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-[#4b8bff] text-white'
                        : 'text-[#a7b0c0] hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  selectedSubject === sub
                    ? 'bg-[#f04432] text-white shadow-sm'
                    : 'bg-[#080d1a] text-[#a7b0c0] hover:text-white border border-slate-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Catalog Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#a7b0c0]">
            <span>
              Showing <strong className="text-white">{filteredSimulations.length}</strong> simulations
            </span>
            <span className="font-mono text-[11px]">
              Live 3D Sandbox & Demonstration Models
            </span>
          </div>

          {filteredSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSimulations.map((sim) => (
                <div
                  key={sim.id}
                  className="flex flex-col justify-between p-6 bg-[#10182a] border border-slate-800 hover:border-[#4b8bff]/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Subject & Mode Tag */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-md font-mono font-semibold bg-[#4b8bff]/15 text-[#4b8bff] border border-[#4b8bff]/30">
                        {sim.subject}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          sim.isPlayableInSandbox
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {sim.isPlayableInSandbox ? '● Live 3D Sandbox' : 'Demonstration'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#4b8bff] transition-colors leading-snug">
                      {sim.title}
                    </h3>

                    <p className="text-xs text-[#a7b0c0] leading-relaxed line-clamp-3">
                      {sim.description}
                    </p>

                    {/* Key Learning Checklist */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-300 block">
                        Core Learning Objectives:
                      </span>
                      {sim.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#a7b0c0]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Action */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#a7b0c0] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{sim.durationMinutes}m</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{sim.rating}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (sim.isPlayableInSandbox && sim.associatedLabId) {
                          onLaunchSimulation(sim.associatedLabId);
                        } else {
                          setSelectedSimDetail(sim);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        sim.isPlayableInSandbox
                          ? 'bg-[#4b8bff] hover:bg-[#3d7be6] text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{sim.isPlayableInSandbox ? 'Launch in 3D' : 'View Module'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
              <p className="text-sm text-[#a7b0c0]">No simulations match your current filter query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All');
                  setSelectedDifficulty('All');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Module Overview Modal for non-sandbox catalog items */}
      {selectedSimDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#10182a] border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider">
                {selectedSimDetail.subject} · {selectedSimDetail.category}
              </span>
              <button
                onClick={() => setSelectedSimDetail(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-xl font-bold">{selectedSimDetail.title}</h3>
            <p className="text-xs text-[#a7b0c0] leading-relaxed">{selectedSimDetail.description}</p>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">Detailed Syllabus Objectives:</h4>
              <ul className="space-y-1.5 text-xs text-[#a7b0c0]">
                {selectedSimDetail.learningOutcomes.map((lo, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{lo}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-[#080d1a] border border-slate-800 rounded-xl text-xs text-[#a7b0c0]">
              <span className="text-[#f04432] font-semibold">Institutional Catalog Item:</span> This advanced module is provisioned as part of our full university laboratory license. You can experience the live interactive engine via the Physics, Chemistry, and Electronics sandboxes on the home page.
            </div>

            <button
              onClick={() => {
                setSelectedSimDetail(null);
                onLaunchSimulation('physics');
              }}
              className="w-full py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold rounded-xl text-xs transition-colors"
            >
              Launch 3D Mechanics Sandbox Instead →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
