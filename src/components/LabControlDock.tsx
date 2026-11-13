/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sliders,
  Activity,
  Zap,
  Atom,
  Target,
  Sparkles,
  TrendingUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  ChemistryParams,
  ElectronicsParams,
  LabExperimentType,
  LogicGateType,
  MoleculeType,
  PhysicsParams,
} from '../types/simulation';

interface LabControlDockProps {
  experiment: LabExperimentType;
  setExperiment: (exp: LabExperimentType) => void;
  physicsParams: PhysicsParams;
  setPhysicsParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  chemistryParams: ChemistryParams;
  setChemistryParams: React.Dispatch<React.SetStateAction<ChemistryParams>>;
  electronicsParams: ElectronicsParams;
  setElectronicsParams: React.Dispatch<React.SetStateAction<ElectronicsParams>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
  onReset: () => void;
  showTelemetry: boolean;
  setShowTelemetry: (show: boolean) => void;
  showVelocityGraph?: boolean;
  setShowVelocityGraph?: (show: boolean) => void;
  isFullscreen?: boolean;
  setIsFullscreen?: (fs: boolean) => void;
}

export const LabControlDock: React.FC<LabControlDockProps> = ({
  experiment,
  setExperiment,
  physicsParams,
  setPhysicsParams,
  chemistryParams,
  setChemistryParams,
  electronicsParams,
  setElectronicsParams,
  isPlaying,
  setIsPlaying,
  speedMultiplier,
  setSpeedMultiplier,
  onReset,
  showTelemetry,
  setShowTelemetry,
  showVelocityGraph = false,
  setShowVelocityGraph,
  isFullscreen = false,
  setIsFullscreen,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[960px] z-20 pointer-events-auto">
      {/* Collapse/Expand Toggle Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0e1626] border border-b-0 border-slate-700/80 rounded-t-lg text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-[#131c30] transition-colors shadow-lg"
          aria-label={isCollapsed ? 'Expand Control Dock' : 'Collapse Control Dock'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Lab Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      <div
        className={`bg-[#0c1322] border border-slate-700/80 rounded-xl shadow-2xl p-3 md:p-4 transition-all duration-300 ${
          isCollapsed ? 'hidden' : 'block'
        }`}
      >
        {/* Top Control Bar: Experiment Selector + Playback Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          {/* Experiment Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#141d30] border border-slate-700/60 rounded-lg">
            <button
              onClick={() => setExperiment('physics')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                experiment === 'physics'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Physics: Motion</span>
            </button>
            <button
              onClick={() => setExperiment('chemistry')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                experiment === 'chemistry'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Chemistry: 3D VSEPR</span>
            </button>
            <button
              onClick={() => setExperiment('electronics')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                experiment === 'electronics'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Electronics: Circuit</span>
            </button>
          </div>

          {/* Playback, Reset, Telemetry & Fullscreen Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Simulate'}</span>
            </button>

            {/* Prominent Reset Button with text label and tactile styling */}
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141d30] border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg text-xs font-medium transition-colors"
              title="Reset Simulation State & Time"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#f04432]" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Real-time Velocity vs Time Graph Toggle */}
            {setShowVelocityGraph && (
              <button
                onClick={() => setShowVelocityGraph(!showVelocityGraph)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  showVelocityGraph
                    ? 'bg-[#4b8bff]/20 text-[#4b8bff] border-[#4b8bff]/60 shadow-[0_0_10px_rgba(75,139,255,0.3)]'
                    : 'bg-[#141d30] text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                }`}
                title="Toggle Real-Time Velocity vs. Time Graph"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#4b8bff]" />
                <span>v-t Graph</span>
              </button>
            )}

            {/* Live Telemetry Button */}
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                showTelemetry
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-[#141d30] text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>

            {/* Speed Multipliers */}
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 bg-[#141d30] border border-slate-700/60 rounded-lg text-xs font-mono">
              {[0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-1.5 py-0.5 rounded text-[11px] ${
                    speedMultiplier === s
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Full-Screen Sandbox Toggle */}
            {setIsFullscreen && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isFullscreen
                    ? 'bg-[#f04432]/20 text-[#f04432] border-[#f04432]/50'
                    : 'bg-[#141d30] text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700/50'
                }`}
                title={isFullscreen ? 'Exit Full-Screen' : 'Full-Screen Sandbox'}
                aria-label={isFullscreen ? 'Exit Full-Screen' : 'Full-Screen Sandbox'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Experiment-Specific Parameter Controls */}
        <div className="pt-3">
          {experiment === 'physics' && (
            <div className="space-y-3">
              {/* Physics Mode Switcher */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Sub-Apparatus:</span>
                  <div className="flex items-center gap-1 bg-[#141d30] p-0.5 rounded-lg border border-slate-700/50">
                    <button
                      onClick={() => setPhysicsParams((p) => ({ ...p, subMode: 'projectile' }))}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        physicsParams.subMode === 'projectile'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Cannon Ballistics
                    </button>
                    <button
                      onClick={() => setPhysicsParams((p) => ({ ...p, subMode: 'pendulum' }))}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        physicsParams.subMode === 'pendulum'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Damped Pendulum
                    </button>
                  </div>
                </div>

                {/* Celestial Gravity Preset */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Gravity:</span>
                  {[
                    { name: 'Moon (1.6)', val: 1.62 },
                    { name: 'Earth (9.8)', val: 9.81 },
                    { name: 'Jupiter (24.8)', val: 24.79 },
                  ].map((g) => (
                    <button
                      key={g.name}
                      onClick={() => setPhysicsParams((p) => ({ ...p, gravity: g.val }))}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        Math.abs(physicsParams.gravity - g.val) < 0.1
                          ? 'bg-slate-700 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'bg-[#141d30] text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {physicsParams.subMode === 'projectile' ? (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Launch Velocity (v₀)</span>
                        <span className="font-mono text-cyan-400 font-semibold">{physicsParams.velocity} m/s</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="0.5"
                        value={physicsParams.velocity}
                        onChange={(e) =>
                          setPhysicsParams((p) => ({ ...p, velocity: parseFloat(e.target.value) }))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Elevation Angle (θ)</span>
                        <span className="font-mono text-cyan-400 font-semibold">{physicsParams.angle}°</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="85"
                        step="1"
                        value={physicsParams.angle}
                        onChange={(e) =>
                          setPhysicsParams((p) => ({ ...p, angle: parseInt(e.target.value, 10) }))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Air Drag Resistance</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {(physicsParams.airResistance * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.6"
                        step="0.05"
                        value={physicsParams.airResistance}
                        onChange={(e) =>
                          setPhysicsParams((p) => ({ ...p, airResistance: parseFloat(e.target.value) }))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Suspension Length (L)</span>
                        <span className="font-mono text-cyan-400 font-semibold">{physicsParams.pendulumLength.toFixed(2)} m</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={physicsParams.pendulumLength}
                        onChange={(e) =>
                          setPhysicsParams((p) => ({ ...p, pendulumLength: parseFloat(e.target.value) }))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Release Angle (θ₀)</span>
                        <span className="font-mono text-cyan-400 font-semibold">{physicsParams.pendulumInitialAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="45"
                        step="1"
                        value={physicsParams.pendulumInitialAngle}
                        onChange={(e) =>
                          setPhysicsParams((p) => ({ ...p, pendulumInitialAngle: parseInt(e.target.value, 10) }))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Fluid Damping Ratio</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {(physicsParams.airResistance * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.8"
                        step="0.05"
                        value={physicsParams.airResistance}
                        onChange={(e) =>
                          setPhysicsParams((p) => ({ ...p, airResistance: parseFloat(e.target.value) }))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {experiment === 'chemistry' && (
            <div className="space-y-3">
              {/* Molecule Selector Chips */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium">Select Molecule:</span>
                  {(['H2O', 'CO2', 'CH4', 'NH3', 'SF6'] as MoleculeType[]).map((mol) => (
                    <button
                      key={mol}
                      onClick={() => setChemistryParams((p) => ({ ...p, molecule: mol }))}
                      className={`px-2.5 py-1 text-xs rounded-md font-mono font-medium transition-colors ${
                        chemistryParams.molecule === mol
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-[#141d30] text-slate-300 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {mol === 'H2O'
                        ? 'H₂O'
                        : mol === 'CO2'
                          ? 'CO₂'
                          : mol === 'CH4'
                            ? 'CH₄'
                            : mol === 'NH3'
                              ? 'NH₃'
                              : 'SF₆'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chemistryParams.showDipole}
                      onChange={(e) =>
                        setChemistryParams((p) => ({ ...p, showDipole: e.target.checked }))
                      }
                      className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0"
                    />
                    <span>Net Dipole Vector</span>
                  </label>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Thermal Temp (T)</span>
                    <span className="font-mono text-cyan-400 font-semibold">{chemistryParams.temperature} K</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="700"
                    step="25"
                    value={chemistryParams.temperature}
                    onChange={(e) =>
                      setChemistryParams((p) => ({ ...p, temperature: parseInt(e.target.value, 10) }))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Vibration Rate</span>
                    <span className="font-mono text-cyan-400 font-semibold">{chemistryParams.vibrationSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={chemistryParams.vibrationSpeed}
                    onChange={(e) =>
                      setChemistryParams((p) => ({ ...p, vibrationSpeed: parseFloat(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Lone Pair Orbitals</span>
                    <span className="font-mono text-cyan-400 font-semibold">
                      {(chemistryParams.orbitalOpacity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={chemistryParams.orbitalOpacity}
                    onChange={(e) =>
                      setChemistryParams((p) => ({ ...p, orbitalOpacity: parseFloat(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {experiment === 'electronics' && (
            <div className="space-y-3">
              {/* Gate Selector + Interactive Inputs */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium">Digital IC:</span>
                  {(['AND', 'OR', 'NOT', 'NAND', 'XOR'] as LogicGateType[]).map((gate) => (
                    <button
                      key={gate}
                      onClick={() => setElectronicsParams((p) => ({ ...p, gateType: gate }))}
                      className={`px-2.5 py-1 text-xs rounded-md font-mono font-medium transition-colors ${
                        electronicsParams.gateType === gate
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-[#141d30] text-slate-300 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>

                {/* Tactile Switch Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Inputs:</span>
                  <button
                    onClick={() =>
                      setElectronicsParams((p) => ({ ...p, inputA: !p.inputA }))
                    }
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      electronicsParams.inputA
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    Switch A: {electronicsParams.inputA ? '1 (HIGH)' : '0 (LOW)'}
                  </button>

                  {electronicsParams.gateType !== 'NOT' && (
                    <button
                      onClick={() =>
                        setElectronicsParams((p) => ({ ...p, inputB: !p.inputB }))
                      }
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                        electronicsParams.inputB
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      Switch B: {electronicsParams.inputB ? '1 (HIGH)' : '0 (LOW)'}
                    </button>
                  )}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Supply Voltage (Vcc)</span>
                    <span className="font-mono text-cyan-400 font-semibold">{electronicsParams.supplyVoltage.toFixed(1)} V</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="15.0"
                    step="0.5"
                    value={electronicsParams.supplyVoltage}
                    onChange={(e) =>
                      setElectronicsParams((p) => ({ ...p, supplyVoltage: parseFloat(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Clock Pulse Frequency (f)</span>
                    <span className="font-mono text-cyan-400 font-semibold">{electronicsParams.frequency} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={electronicsParams.frequency}
                    onChange={(e) =>
                      setElectronicsParams((p) => ({ ...p, frequency: parseInt(e.target.value, 10) }))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
