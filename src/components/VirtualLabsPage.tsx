/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FlaskConical,
  Download,
  Plus,
  RotateCcw,
  Save,
  Info,
  Play,
  CheckCircle2,
  Cpu,
  Zap,
  Cog,
  Atom,
  Binary,
} from 'lucide-react';
import { LabCanvas } from './LabCanvas';
import {
  ChemistryParams,
  ElectronicsParams,
  PhysicsParams,
  TelemetryPoint,
} from '../types/simulation';
import { LabObservationRow } from '../types/lms';
import { downloadExperimentReportPDF } from '../utils/pdfGenerator';
import { usePlatform } from '../context/PlatformContext';

type LabCategoryId = 'Physics Lab' | 'Electronics Lab' | 'Electrical Lab' | 'Mechanical Lab' | 'Computer Science Lab';

interface ExperimentSpec {
  id: string;
  category: LabCategoryId;
  title: string;
  objective: string;
  theory: string;
  components: string[];
  defaultConclusion: string;
}

const LAB_CATALOG: ExperimentSpec[] = [
  {
    id: 'phy-projectile',
    category: 'Physics Lab',
    title: '3D Projectile & Pendulum Kinematics',
    objective: 'Measure horizontal range, apex altitude, and flight duration across launch angles and gravitational fields.',
    theory: 'R = (v₀² · sin 2θ) / g  |  H_max = (v₀² · sin²θ) / (2g)  |  T_pendulum = 2π √(L / g)',
    components: ['3D Ballistic Launcher', 'Laser Trajectory Grid', 'Gravitational Field Selector', 'Velocity Telemetry Sensor'],
    defaultConclusion: 'At fixed speed and g, horizontal range peaks at θ = 45°, while complementary angles (30° and 60°) yield equal range.',
  },
  {
    id: 'phy-ohms',
    category: 'Physics Lab',
    title: 'Ohm’s Law & V-I Linear Characteristic',
    objective: 'Verify the linear proportionality V = I · R across a metallic resistor and measure power dissipation P = V · I.',
    theory: 'Ohm’s Law: I = V / R (Amperes). Power dissipated as Joule heat: P = V · I = I² R (Watts).',
    components: ['0–24V Variable DC Source', 'Precision Wire-Wound Resistor', 'Digital Ammeter', 'Digital Voltmeter'],
    defaultConclusion: 'Current I increases linearly with applied voltage V when resistance R is held constant, confirming Ohmic behavior.',
  },
  {
    id: 'phy-wave',
    category: 'Physics Lab',
    title: 'Transverse Wave Propagation & Standing Oscillations',
    objective: 'Observe how wave frequency f and wavelength λ determine wave speed v = f · λ and oscillation period T = 1/f.',
    theory: 'y(x, t) = A · sin(2πx/λ - 2πft)  |  Wave Velocity: v = f · λ',
    components: ['Oscillating String Actuator', 'Stroboscopic Phase Grid', 'Amplitude & Frequency Modulator'],
    defaultConclusion: 'Increasing frequency at fixed wave speed shortens wavelength inversely, preserving v = f · λ.',
  },
  {
    id: 'ece-led',
    category: 'Electronics Lab',
    title: 'LED Current-Limiting Resistor Circuit',
    objective: 'Calculate and test the series resistor needed to keep LED forward current within safe limits (≤ 25 mA).',
    theory: 'I_LED = (V_cc - V_f) / R_series when V_cc > V_f. Operating beyond 25 mA causes thermal junction failure.',
    components: ['Variable DC Rail (1–12V)', '2.0V Indicator LED', 'Current-Limiting Resistor (100Ω–2kΩ)', 'Series Milliammeter'],
    defaultConclusion: 'A 220Ω–330Ω resistor safely limits LED current around 10–15 mA on a 5V rail without thermal over-stress.',
  },
  {
    id: 'ece-transistor',
    category: 'Electronics Lab',
    title: 'NPN BJT Transistor Switching & Current Gain',
    objective: 'Determine Cutoff, Active, and Saturation operating regions of an NPN BJT as base current I_b varies.',
    theory: 'I_c = min(β · I_b, (V_cc - V_ce_sat) / R_c). When β · I_b exceeds the collector limit, the BJT enters saturation.',
    components: ['NPN Transistor (β = 50–250)', 'Base Resistor & Collector Load R_c', '5V–12V Collector Rail'],
    defaultConclusion: 'Collector current scales linearly by β in the Active region until collector-emitter voltage drops to saturation (~0.2V).',
  },
  {
    id: 'ece-logic',
    category: 'Electronics Lab',
    title: '3D Digital Logic Gates & TTL Breadboard',
    objective: 'Construct and verify Boolean truth tables for AND, OR, NOT, NAND, and XOR gates on a 3D virtual breadboard.',
    theory: 'TTL HIGH (1) corresponds to 2.0V–5.0V and LOW (0) to 0.0V–0.8V. NAND and NOR are functionally complete universal gates.',
    components: ['830-Tie Solderless Breadboard', '74LSxx Logic IC', '5V Regulated Supply', 'Logic Probes A, B & LED'],
    defaultConclusion: 'Observed output LED states matched theoretical Boolean truth tables across all input combinations.',
  },
  {
    id: 'ee-resistors',
    category: 'Electrical Lab',
    title: 'Series & Parallel Resistor Network Analysis',
    objective: 'Compare equivalent resistance, total current, and power distribution between Series and Parallel topologies.',
    theory: 'Series: R_eq = R₁ + R₂ (current constant). Parallel: 1/R_eq = 1/R₁ + 1/R₂ (voltage constant).',
    components: ['DC Voltage Source', 'Resistor R₁ (50Ω–1kΩ)', 'Resistor R₂ (50Ω–1kΩ)', 'Topology Selector Switch'],
    defaultConclusion: 'Parallel connection reduces equivalent resistance below the smallest individual resistor, drawing greater total current.',
  },
  {
    id: 'ee-rlc',
    category: 'Electrical Lab',
    title: 'RLC Series Impedance & Resonance',
    objective: 'Measure inductive reactance X_L, capacitive reactance X_C, total impedance Z, and phase angle near resonance f₀.',
    theory: 'X_L = 2πfL  |  X_C = 1 / (2πfC)  |  Z = √(R² + (X_L - X_C)²)  |  f₀ = 1 / (2π√(LC))',
    components: ['AC Function Generator', 'Resistor R', 'Inductor L (mH)', 'Capacitor C (μF)'],
    defaultConclusion: 'At resonant frequency f₀ where X_L = X_C, total impedance reaches minimum Z = R and circuit current peaks.',
  },
  {
    id: 'mech-beam',
    category: 'Mechanical Lab',
    title: 'Cantilever Beam Bending & Deflection',
    objective: 'Analyze tip deflection δ under end-point force F across varying beam lengths and structural materials.',
    theory: 'Euler-Bernoulli End-Loaded Cantilever: δ_max = (F · L³) / (3 · E · I), where E is Young’s Modulus.',
    components: ['Clamped Cantilever Specimen', 'Calibrated Force Actuator (N)', 'Digital Dial Deflectometer'],
    defaultConclusion: 'Tip deflection scales cubically with beam length L³ and inversely with material stiffness E.',
  },
  {
    id: 'cs-sorting',
    category: 'Computer Science Lab',
    title: 'Sorting Algorithm Complexity & Step Visualizer',
    objective: 'Compare comparison counts and swap operations across Bubble Sort and Selection Sort on randomized arrays.',
    theory: 'Both Bubble Sort and Selection Sort have O(n²) worst-case time complexity, while Selection Sort minimizes array writes to O(n).',
    components: ['Array Generator (N = 8–24)', 'Comparison & Swap Telemetry Counters', 'Step Clock'],
    defaultConclusion: 'Selection Sort required significantly fewer swaps than Bubble Sort while performing ~N(N-1)/2 comparisons.',
  },
  {
    id: 'cs-vsepr',
    category: 'Computer Science Lab',
    title: '3D Molecular Geometry & Computational Rendering',
    objective: 'Inspect 3D spatial bond vectors, tetrahedral symmetry, and thermal vibration modes in real-time WebGL.',
    theory: 'VSEPR minimizes electrostatic repulsion between electron domains; lone pairs compress bond angles (e.g., 109.5° → 104.5°).',
    components: ['WebGL 3D Spatial Renderer', 'Thermal Energy Modulator (K)', 'Dipole Vector Overlay'],
    defaultConclusion: 'Symmetric geometries (CO₂, CH₄, SF₆) cancel bond dipoles while bent H₂O exhibits strong net polarity.',
  },
];

