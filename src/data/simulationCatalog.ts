/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CatalogSimulation } from '../types/simulation';

export const SIMULATION_CATALOG: CatalogSimulation[] = [
  {
    id: 'sim-physics-projectile',
    title: 'Kinematic Projectile & Ballistics Motion',
    subject: 'Physics',
    category: 'Classical Mechanics',
    difficulty: 'Beginner',
    description:
      'Launch projectiles from an elevation cannon across varied gravitational fields. Analyze velocity decomposition, range, and parabolic flight paths.',
    learningOutcomes: [
      'Understand orthogonal independence of horizontal and vertical velocities',
      'Derive maximum horizontal range condition θ = 45°',
      'Evaluate gravitational acceleration on Moon, Earth, and Jupiter',
    ],
    isPlayableInSandbox: true,
    associatedLabId: 'physics',
    durationMinutes: 25,
    completedByCount: 1420,
    rating: 4.9,
  },
  {
    id: 'sim-physics-pendulum',
    title: 'Damped Simple Harmonic Pendulum',
    subject: 'Physics',
    category: 'Oscillations & Waves',
    difficulty: 'Beginner',
    description:
      'Measure the period of oscillation against suspension length L and evaluate fluid drag damping ratios to determine local gravitational acceleration g.',
    learningOutcomes: [
      'Verify small-angle approximation sin θ ≈ θ',
      'Plot L vs T² graph to calculate acceleration due to gravity',
      'Observe exponential amplitude decay in dissipative fluid media',
    ],
    isPlayableInSandbox: true,
    associatedLabId: 'physics',
    durationMinutes: 30,
    completedByCount: 1180,
    rating: 4.8,
  },
  {
    id: 'sim-chemistry-vsepr',
    title: '3D VSEPR Molecular Bonding & Orbitals',
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    difficulty: 'Intermediate',
    description:
      'Explore 3D spatial electron repulsion geometry across H₂O, CO₂, CH₄, NH₃, and SF₆. Toggle lone pair orbitals and dipole vectors.',
    learningOutcomes: [
      'Correlate steric number to hybridization states (sp, sp², sp³, sp³d²)',
      'Calculate bond angle distortions caused by lone pair - bond pair repulsion',
      'Determine net dipole moments and molecular polarity',
    ],
    isPlayableInSandbox: true,
    associatedLabId: 'chemistry',
    durationMinutes: 35,
    completedByCount: 1650,
    rating: 4.9,
  },
  {
    id: 'sim-electronics-logic',
    title: 'Digital Logic Gates & Breadboard TTL ICs',
    subject: 'Electronics',
    category: 'Digital Electronics',
    difficulty: 'Beginner',
    description:
      'Assemble digital circuits on a virtual breadboard with 74-series TTL chips (AND, OR, NOT, NAND, XOR), toggle tactile inputs, and verify truth tables.',
    learningOutcomes: [
      'Verify Boolean truth tables for fundamental and universal logic gates',
      'Measure logic voltage thresholds (HIGH > 2.0V, LOW < 0.8V)',
      'Inspect propagation delay waveforms on the benchtop oscilloscope',
    ],
    isPlayableInSandbox: true,
    associatedLabId: 'electronics',
    durationMinutes: 40,
    completedByCount: 2100,
    rating: 4.95,
  },
  {
    id: 'sim-electrical-rlc',
    title: 'RLC Resonant Tank Circuit & Frequency Response',
    subject: 'Electrical',
    category: 'Circuit Theory',
    difficulty: 'Intermediate',
    description:
      'Analyze transient response, resonance peak, and damping factors in series and parallel RLC networks subjected to sinusoidal AC inputs.',
    learningOutcomes: [
      'Calculate resonant frequency f₀ = 1 / (2π√(LC))',
      'Evaluate circuit Quality Factor (Q) and half-power bandwidth',
      'Observe phase angle shift between voltage and current waveforms',
    ],
    isPlayableInSandbox: false,
    durationMinutes: 45,
    completedByCount: 890,
    rating: 4.7,
  },
  {
    id: 'sim-electrical-transformer',
    title: 'Single-Phase Transformer Efficiency & Losses',
    subject: 'Electrical',
    category: 'Electrical Machines',
    difficulty: 'Advanced',
    description:
      'Simulate Open-Circuit (OC) and Short-Circuit (SC) tests on a 1kVA transformer to determine core hysteresis and copper ohmic losses.',
    learningOutcomes: [
      'Derive equivalent circuit parameters referred to primary and secondary',
      'Determine maximum efficiency condition (Iron Loss = Copper Loss)',
      'Calculate voltage regulation under lagging, unity, and leading power factors',
    ],
    isPlayableInSandbox: false,
    durationMinutes: 50,
    completedByCount: 720,
    rating: 4.8,
  },
  {
    id: 'sim-mech-four-bar',
    title: 'Four-Bar Linkage Kinematics & Coupler Curves',
    subject: 'Mechanical',
    category: 'Kinematics of Machines',
    difficulty: 'Intermediate',
    description:
      'Interact with Grashof crank-rocker, double-crank, and double-rocker mechanisms. Generate real-time velocity and acceleration polygons.',
    learningOutcomes: [
      'Verify Grashof condition: s + l ≤ p + q',
      'Trace coupler point motion trajectories for automated pick-and-place',
      'Analyze toggle positions and transmission angle limitations',
    ],
    isPlayableInSandbox: false,
    durationMinutes: 35,
    completedByCount: 640,
    rating: 4.75,
  },
  {
    id: 'sim-cs-binary-search-tree',
    title: '3D Binary Search Tree & AVL Self-Balancing',
    subject: 'Computer Science',
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    description:
      'Visualize 3D node insertions, tree rotations (LL, RR, LR, RL), and recursive in-order/pre-order traversals in real-time spatial memory.',
    learningOutcomes: [
      'Understand balance factor calculation: Height(Left) - Height(Right)',
      'Observe O(log N) search complexity vs O(N) degenerate trees',
      'Step through single and double tree rotation algorithms in 3D',
    ],
    isPlayableInSandbox: false,
    durationMinutes: 30,
    completedByCount: 1840,
    rating: 4.9,
  },
];