interface VirtualLabsPageProps {
  initialExperimentId?: string;
}

export const VirtualLabsPage: React.FC<VirtualLabsPageProps> = ({ initialExperimentId }) => {
  const { saveExperimentReport, currentUser } = usePlatform();

  const [selectedCategory, setSelectedCategory] = useState<LabCategoryId | 'All'>('All');
  const [activeExpId, setActiveExpId] = useState<string>(initialExperimentId || 'phy-ohms');

  useEffect(() => {
    if (initialExperimentId && LAB_CATALOG.some((e) => e.id === initialExperimentId)) {
      setActiveExpId(initialExperimentId);
      const spec = LAB_CATALOG.find((e) => e.id === initialExperimentId);
      if (spec) setSelectedCategory(spec.category);
    }
  }, [initialExperimentId]);

  const activeSpec = LAB_CATALOG.find((e) => e.id === activeExpId) || LAB_CATALOG[0];

  // Shared observation table & conclusion per experiment
  const [observations, setObservations] = useState<LabObservationRow[]>([]);
  const [conclusion, setConclusion] = useState(activeSpec.defaultConclusion);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    setObservations([]);
    setConclusion(activeSpec.defaultConclusion);
    setSavedNotice(null);
  }, [activeExpId]);

  // 3D Sandbox parameters for 3D-backed experiments
  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>({
    subMode: 'projectile',
    gravity: 9.81,
    velocity: 18,
    angle: 45,
    airResistance: 0.05,
    pendulumLength: 1.5,
    pendulumInitialAngle: 25,
    mass: 1.0,
  });
  const [chemParams, setChemParams] = useState<ChemistryParams>({
    molecule: 'H2O',
    vibrationSpeed: 1.0,
    orbitalOpacity: 0.35,
    temperature: 298,
    showDipole: true,
    showBondAngles: true,
  });
  const [elecParams, setElecParams] = useState<ElectronicsParams>({
    subMode: 'logic',
    gateType: 'AND',
    inputA: true,
    inputB: true,
    supplyVoltage: 5,
    frequency: 60,
    resistance: 1000,
    capacitance: 10,
  });
  const [telemetry3d, setTelemetry3d] = useState<TelemetryPoint | null>(null);
  const [resetSig, setResetSig] = useState(0);

  // Physics: Ohm's Law state
  const [ohmV, setOhmV] = useState(12);
  const [ohmR, setOhmR] = useState(120);

  // Physics: Wave state
  const [waveAmp, setWaveAmp] = useState(40);
  const [waveFreq, setWaveFreq] = useState(2.0);
  const [waveSpeed, setWaveSpeed] = useState(240);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Electronics: LED circuit state
  const [ledVcc, setLedVcc] = useState(5.0);
  const [ledResistor, setLedResistor] = useState(220);
  const ledVf = 2.0;

  // Electronics: NPN BJT state
  const [bjtVcc, setBjtVcc] = useState(9.0);
  const [bjtIbMicro, setBjtIbMicro] = useState(40); // uA
  const [bjtBeta, setBjtBeta] = useState(100);
  const [bjtRc, setBjtRc] = useState(1000); // Ohms

  // Electrical: Series / Parallel state
  const [resMode, setResMode] = useState<'series' | 'parallel'>('parallel');
  const [resV, setResV] = useState(12);
  const [resR1, setResR1] = useState(200);
  const [resR2, setResR2] = useState(300);

  // Electrical: RLC state
  const [rlcFreq, setRlcFreq] = useState(160);
  const [rlcR, setRlcR] = useState(50);
  const [rlcL_mH, setRlcL_mH] = useState(100);
  const [rlcC_uF, setRlcC_uF] = useState(10);

  // Mechanical: Cantilever Beam state
  const [beamForce, setBeamForce] = useState(500); // N
  const [beamLength, setBeamLength] = useState(2.0); // m
  const [beamMaterial, setBeamMaterial] = useState<'Steel' | 'Aluminum' | 'Timber'>('Steel');
  const beamCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // CS: Sorting state
  const [sortAlgo, setSortAlgo] = useState<'bubble' | 'selection'>('bubble');
  const [sortArray, setSortArray] = useState<number[]>([64, 25, 82, 14, 48, 91, 33, 57, 19, 73]);
  const [sortRunning, setSortRunning] = useState(false);
  const [sortActivePair, setSortActivePair] = useState<number[]>([]);
  const [sortMetrics, setSortMetrics] = useState({ comparisons: 0, swaps: 0 });
  const sortCancelRef = useRef(false);

  // Wave animation loop
  useEffect(() => {
    if (activeExpId !== 'phy-wave') return;
    let animId = 0;
    let t = 0;
    const draw = () => {
      const canvas = waveCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = '#080d1a';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();

          // Wave curve
          const wavelengthPx = Math.max(40, waveSpeed / Math.max(0.5, waveFreq));
          ctx.strokeStyle = '#4b8bff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 3) {
            const y =
              h / 2 -
              waveAmp * Math.sin((2 * Math.PI * x) / wavelengthPx - 2 * Math.PI * waveFreq * t);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [activeExpId, waveAmp, waveFreq, waveSpeed]);

  // Cantilever beam canvas draw
  const youngModulusGPa = beamMaterial === 'Steel' ? 200 : beamMaterial === 'Aluminum' ? 69 : 11;
  const momentI = 8.33e-6; // m^4 rectangular section
  const tipDeflectionMm =
    ((beamForce * Math.pow(beamLength, 3)) / (3 * (youngModulusGPa * 1e9) * momentI)) * 1000;

  useEffect(() => {
    if (activeExpId !== 'mech-beam') return;
    const canvas = beamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, w, h);

    // Wall anchor
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(28, 36, 26, h - 72);

    const startX = 54;
    const beamPx = (beamLength / 3.5) * (w - 130);
    const visualDeflect = Math.min(85, tipDeflectionMm * 1.4);

    // Neutral reference line
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, 90);
    ctx.lineTo(startX + beamPx, 90);
    ctx.stroke();
    ctx.setLineDash([]);

    // Deflected beam
    ctx.strokeStyle = '#4b8bff';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const x = startX + u * beamPx;
      const y = 90 + visualDeflect * (0.5 * (3 * u * u - u * u * u));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Force arrow
    const endX = startX + beamPx;
    const endY = 90 + visualDeflect;
    ctx.strokeStyle = '#f04432';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(endX, endY - 40);
    ctx.lineTo(endX, endY - 6);
    ctx.stroke();
    ctx.fillStyle = '#f04432';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`F = ${beamForce} N`, endX - 36, endY - 46);
    ctx.fillStyle = '#34d399';
    ctx.fillText(`δ = ${tipDeflectionMm.toFixed(2)} mm`, endX - 45, endY + 24);
  }, [activeExpId, beamForce, beamLength, beamMaterial, tipDeflectionMm]);

  // Sorting Runner
  const runSortAnimation = async () => {
    if (sortRunning) return;
    sortCancelRef.current = false;
    setSortRunning(true);
    const arr = [...sortArray];
    let comps = 0;
    let swaps = 0;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    if (sortAlgo === 'bubble') {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (sortCancelRef.current) return;
          comps++;
          setSortActivePair([j, j + 1]);
          setSortMetrics({ comparisons: comps, swaps });
          await sleep(110);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swaps++;
            setSortArray([...arr]);
            setSortMetrics({ comparisons: comps, swaps });
          }
        }
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (sortCancelRef.current) return;
          comps++;
          setSortActivePair([minIdx, j]);
          setSortMetrics({ comparisons: comps, swaps });
          await sleep(110);
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          swaps++;
          setSortArray([...arr]);
          setSortMetrics({ comparisons: comps, swaps });
        }
      }
    }
    setSortActivePair([]);
    setSortRunning(false);
  };

  // Compute active experiment snapshot for Observation Table & Report
  const currentSnapshot = useMemo(
    (): {
      inputs: Record<string, string | number>;
      outputs: Record<string, string | number>;
    } => {
    switch (activeExpId) {
      case 'phy-projectile':
        return {
          inputs: {
            v0_ms: physicsParams.velocity,
            angle_deg: physicsParams.angle,
            g_ms2: physicsParams.gravity,
          },
          outputs: {
            range_m: Number(
              (
                (Math.pow(physicsParams.velocity, 2) *
                  Math.sin((2 * physicsParams.angle * Math.PI) / 180)) /
                physicsParams.gravity
              ).toFixed(2)
            ),
            live_alt_m: Number((telemetry3d?.val1 ?? 0).toFixed(2)),
          },
        };
      case 'phy-ohms': {
        const I = ohmV / ohmR;
        return {
          inputs: { V_volts: ohmV, R_ohms: ohmR },
          outputs: {
            I_mA: Number((I * 1000).toFixed(2)),
            P_watts: Number((ohmV * I).toFixed(3)),
          },
        };
      }
      case 'phy-wave':
        return {
          inputs: { A_px: waveAmp, f_Hz: waveFreq, v_px_s: waveSpeed },
          outputs: {
            wavelength: Number((waveSpeed / waveFreq).toFixed(2)),
            period_s: Number((1 / waveFreq).toFixed(3)),
          },
        };
      case 'ece-led': {
        const currMa = ledVcc > ledVf ? ((ledVcc - ledVf) / ledResistor) * 1000 : 0;
        return {
          inputs: { Vcc_V: ledVcc, R_ohms: ledResistor },
          outputs: {
            I_LED_mA: Number(currMa.toFixed(2)),
            status: currMa === 0 ? 'OFF' : currMa > 25 ? 'OVER-CURRENT' : 'SAFE',
          },
        };
      }
      case 'ece-transistor': {
        const maxIcMa = ((bjtVcc - 0.2) / bjtRc) * 1000;
        const calcIcMa = (bjtBeta * bjtIbMicro) / 1000;
        const actualIcMa = Math.min(maxIcMa, calcIcMa);
        const region = bjtIbMicro === 0 ? 'Cutoff' : calcIcMa >= maxIcMa ? 'Saturation' : 'Active';
        return {
          inputs: { Ib_uA: bjtIbMicro, Beta: bjtBeta, Rc_ohm: bjtRc },
          outputs: { Ic_mA: Number(actualIcMa.toFixed(2)), Region: region },
        };
      }
      case 'ece-logic':
        return {
          inputs: {
            Gate: elecParams.gateType,
            A: elecParams.inputA ? 1 : 0,
            B: elecParams.inputB ? 1 : 0,
          },
          outputs: { Out_V: Number((telemetry3d?.val1 ?? 0).toFixed(2)) },
        };
      case 'ee-resistors': {
        const req =
          resMode === 'series' ? resR1 + resR2 : (resR1 * resR2) / (resR1 + resR2);
        const itot = resV / req;
        return {
          inputs: { Mode: resMode, V_volts: resV, R1: resR1, R2: resR2 },
          outputs: {
            Req_ohms: Number(req.toFixed(2)),
            Itotal_mA: Number((itot * 1000).toFixed(2)),
            Power_W: Number((resV * itot).toFixed(3)),
          },
        };
      }
      case 'ee-rlc': {
        const L = rlcL_mH / 1000;
        const C = rlcC_uF / 1e6;
        const xl = 2 * Math.PI * rlcFreq * L;
        const xc = 1 / (2 * Math.PI * rlcFreq * C);
        const z = Math.sqrt(rlcR * rlcR + Math.pow(xl - xc, 2));
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        return {
          inputs: { Freq_Hz: rlcFreq, R_ohm: rlcR, L_mH: rlcL_mH, C_uF: rlcC_uF },
          outputs: {
            Impedance_Z: Number(z.toFixed(2)),
            Resonant_f0_Hz: Number(f0.toFixed(1)),
          },
        };
      }
      case 'mech-beam':
        return {
          inputs: { Load_N: beamForce, Length_m: beamLength, Material: beamMaterial },
          outputs: {
            Deflection_mm: Number(tipDeflectionMm.toFixed(2)),
            E_GPa: youngModulusGPa,
          },
        };
      case 'cs-sorting':
        return {
          inputs: { Algorithm: sortAlgo, ArraySize: sortArray.length },
          outputs: { Comparisons: sortMetrics.comparisons, Swaps: sortMetrics.swaps },
        };
      default:
        return {
          inputs: { Molecule: chemParams.molecule, Temp_K: chemParams.temperature },
          outputs: { BondEnergy_kJ: Number((telemetry3d?.val1 ?? 464).toFixed(1)) },
        };
    }
  }, [
    activeExpId,
    physicsParams,
    telemetry3d,
    ohmV,
    ohmR,
    waveAmp,
    waveFreq,
    waveSpeed,
    ledVcc,
    ledResistor,
    bjtVcc,
    bjtIbMicro,
    bjtBeta,
    bjtRc,
    elecParams,
    resMode,
    resV,
    resR1,
    resR2,
    rlcFreq,
    rlcR,
    rlcL_mH,
    rlcC_uF,
    beamForce,
    beamLength,
    beamMaterial,
    tipDeflectionMm,
    youngModulusGPa,
    sortAlgo,
    sortArray.length,
    sortMetrics,
    chemParams,
  ]);

  const handleRecordObservation = () => {
    setObservations((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        inputs: currentSnapshot.inputs,
        outputs: currentSnapshot.outputs,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSaveReport = async () => {
    try {
      await saveExperimentReport({
        category: activeSpec.category,
        title: activeSpec.title,
        objective: activeSpec.objective,
        parameters: currentSnapshot.inputs,
        observations,
        conclusion,
        isSimulated: true,
        isPublic: false,
      });
      setSavedNotice('Lab observation report saved to your profile.');
      setTimeout(() => setSavedNotice(null), 3000);
    } catch (err) {
      setSavedNotice(err instanceof Error ? err.message : 'Unable to save report.');
    }
  };

  const categories: (LabCategoryId | 'All')[] = [
    'All',
    'Physics Lab',
    'Electronics Lab',
    'Electrical Lab',
    'Mechanical Lab',
    'Computer Science Lab',
  ];

  const categoryIcon = (cat: LabCategoryId) => {
    switch (cat) {
      case 'Physics Lab':
        return <Atom className="w-3.5 h-3.5 text-[#4b8bff]" />;
      case 'Electronics Lab':
        return <Cpu className="w-3.5 h-3.5 text-[#f04432]" />;
      case 'Electrical Lab':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Mechanical Lab':
        return <Cog className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Binary className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const visibleCatalog = LAB_CATALOG.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="py-10 md:py-14 bg-[#080d1a] text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header & Simulated Model Transparency Notice */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10182a] border border-emerald-500/40 rounded-full text-xs font-semibold text-emerald-400">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>TRINETRA Virtual STEM Laboratory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Interactive Virtual Laboratories
            </h1>
            <p className="text-xs sm:text-sm text-[#a7b0c0] max-w-2xl">
              Conduct structured experiments across Physics, Electronics, Electrical, Mechanical, and Computer Science. Adjust real parameters, record trial observations, and export formatted PDF lab reports.
            </p>
          </div>

          <div className="p-3 bg-[#10182a] border border-cyan-500/30 rounded-xl flex items-start gap-2.5 text-[11px] text-cyan-200 max-w-sm">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Simulated Model Notice:</strong> All experiments run deterministic mathematical & 3D physics models in your browser—not physical laboratory hardware.
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4b8bff] border-[#4b8bff] text-white'
                  : 'bg-[#10182a] border-slate-800 text-[#a7b0c0] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main 2-Column Lab Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Experiment Selector */}
          <aside className="lg:col-span-3 space-y-2 bg-[#10182a] border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] font-mono text-[#a7b0c0] px-2 uppercase block mb-2">
              Experiments ({visibleCatalog.length})
            </span>
            {visibleCatalog.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setActiveExpId(exp.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 cursor-pointer ${
                  exp.id === activeExpId
                    ? 'bg-[#4b8bff]/15 border-[#4b8bff] text-white'
                    : 'bg-[#080d1a] border-slate-800/80 text-[#a7b0c0] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {categoryIcon(exp.category)}
                  <span>{exp.category}</span>
                </div>
                <div className="text-xs font-bold leading-snug">{exp.title}</div>
              </button>
            ))}
          </aside>

          {/* Right Active Workbench */}
          <div className="lg:col-span-9 space-y-6">
            {/* Theory & Objective Card */}
            <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-[#f04432] uppercase">
                    {activeSpec.category} · Simulated Model
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-0.5">{activeSpec.title}</h2>
                </div>
                <button
                  onClick={() =>
                    downloadExperimentReportPDF({
                      title: activeSpec.title,
                      category: activeSpec.category,
                      objective: activeSpec.objective,
                      theory: activeSpec.theory,
                      components: activeSpec.components,
                      parameters: currentSnapshot.inputs,
                      observations,
                      conclusion,
                    })
                  }
                  className="px-4 py-2 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#080d1a] border border-slate-800 rounded-xl space-y-1">
                  <span className="font-bold text-white block">Objective</span>
                  <p className="text-[#a7b0c0] leading-relaxed">{activeSpec.objective}</p>
                </div>
                <div className="p-3.5 bg-[#080d1a] border border-slate-800 rounded-xl space-y-1">
                  <span className="font-bold text-white block">Theory & Governing Equations</span>
                  <p className="text-cyan-300 font-mono text-[11px] leading-relaxed">
                    {activeSpec.theory}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-[#a7b0c0] font-semibold">Components:</span>
                {activeSpec.components.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#080d1a] border border-slate-800 rounded-lg text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Simulation Stage */}
            <div className="p-5 sm:p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-5">
              {/* 3D Three.js Experiments */}
              {(activeExpId === 'phy-projectile' ||
                activeExpId === 'ece-logic' ||
                activeExpId === 'cs-vsepr') && (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#080d1a]">
                    <LabCanvas
                      experiment={
                        activeExpId === 'phy-projectile'
                          ? 'physics'
                          : activeExpId === 'ece-logic'
                            ? 'electronics'
                            : 'chemistry'
                      }
                      physicsParams={physicsParams}
                      chemistryParams={chemParams}
                      electronicsParams={elecParams}
                      isPlaying={true}
                      speedMultiplier={1}
                      onTelemetryUpdate={setTelemetry3d}
                      resetSignal={resetSig}
                    />
                  </div>

                  {activeExpId === 'phy-projectile' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#080d1a] p-4 rounded-xl border border-slate-800 text-xs">
                      <label className="space-y-1">
                        <span className="text-[#a7b0c0]">Initial Speed: {physicsParams.velocity} m/s</span>
                        <input
                          type="range"
                          min={5}
                          max={35}
                          value={physicsParams.velocity}
                          onChange={(e) =>
                            setPhysicsParams((p) => ({ ...p, velocity: Number(e.target.value) }))
                          }
                          className="w-full accent-[#4b8bff]"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[#a7b0c0]">Launch Angle: {physicsParams.angle}°</span>
                        <input
                          type="range"
                          min={10}
                          max={85}
                          value={physicsParams.angle}
                          onChange={(e) =>
                            setPhysicsParams((p) => ({ ...p, angle: Number(e.target.value) }))
                          }
                          className="w-full accent-[#f04432]"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[#a7b0c0]">Gravity: {physicsParams.gravity} m/s²</span>
                        <select
                          value={physicsParams.gravity}
                          onChange={(e) =>
                            setPhysicsParams((p) => ({ ...p, gravity: Number(e.target.value) }))
                          }
                          className="w-full px-2 py-1.5 bg-[#10182a] border border-slate-700 rounded-lg text-white"
                        >
                          <option value={9.81}>Earth (9.81 m/s²)</option>
                          <option value={1.62}>Moon (1.62 m/s²)</option>
                          <option value={24.79}>Jupiter (24.79 m/s²)</option>
                        </select>
                      </label>
                    </div>
                  )}

                  {activeExpId === 'ece-logic' && (
                    <div className="flex flex-wrap items-center gap-4 bg-[#080d1a] p-4 rounded-xl border border-slate-800 text-xs">
                      <select
                        value={elecParams.gateType}
                        onChange={(e) =>
                          setElecParams((p) => ({
                            ...p,
                            gateType: e.target.value as ElectronicsParams['gateType'],
                          }))
                        }
                        className="px-3 py-2 bg-[#10182a] border border-slate-700 rounded-lg text-white font-mono"
                      >
                        <option value="AND">AND (SN7408)</option>
                        <option value="OR">OR (SN7432)</option>
                        <option value="NOT">NOT (SN7404)</option>
                        <option value="NAND">NAND (SN7400)</option>
                        <option value="XOR">XOR (SN7486)</option>
                      </select>
                      <button
                        onClick={() => setElecParams((p) => ({ ...p, inputA: !p.inputA }))}
                        className={`px-3 py-2 rounded-lg font-mono font-bold cursor-pointer ${
                          elecParams.inputA ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Input A: {elecParams.inputA ? '1 (HIGH)' : '0 (LOW)'}
                      </button>
                      <button
                        onClick={() => setElecParams((p) => ({ ...p, inputB: !p.inputB }))}
                        className={`px-3 py-2 rounded-lg font-mono font-bold cursor-pointer ${
                          elecParams.inputB ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Input B: {elecParams.inputB ? '1 (HIGH)' : '0 (LOW)'}
                      </button>
                      <button
                        onClick={() => setResetSig((s) => s + 1)}
                        className="px-3 py-2 bg-[#10182a] border border-slate-700 rounded-lg text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>
                  )}

                  {activeExpId === 'cs-vsepr' && (
                    <div className="flex flex-wrap items-center gap-4 bg-[#080d1a] p-4 rounded-xl border border-slate-800 text-xs">
                      <select
                        value={chemParams.molecule}
                        onChange={(e) =>
                          setChemParams((p) => ({
                            ...p,
                            molecule: e.target.value as ChemistryParams['molecule'],
                          }))
                        }
                        className="px-3 py-2 bg-[#10182a] border border-slate-700 rounded-lg text-white font-mono"
                      >
                        <option value="H2O">H₂O (Bent 104.5°)</option>
                        <option value="CO2">CO₂ (Linear 180°)</option>
                        <option value="CH4">CH₄ (Tetrahedral 109.5°)</option>
                        <option value="NH3">NH₃ (Pyramidal 107°)</option>
                        <option value="SF6">SF₆ (Octahedral 90°)</option>
                      </select>
                      <label className="flex items-center gap-2 text-[#a7b0c0]">
                        <span>Temp: {chemParams.temperature}K</span>
                        <input
                          type="range"
                          min={100}
                          max={800}
                          value={chemParams.temperature}
                          onChange={(e) =>
                            setChemParams((p) => ({ ...p, temperature: Number(e.target.value) }))
                          }
                          className="accent-[#f04432]"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Ohm's Law Interactive Workbench */}
              {activeExpId === 'phy-ohms' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="p-5 bg-[#080d1a] border border-slate-800 rounded-xl space-y-4">
                    <label className="block space-y-1 text-xs">
                      <span className="text-[#a7b0c0]">Source Voltage V: <strong className="text-white">{ohmV} V</strong></span>
                      <input
                        type="range"
                        min={1}
                        max={24}
                        step={0.5}
                        value={ohmV}
                        onChange={(e) => setOhmV(Number(e.target.value))}
                        className="w-full accent-[#4b8bff]"
                      />
                    </label>
                    <label className="block space-y-1 text-xs">
                      <span className="text-[#a7b0c0]">Resistance R: <strong className="text-white">{ohmR} Ω</strong></span>
                      <input
                        type="range"
                        min={10}
                        max={1000}
                        step={10}
                        value={ohmR}
                        onChange={(e) => setOhmR(Number(e.target.value))}
                        className="w-full accent-[#f04432]"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-[#10182a] rounded-xl border border-slate-800">
                        <span className="text-[11px] text-[#a7b0c0] block">Current (I = V/R)</span>
                        <span className="text-lg font-mono font-bold text-cyan-400">
                          {((ohmV / ohmR) * 1000).toFixed(2)} mA
                        </span>
                      </div>
                      <div className="p-3 bg-[#10182a] rounded-xl border border-slate-800">
                        <span className="text-[11px] text-[#a7b0c0] block">Power (P = V·I)</span>
                        <span className="text-lg font-mono font-bold text-emerald-400">
                          {((ohmV * ohmV) / ohmR).toFixed(3)} W
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Interactive SVG V-I Linear Plot */}
                  <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl">
                    <span className="text-[11px] font-mono text-[#a7b0c0] block mb-2">
                      V–I Characteristic Curve (Slope = 1/R)
                    </span>
                    <svg viewBox="0 0 280 180" className="w-full h-44">
                      <line x1="32" y1="150" x2="265" y2="150" stroke="#334155" strokeWidth="1.5" />
                      <line x1="32" y1="15" x2="32" y2="150" stroke="#334155" strokeWidth="1.5" />
                      <line
                        x1="32"
                        y1="150"
                        x2="255"
                        y2={Math.max(20, 150 - (24 / ohmR) * 180)}
                        stroke="#4b8bff"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx={32 + (ohmV / 24) * 223}
                        cy={Math.max(20, 150 - (ohmV / ohmR) * 180)}
                        r="5"
                        fill="#f04432"
                      />
                      <text x="125" y="170" fill="#94a3b8" fontSize="10">Voltage V (0–24V)</text>
                      <text x="6" y="85" fill="#94a3b8" fontSize="10" transform="rotate(-90 12 85)">Current I</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Transverse Wave Lab */}
              {activeExpId === 'phy-wave' && (
                <div className="space-y-4">
                  <canvas
                    ref={waveCanvasRef}
                    width={640}
                    height={200}
                    className="w-full h-48 rounded-xl border border-slate-800"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#080d1a] p-4 rounded-xl border border-slate-800 text-xs">
                    <label className="space-y-1">
                      <span>Amplitude: {waveAmp} px</span>
                      <input type="range" min={10} max={75} value={waveAmp} onChange={(e) => setWaveAmp(Number(e.target.value))} className="w-full accent-[#4b8bff]" />
                    </label>
                    <label className="space-y-1">
                      <span>Frequency f: {waveFreq} Hz</span>
                      <input type="range" min={0.5} max={5} step={0.25} value={waveFreq} onChange={(e) => setWaveFreq(Number(e.target.value))} className="w-full accent-[#f04432]" />
                    </label>
                    <label className="space-y-1">
                      <span>Wave Speed v: {waveSpeed} px/s</span>
                      <input type="range" min={120} max={420} step={20} value={waveSpeed} onChange={(e) => setWaveSpeed(Number(e.target.value))} className="w-full accent-emerald-400" />
                    </label>
                  </div>
                </div>
              )}

              {/* LED Current-Limiting Circuit */}
              {activeExpId === 'ece-led' && (() => {
                const iLedMa = ledVcc > ledVf ? ((ledVcc - ledVf) / ledResistor) * 1000 : 0;
                const overCurrent = iLedMa > 25;
                const lit = iLedMa >= 1;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="p-5 bg-[#080d1a] border border-slate-800 rounded-xl space-y-4 text-xs">
                      <label className="block space-y-1">
                        <span>Supply Voltage Vcc: <strong>{ledVcc.toFixed(1)} V</strong></span>
                        <input type="range" min={1} max={12} step={0.5} value={ledVcc} onChange={(e) => setLedVcc(Number(e.target.value))} className="w-full accent-[#4b8bff]" />
                      </label>
                      <label className="block space-y-1">
                        <span>Series Resistor R: <strong>{ledResistor} Ω</strong></span>
                        <input type="range" min={47} max={1500} step={10} value={ledResistor} onChange={(e) => setLedResistor(Number(e.target.value))} className="w-full accent-[#f04432]" />
                      </label>
                      <div className={`p-3 rounded-xl border font-mono ${overCurrent ? 'bg-rose-950/50 border-[#f04432] text-rose-200' : lit ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-[#10182a] border-slate-800 text-slate-400'}`}>
                        I_LED = {iLedMa.toFixed(2)} mA · {overCurrent ? 'THERMAL OVER-CURRENT WARNING (>25 mA)' : lit ? 'SAFE FORWARD CONDUCTION' : 'BELOW 2.0V THRESHOLD'}
                      </div>
                    </div>
                    <div className="p-6 bg-[#080d1a] border border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-3">
                      <div
                        className="w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all"
                        style={{
                          borderColor: overCurrent ? '#f04432' : lit ? '#34d399' : '#334155',
                          backgroundColor: overCurrent ? 'rgba(240,68,50,0.45)' : lit ? `rgba(52,211,153,${Math.min(0.8, iLedMa / 25)})` : '#0f172a',
                          boxShadow: lit ? `0 0 ${Math.min(40, iLedMa * 1.5)}px ${overCurrent ? '#f04432' : '#34d399'}` : 'none',
                        }}
                      >
                        <span className="font-mono text-xs font-bold">{iLedMa.toFixed(1)}mA</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#a7b0c0]">Simulated LED Junction Luminosity</span>
                    </div>
                  </div>
                );
              })()}

              {/* NPN BJT Transistor */}
              {activeExpId === 'ece-transistor' && (() => {
                const maxIc = ((bjtVcc - 0.2) / bjtRc) * 1000;
                const rawIc = (bjtBeta * bjtIbMicro) / 1000;
                const actualIc = Math.min(maxIc, rawIc);
                const vce = Math.max(0.2, bjtVcc - (actualIc / 1000) * bjtRc);
                const region = bjtIbMicro === 0 ? 'Cutoff' : rawIc >= maxIc ? 'Saturation' : 'Active Amplification';
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#080d1a] p-5 rounded-xl border border-slate-800 text-xs">
                    <div className="space-y-3">
                      <label className="block">Base Current Ib: <strong>{bjtIbMicro} μA</strong>
                        <input type="range" min={0} max={200} step={5} value={bjtIbMicro} onChange={(e) => setBjtIbMicro(Number(e.target.value))} className="w-full accent-[#4b8bff]" />
                      </label>
                      <label className="block">Current Gain β: <strong>{bjtBeta}</strong>
                        <input type="range" min={50} max={250} step={10} value={bjtBeta} onChange={(e) => setBjtBeta(Number(e.target.value))} className="w-full accent-[#f04432]" />
                      </label>
                      <label className="block">Collector Resistor Rc: <strong>{bjtRc} Ω</strong>
                        <input type="range" min={220} max={2200} step={20} value={bjtRc} onChange={(e) => setBjtRc(Number(e.target.value))} className="w-full accent-emerald-400" />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#10182a] rounded-xl border border-slate-800">
                        <span className="text-[#a7b0c0] block">Collector Current Ic</span>
                        <strong className="text-lg font-mono text-cyan-400">{actualIc.toFixed(2)} mA</strong>
                      </div>
                      <div className="p-3 bg-[#10182a] rounded-xl border border-slate-800">
                        <span className="text-[#a7b0c0] block">V_ce Output</span>
                        <strong className="text-lg font-mono text-white">{vce.toFixed(2)} V</strong>
                      </div>
                      <div className="col-span-2 p-3 bg-[#10182a] rounded-xl border border-[#4b8bff]/40">
                        <span className="text-[#a7b0c0] block">Operating Region</span>
                        <strong className="text-sm font-mono text-[#4b8bff]">{region}</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Series / Parallel Resistors */}
              {activeExpId === 'ee-resistors' && (() => {
                const req = resMode === 'series' ? resR1 + resR2 : (resR1 * resR2) / (resR1 + resR2);
                const itot = resV / req;
                return (
                  <div className="space-y-4 bg-[#080d1a] p-5 rounded-xl border border-slate-800 text-xs">
                    <div className="flex gap-2">
                      <button onClick={() => setResMode('series')} className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${resMode === 'series' ? 'bg-[#4b8bff] text-white' : 'bg-[#10182a] text-[#a7b0c0]'}`}>Series Topology</button>
                      <button onClick={() => setResMode('parallel')} className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${resMode === 'parallel' ? 'bg-[#4b8bff] text-white' : 'bg-[#10182a] text-[#a7b0c0]'}`}>Parallel Topology</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label>Supply V: <strong>{resV}V</strong><input type="range" min={1} max={24} value={resV} onChange={(e) => setResV(Number(e.target.value))} className="w-full accent-[#4b8bff]" /></label>
                      <label>R1: <strong>{resR1}Ω</strong><input type="range" min={50} max={1000} step={25} value={resR1} onChange={(e) => setResR1(Number(e.target.value))} className="w-full accent-[#f04432]" /></label>
                      <label>R2: <strong>{resR2}Ω</strong><input type="range" min={50} max={1000} step={25} value={resR2} onChange={(e) => setResR2(Number(e.target.value))} className="w-full accent-emerald-400" /></label>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">R_eq</span><strong className="text-base font-mono text-white">{req.toFixed(1)} Ω</strong></div>
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">I_total</span><strong className="text-base font-mono text-cyan-400">{(itot * 1000).toFixed(1)} mA</strong></div>
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">Total Power</span><strong className="text-base font-mono text-emerald-400">{(resV * itot).toFixed(2)} W</strong></div>
                    </div>
                  </div>
                );
              })()}

              {/* RLC Resonance */}
              {activeExpId === 'ee-rlc' && (() => {
                const L = rlcL_mH / 1000;
                const C = rlcC_uF / 1e6;
                const xl = 2 * Math.PI * rlcFreq * L;
                const xc = 1 / (2 * Math.PI * rlcFreq * C);
                const z = Math.sqrt(rlcR * rlcR + Math.pow(xl - xc, 2));
                const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
                return (
                  <div className="space-y-4 bg-[#080d1a] p-5 rounded-xl border border-slate-800 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <label>Freq f: <strong>{rlcFreq} Hz</strong><input type="range" min={20} max={500} step={5} value={rlcFreq} onChange={(e) => setRlcFreq(Number(e.target.value))} className="w-full accent-[#4b8bff]" /></label>
                      <label>R: <strong>{rlcR} Ω</strong><input type="range" min={10} max={300} step={10} value={rlcR} onChange={(e) => setRlcR(Number(e.target.value))} className="w-full accent-[#f04432]" /></label>
                      <label>L: <strong>{rlcL_mH} mH</strong><input type="range" min={20} max={300} step={10} value={rlcL_mH} onChange={(e) => setRlcL_mH(Number(e.target.value))} className="w-full accent-emerald-400" /></label>
                      <label>C: <strong>{rlcC_uF} μF</strong><input type="range" min={2} max={50} step={2} value={rlcC_uF} onChange={(e) => setRlcC_uF(Number(e.target.value))} className="w-full accent-amber-400" /></label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">X_L</span><strong className="text-white">{xl.toFixed(1)} Ω</strong></div>
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">X_C</span><strong className="text-white">{xc.toFixed(1)} Ω</strong></div>
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">Impedance Z</span><strong className="text-cyan-400">{z.toFixed(1)} Ω</strong></div>
                      <div className="p-3 bg-[#10182a] rounded-xl"><span className="text-[#a7b0c0] block">Resonance f₀</span><strong className="text-emerald-400">{f0.toFixed(1)} Hz</strong></div>
                    </div>
                  </div>
                );
              })()}

              {/* Mechanical: Cantilever Beam */}
              {activeExpId === 'mech-beam' && (
                <div className="space-y-4">
                  <canvas ref={beamCanvasRef} width={640} height={210} className="w-full h-52 rounded-xl border border-slate-800" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#080d1a] p-4 rounded-xl border border-slate-800 text-xs">
                    <label>Point Load F: <strong>{beamForce} N</strong><input type="range" min={50} max={2500} step={50} value={beamForce} onChange={(e) => setBeamForce(Number(e.target.value))} className="w-full accent-[#f04432]" /></label>
                    <label>Beam Length L: <strong>{beamLength.toFixed(1)} m</strong><input type="range" min={0.5} max={3.5} step={0.1} value={beamLength} onChange={(e) => setBeamLength(Number(e.target.value))} className="w-full accent-[#4b8bff]" /></label>
                    <label>Material
                      <select value={beamMaterial} onChange={(e) => setBeamMaterial(e.target.value as 'Steel' | 'Aluminum' | 'Timber')} className="w-full mt-1 px-2 py-1.5 bg-[#10182a] border border-slate-700 rounded-lg text-white">
                        <option value="Steel">Structural Steel (200 GPa)</option>
                        <option value="Aluminum">Aluminum Alloy (69 GPa)</option>
                        <option value="Timber">Seasoned Timber (11 GPa)</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {/* CS: Sorting Algorithm */}
              {activeExpId === 'cs-sorting' && (
                <div className="space-y-4 bg-[#080d1a] p-5 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <select value={sortAlgo} onChange={(e) => setSortAlgo(e.target.value as 'bubble' | 'selection')} disabled={sortRunning} className="px-3 py-1.5 bg-[#10182a] border border-slate-700 rounded-lg text-white">
                        <option value="bubble">Bubble Sort O(n²)</option>
                        <option value="selection">Selection Sort O(n²)</option>
                      </select>
                      <button onClick={runSortAnimation} disabled={sortRunning} className="px-4 py-1.5 bg-[#4b8bff] hover:bg-[#3d7be6] disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer">
                        <Play className="w-3.5 h-3.5" /> Run Sort
                      </button>
                      <button
                        onClick={() => {
                          sortCancelRef.current = true;
                          setSortRunning(false);
                          setSortActivePair([]);
                          setSortMetrics({ comparisons: 0, swaps: 0 });
                          setSortArray(Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 12));
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
                      >
                        Shuffle Array
                      </button>
                    </div>
                    <div className="font-mono text-cyan-400">
                      Comparisons: <strong>{sortMetrics.comparisons}</strong> · Swaps: <strong>{sortMetrics.swaps}</strong>
                    </div>
                  </div>
                  <div className="h-44 flex items-end justify-center gap-2 pt-4">
                    {sortArray.map((val, idx) => {
                      const active = sortActivePair.includes(idx);
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[44px]">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-150 ${active ? 'bg-[#f04432]' : 'bg-[#4b8bff]'}`}
                            style={{ height: `${val * 1.4}px` }}
                          />
                          <span className="text-[10px] font-mono text-slate-300">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Record Observation Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="text-xs font-mono text-[#a7b0c0]">
                  Live Output:{' '}
                  <strong className="text-emerald-400">
                    {Object.entries(currentSnapshot.outputs)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join('  |  ')}
                  </strong>
                </div>
                <button
                  onClick={handleRecordObservation}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Trial to Observation Table</span>
                </button>
              </div>
            </div>

            {/* Observation Table & Conclusion */}
            <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">Observation Table ({observations.length} Trials)</h3>
                <div className="flex items-center gap-2">
                  {savedNotice && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {savedNotice}
                    </span>
                  )}
                  <button
                    onClick={handleSaveReport}
                    className="px-3.5 py-1.5 bg-[#080d1a] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#4b8bff]" />
                    <span>{currentUser ? 'Save Lab Log' : 'Save Locally'}</span>
                  </button>
                </div>
              </div>

              {observations.length === 0 ? (
                <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl text-xs text-[#a7b0c0]">
                  Adjust the controls above and click <strong>Record Trial to Observation Table</strong> to log measurements.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[#a7b0c0]">
                        <th className="py-2 pr-4">Trial</th>
                        <th className="py-2 pr-4">Inputs</th>
                        <th className="py-2 pr-4">Measured Outputs</th>
                        <th className="py-2">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {observations.map((row) => (
                        <tr key={row.trial}>
                          <td className="py-2 pr-4 text-white font-bold">#{row.trial}</td>
                          <td className="py-2 pr-4 text-slate-300">
                            {Object.entries(row.inputs).map(([k, v]) => `${k}=${v}`).join(', ')}
                          </td>
                          <td className="py-2 pr-4 text-emerald-400">
                            {Object.entries(row.outputs).map(([k, v]) => `${k}=${v}`).join(', ')}
                          </td>
                          <td className="py-2 text-slate-500">{row.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-white block">Experimental Conclusion</label>
                <textarea
                  rows={2}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full p-3 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#4b8bff]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
