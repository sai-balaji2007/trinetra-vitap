/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Course,
  CourseCategory,
  CourseModule,
  Lesson,
  Quiz,
  QuizQuestion,
} from '../types/lms';

export function buildCourseThumbnail(
  category: CourseCategory,
  accentHex: string,
  codeBadge: string
): string {
  const safeCode = codeBadge.replace(/[<>&"]/g, '');
  const safeCat = category.replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080d1a"/>
        <stop offset="60%" stop-color="#10182a"/>
        <stop offset="100%" stop-color="#0b1326"/>
      </linearGradient>
      <radialGradient id="glow" cx="75%" cy="28%" r="55%">
        <stop offset="0%" stop-color="${accentHex}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="${accentHex}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="640" height="360" fill="url(#bg)"/>
    <rect width="640" height="360" fill="url(#glow)"/>
    <g stroke="#1e293b" stroke-width="1" opacity="0.55">
      <line x1="0" y1="72" x2="640" y2="72"/>
      <line x1="0" y1="144" x2="640" y2="144"/>
      <line x1="0" y1="216" x2="640" y2="216"/>
      <line x1="0" y1="288" x2="640" y2="288"/>
      <line x1="128" y1="0" x2="128" y2="360"/>
      <line x1="256" y1="0" x2="256" y2="360"/>
      <line x1="384" y1="0" x2="384" y2="360"/>
      <line x1="512" y1="0" x2="512" y2="360"/>
    </g>
    <circle cx="485" cy="145" r="78" fill="none" stroke="${accentHex}" stroke-width="2" stroke-dasharray="8 6" opacity="0.7"/>
    <circle cx="485" cy="145" r="46" fill="none" stroke="#4b8bff" stroke-width="1.5" opacity="0.6"/>
    <path d="M 90 270 Q 290 60 540 265" fill="none" stroke="${accentHex}" stroke-width="3" opacity="0.85"/>
    <circle cx="290" cy="164" r="6" fill="#ffffff"/>
    <text x="44" y="64" fill="${accentHex}" font-family="monospace" font-size="16" font-weight="bold">${safeCode}</text>
    <text x="44" y="314" fill="#a7b0c0" font-family="sans-serif" font-size="18" font-weight="600">${safeCat}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const NOW = '2026-10-15T09:00:00.000Z';

export const DEMO_COURSES: Course[] = [
  {
    id: 'course_physics_kinematics',
    title: 'Classical Mechanics & Ballistic Kinematics',
    thumbnail: buildCourseThumbnail('Physics', '#4b8bff', 'PHY-101 · DEMO'),
    instructorId: 'demo_instructor_1',
    instructorName: 'Dr. Arvind Narayanan',
    description:
      'Master two-dimensional projectile trajectories, orthogonal velocity decomposition, and damped simple harmonic motion through analytical derivations and interactive 3D workbench simulations.',
    learningObjectives: [
      'Derive the parabolic trajectory equation y(x) and horizontal range R from Newton’s second law',
      'Compute time of flight and peak altitude across different gravitational environments',
      'Measure gravitational acceleration g using a damped simple pendulum and L vs T² regression',
    ],
    difficulty: 'Beginner',
    durationHours: 4.5,
    category: 'Physics',
    prerequisites: ['High School Trigonometry', 'Basic Differential Calculus'],
    totalModules: 2,
    totalLessons: 5,
    syllabus: [
      'Module 1: Vector Decomposition & 2D Projectile Kinematics',
      'Module 2: Simple Harmonic Oscillations & Virtual Ballistics Lab',
      'Final Timed Assessment & Verified Certificate',
    ],
    rating: 4.9,
    enrollmentCount: 148,
    published: true,
    isDemoCourse: true,
    featured: true,
    finalQuizId: 'quiz_phy_final',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'course_electronics_digital',
    title: 'Digital Logic & TTL Circuit Prototyping',
    thumbnail: buildCourseThumbnail('Electronics', '#f04432', 'ECE-104 · DEMO'),
    instructorId: 'demo_instructor_1',
    instructorName: 'Prof. Ananya Sen',
    description:
      'Build a rock-solid foundation in Boolean algebra, 74xx-series TTL integrated circuits, breadboard prototyping, and oscilloscope waveform diagnostics.',
    learningObjectives: [
      'Apply De Morgan’s laws to simplify multi-variable combinational logic expressions',
      'Construct AND, OR, NOT, NAND, and XOR circuits on a virtual solderless breadboard',
      'Analyze TTL voltage thresholds (VIL, VIH) and propagation delay on an oscilloscope',
    ],
    difficulty: 'Beginner',
    durationHours: 5.2,
    category: 'Electronics',
    prerequisites: ['Basic Binary Number System'],
    totalModules: 2,
    totalLessons: 5,
    syllabus: [
      'Module 1: Boolean Algebra & Universal Gate Equivalence',
      'Module 2: Breadboard TTL Prototyping & Virtual Logic Lab',
      'Final Timed Assessment & Verified Certificate',
    ],
    rating: 4.9,
    enrollmentCount: 215,
    published: true,
    isDemoCourse: true,
    featured: true,
    finalQuizId: 'quiz_ece_final',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'course_chem_vsepr',
    title: 'VSEPR Molecular Geometry & Chemical Bonding',
    thumbnail: buildCourseThumbnail('Engineering Fundamentals', '#10b981', 'CHM-102 · DEMO'),
    instructorId: 'demo_instructor_2',
    instructorName: 'Dr. Meenakshi Iyer',
    description:
      'Visualize three-dimensional molecular geometries, orbital hybridization (sp, sp², sp³, sp³d²), lone-pair repulsion distortions, and net molecular dipole moments.',
    learningObjectives: [
      'Predict 3D molecular shapes using steric number and VSEPR electron pair repulsion rules',
      'Quantify bond angle contraction from 109.5° (CH₄) to 104.5° (H₂O) due to lone pairs',
      'Distinguish polar vs non-polar molecules via 3D vector cancellation of bond dipoles',
    ],
    difficulty: 'Intermediate',
    durationHours: 3.8,
    category: 'Engineering Fundamentals',
    prerequisites: ['Atomic Structure & Lewis Dot Diagrams'],
    totalModules: 2,
    totalLessons: 4,
    syllabus: [
      'Module 1: Hybridization & Electron Domain Repulsion',
      'Module 2: Dipole Moments & 3D Molecular Lab',
      'Final Timed Assessment & Verified Certificate',
    ],
    rating: 4.8,
    enrollmentCount: 132,
    published: true,
    isDemoCourse: true,
    featured: true,
    finalQuizId: 'quiz_chm_final',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'course_prog_python_stem',
    title: 'Python & Numerical Computing for STEM Labs',
    thumbnail: buildCourseThumbnail('Programming', '#f59e0b', 'CS-201 · DEMO'),
    instructorId: 'demo_instructor_2',
    instructorName: 'Prof. Vikramaditya Rao',
    description:
      'Learn how to translate physical differential equations into clean Python numerical solvers using Euler integration, vector arrays, and experimental telemetry CSV parsing.',
    learningObjectives: [
      'Implement numerical Euler integration to simulate damped motion and RC circuits',
      'Parse and clean CSV telemetry logs exported from virtual lab experiments',
      'Compute Root Mean Square Error (RMSE) between theoretical equations and lab trials',
    ],
    difficulty: 'Beginner',
    durationHours: 6.0,
    category: 'Programming',
    prerequisites: ['None — Introductory Engineering Track'],
    totalModules: 2,
    totalLessons: 4,
    syllabus: [
      'Module 1: Variables, Loops & Numerical ODE Stepping',
      'Module 2: Analyzing Lab CSV Telemetry Data in Python',
      'Final Timed Assessment & Verified Certificate',
    ],
    rating: 4.7,
    enrollmentCount: 184,
    published: true,
    isDemoCourse: true,
    featured: false,
    finalQuizId: 'quiz_prog_final',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'course_ai_neural_foundations',
    title: 'Foundations of Neural Networks & Gradient Descent',
    thumbnail: buildCourseThumbnail('Artificial Intelligence', '#a855f7', 'AI-301 · DEMO'),
    instructorId: 'demo_instructor_1',
    instructorName: 'Dr. Arvind Narayanan',
    description:
      'Understand artificial neurons from first principles: dot-product weighted sums, non-linear activation functions, MSE/cross-entropy loss surfaces, and gradient descent optimization.',
    learningObjectives: [
      'Compute forward-pass outputs for multi-layer perceptrons using matrix multiplication',
      'Explain why non-linear activations (ReLU, Sigmoid) are essential beyond XOR separability',
      'Trace weight updates during backpropagation using partial derivatives and learning rate α',
    ],
    difficulty: 'Intermediate',
    durationHours: 5.5,
    category: 'Artificial Intelligence',
    prerequisites: ['Linear Algebra Basics', 'Introductory Python'],
    totalModules: 2,
    totalLessons: 4,
    syllabus: [
      'Module 1: Perceptrons, Activation Functions & Loss Landscapes',
      'Module 2: Gradient Descent & Backpropagation Mechanics',
      'Final Timed Assessment & Verified Certificate',
    ],
    rating: 4.9,
    enrollmentCount: 162,
    published: true,
    isDemoCourse: true,
    featured: true,
    finalQuizId: 'quiz_ai_final',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const DEMO_MODULES: CourseModule[] = [
  // Physics Course
  {
    id: 'mod_phy_1',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    title: 'Module 1: Vector Decomposition & 2D Projectile Kinematics',
    description: 'Analytical derivations of horizontal range, maximum height, and time of flight.',
    order: 1,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'mod_phy_2',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    title: 'Module 2: Harmonic Oscillations & Practical Experimentation',
    description: 'Simple harmonic pendulum dynamics and interactive 3D trajectory verification.',
    order: 2,
    isPublic: true,
    createdAt: NOW,
  },

  // Electronics Course
  {
    id: 'mod_ece_1',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    title: 'Module 1: Boolean Algebra & Logic Gate Families',
    description: 'Truth tables, De Morgan transformations, and universal NAND/NOR synthesis.',
    order: 1,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'mod_ece_2',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    title: 'Module 2: TTL Breadboard Prototyping & Practical Lab',
    description: 'Wiring 74LS-series ICs on a breadboard and measuring output voltage levels.',
    order: 2,
    isPublic: true,
    createdAt: NOW,
  },

  // Chemistry Course
  {
    id: 'mod_chm_1',
    courseId: 'course_chem_vsepr',
    instructorId: 'demo_instructor_2',
    title: 'Module 1: VSEPR Theory & Orbital Hybridization',
    description: 'Predicting 3D molecular shapes from valence electron pair repulsions.',
    order: 1,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'mod_chm_2',
    courseId: 'course_chem_vsepr',
    instructorId: 'demo_instructor_2',
    title: 'Module 2: Molecular Polarity & 3D Simulation Lab',
    description: 'Evaluating net dipole vectors and thermal vibrational excitation.',
    order: 2,
    isPublic: true,
    createdAt: NOW,
  },

  // Python Course
  {
    id: 'mod_prog_1',
    courseId: 'course_prog_python_stem',
    instructorId: 'demo_instructor_2',
    title: 'Module 1: Numerical ODE Solvers in Python',
    description: 'Stepping velocity and position forward in discrete timesteps Δt.',
    order: 1,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'mod_prog_2',
    courseId: 'course_prog_python_stem',
    instructorId: 'demo_instructor_2',
    title: 'Module 2: Telemetry CSV Parsing & Error Metrics',
    description: 'Processing experimental logs and calculating percentage error.',
    order: 2,
    isPublic: true,
    createdAt: NOW,
  },

  // AI Course
  {
    id: 'mod_ai_1',
    courseId: 'course_ai_neural_foundations',
    instructorId: 'demo_instructor_1',
    title: 'Module 1: Perceptrons & Non-Linear Activations',
    description: 'From linear threshold units to smooth differentiable neural layers.',
    order: 1,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'mod_ai_2',
    courseId: 'course_ai_neural_foundations',
    instructorId: 'demo_instructor_1',
    title: 'Module 2: Loss Functions & Gradient Descent',
    description: 'Chain rule backpropagation and learning rate stability.',
    order: 2,
    isPublic: true,
    createdAt: NOW,
  },
];

export const DEMO_LESSONS: Lesson[] = [
  // PHYSICS COURSE LESSONS
  {
    id: 'les_phy_1',
    courseId: 'course_physics_kinematics',
    moduleId: 'mod_phy_1',
    instructorId: 'demo_instructor_1',
    title: '1.1 Orthogonal Decomposition of Initial Velocity',
    type: 'video',
    order: 1,
    durationMinutes: 12,
    videoScript: [
      {
        time: '00:00',
        heading: 'Independence of Perpendicular Motion',
        caption:
          'Galileo’s principle states that horizontal motion (constant velocity) and vertical motion (constant gravitational acceleration g) operate independently.',
      },
      {
        time: '04:00',
        heading: 'Resolving Velocity Components',
        caption:
          'For launch speed v₀ at elevation angle θ: vₓ = v₀ cos(θ) remains invariant without air drag, while vᵧ(t) = v₀ sin(θ) - g·t.',
      },
      {
        time: '08:30',
        heading: 'Worked Example (θ = 45°, v₀ = 20 m/s)',
        caption:
          'vₓ = 14.14 m/s and initial vᵧ = 14.14 m/s. At the apex, vᵧ = 0, giving peak time t_peak = v₀ sin(θ)/g ≈ 1.44 s.',
      },
    ],
    contentMarkdown: `## Orthogonal Velocity Components in 2D Motion
When a projectile is launched at speed **v₀** and angle **θ** above the horizontal plane (neglecting aerodynamic drag), its motion separates cleanly into two orthogonal axes:

- **Horizontal Axis (x)**: Zero acceleration ($a_x = 0$), so $v_x(t) = v_0 \\cos(\\theta)$ and $x(t) = (v_0 \\cos \\theta) t$.
- **Vertical Axis (y)**: Constant downward gravitational acceleration ($a_y = -g$), so $v_y(t) = v_0 \\sin(\\theta) - g t$ and $y(t) = (v_0 \\sin \\theta) t - \\frac{1}{2} g t^2$.

### Eliminating Time to Obtain the Parabolic Path
Substituting $t = \\frac{x}{v_0 \\cos \\theta}$ into $y(t)$ yields:
$$y(x) = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}$$
This quadratic dependence proves every ideal projectile follows a symmetric parabola.`,
    pdfNotesTitle: 'Kinematics Vector Decomposition Summary',
    pdfNotesContent: `# Orthogonal Velocity Decomposition\n\n## Key Equations\n1. Horizontal Velocity: vx = v0 * cos(theta)\n2. Vertical Velocity: vy(t) = v0 * sin(theta) - g*t\n3. Horizontal Range: R = (v0^2 * sin(2*theta)) / g\n4. Maximum Altitude: H = (v0^2 * sin^2(theta)) / (2*g)\n\n## Key Insight\nBecause sin(2*theta) reaches its maximum value of 1.0 when 2*theta = 90 degrees, the optimal launch angle on level ground is exactly 45 degrees.`,
    resources: [
      {
        title: 'Projectile Formula Reference Sheet',
        type: 'sheet',
        description: 'Quick equations for range, apex height, and flight duration.',
        content: 'R = v0^2 sin(2*theta)/g\nT = 2*v0*sin(theta)/g\nH = v0^2 sin^2(theta)/(2g)',
      },
    ],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_phy_2',
    courseId: 'course_physics_kinematics',
    moduleId: 'mod_phy_1',
    instructorId: 'demo_instructor_1',
    title: '1.2 Horizontal Range, Apex Height & Complementary Angles',
    type: 'article',
    order: 2,
    durationMinutes: 14,
    contentMarkdown: `## Deriving Horizontal Range & Complementary Angles
Setting $y(t) = 0$ on level ground gives total flight time:
$$T = \\frac{2 v_0 \\sin(\\theta)}{g}$$

Multiplying $T$ by the constant horizontal velocity $v_x = v_0 \\cos(\\theta)$ yields the horizontal range:
$$R = \\frac{v_0^2 \\sin(2\\theta)}{g}$$

### Why Complementary Angles Share Identical Range
Notice that $\\sin(2(90^\\circ - \\theta)) = \\sin(180^\\circ - 2\\theta) = \\sin(2\\theta)$. Therefore, launching at **30°** and **60°** with identical initial speed lands at the **exact same horizontal distance**, though 60° achieves a higher apex and longer flight time.`,
    pdfNotesTitle: 'Range & Complementary Angles Guide',
    pdfNotesContent: `## Complementary Angles Proof\nsin(2*(90 - theta)) = sin(180 - 2*theta) = sin(2*theta).\nThus 30 deg and 60 deg produce equal range R, while 45 deg maximizes R.`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_phy_3',
    courseId: 'course_physics_kinematics',
    moduleId: 'mod_phy_1',
    instructorId: 'demo_instructor_1',
    title: 'Module 1 Knowledge Check Quiz',
    type: 'quiz',
    order: 3,
    durationMinutes: 10,
    contentMarkdown: 'Verify your mastery of 2D projectile decomposition and range equations.',
    pdfNotesTitle: 'Module 1 Quiz Overview',
    pdfNotesContent: 'Topics: Orthogonal velocity components, optimal angle 45 degrees, apex velocity.',
    resources: [],
    quizId: 'quiz_phy_mod1',
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_phy_4',
    courseId: 'course_physics_kinematics',
    moduleId: 'mod_phy_2',
    instructorId: 'demo_instructor_1',
    title: '2.1 Damped Simple Harmonic Pendulum Dynamics',
    type: 'article',
    order: 4,
    durationMinutes: 15,
    contentMarkdown: `## Simple Harmonic Motion & Small-Angle Approximation
For a point mass suspended on a rigid massless rod of length $L$, the restoring torque gives:
$$\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\sin(\\theta) = 0$$

For small angular displacements ($\\theta < 15^\\circ$), $\\sin(\\theta) \\approx \\theta$ in radians, yielding the classic harmonic period independent of bob mass:
$$T = 2\\pi\\sqrt{\\frac{L}{g}}$$

When fluid drag is present, amplitude decays exponentially according to $\\theta(t) = \\theta_0 e^{-\\gamma t} \\cos(\\omega t)$.`,
    pdfNotesTitle: 'Damped Pendulum Equations',
    pdfNotesContent: `## Pendulum Period Formula\nT = 2 * pi * sqrt(L / g)\nNotice that bob mass does not affect the ideal oscillation period.`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_phy_5',
    courseId: 'course_physics_kinematics',
    moduleId: 'mod_phy_2',
    instructorId: 'demo_instructor_1',
    title: '2.2 Practical Lab: 3D Projectile & Pendulum Experiment',
    type: 'practical',
    order: 5,
    durationMinutes: 25,
    contentMarkdown:
      'Launch the interactive Virtual Physics Laboratory below to test Earth, Moon, and Jupiter gravity settings, record multi-angle trials, and export your observation report.',
    pdfNotesTitle: 'Physics Virtual Lab Worksheet',
    pdfNotesContent: `## Lab Procedure\n1. Set velocity v0 = 18 m/s on Earth (9.81 m/s^2).\n2. Record range at 30, 45, and 60 degrees.\n3. Verify 45 degrees gives maximum range.`,
    resources: [],
    experimentId: 'phy-projectile',
    isPublic: true,
    createdAt: NOW,
  },

  // ELECTRONICS COURSE LESSONS
  {
    id: 'les_ece_1',
    courseId: 'course_electronics_digital',
    moduleId: 'mod_ece_1',
    instructorId: 'demo_instructor_1',
    title: '1.1 Boolean Logic Gates & Universal NAND Synthesis',
    type: 'video',
    order: 1,
    durationMinutes: 14,
    videoScript: [
      {
        time: '00:00',
        heading: 'Binary Voltage Levels in 74LS TTL',
        caption:
          'In 5V Transistor-Transistor Logic (TTL), logic LOW (0) spans 0V–0.8V while logic HIGH (1) spans 2.0V–5.0V.',
      },
      {
        time: '05:00',
        heading: 'Fundamental Gates: AND, OR, NOT',
        caption:
          'AND (SN7408) outputs HIGH only when all inputs are HIGH. OR (SN7432) outputs HIGH if any input is HIGH.',
      },
      {
        time: '10:00',
        heading: 'Why NAND (SN7400) is Universal',
        caption:
          'By tying the two inputs of a NAND gate together we get NOT; inverting the output of NAND produces AND; applying De Morgan’s theorem builds OR.',
      },
    ],
    contentMarkdown: `## Digital Logic Gates & Universal Synthesis
Digital computation is built upon Boolean switching functions where binary states **0 (LOW)** and **1 (HIGH)** map to discrete voltage bands.

| Gate | IC Part | Boolean Expression | Output HIGH Condition |
|---|---|---|---|
| AND | SN7408 | $Q = A \\cdot B$ | Both A and B are 1 |
| OR | SN7432 | $Q = A + B$ | Either A or B is 1 |
| NOT | SN7404 | $Q = \\overline{A}$ | A is 0 |
| NAND | SN7400 | $Q = \\overline{A \\cdot B}$ | Not both A and B are 1 |
| XOR | SN7486 | $Q = A \\oplus B$ | A and B differ |`,
    pdfNotesTitle: 'Boolean Logic & 74xx IC Pinout Guide',
    pdfNotesContent: `## 74xx Series IC Quick Reference\nSN7408: Quad 2-Input AND\nSN7432: Quad 2-Input OR\nSN7404: Hex Inverter (NOT)\nSN7400: Quad 2-Input NAND (Universal Gate)\nSN7486: Quad 2-Input XOR`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ece_2',
    courseId: 'course_electronics_digital',
    moduleId: 'mod_ece_1',
    instructorId: 'demo_instructor_1',
    title: '1.2 De Morgan’s Laws & Karnaugh Simplification',
    type: 'article',
    order: 2,
    durationMinutes: 12,
    contentMarkdown: `## De Morgan’s Theorems
De Morgan’s two identities allow engineers to convert AND-OR logic into universal NAND-NAND or NOR-NOR topologies:
1. $\\overline{A \\cdot B} = \\overline{A} + \\overline{B}$
2. $\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$

Minimizing gate count lowers power dissipation and reduces cumulative propagation delay $t_{pd}$.`,
    pdfNotesTitle: 'De Morgan Laws Cheat Sheet',
    pdfNotesContent: `## De Morgan Identities\nNOT(A AND B) = (NOT A) OR (NOT B)\nNOT(A OR B) = (NOT A) AND (NOT B)`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ece_3',
    courseId: 'course_electronics_digital',
    moduleId: 'mod_ece_1',
    instructorId: 'demo_instructor_1',
    title: 'Module 1 Digital Logic Quiz',
    type: 'quiz',
    order: 3,
    durationMinutes: 10,
    contentMarkdown: 'Test your knowledge of Boolean truth tables, 74xx ICs, and De Morgan identities.',
    pdfNotesTitle: 'Logic Quiz Overview',
    pdfNotesContent: 'Topics: AND, OR, NAND, XOR truth tables and TTL thresholds.',
    resources: [],
    quizId: 'quiz_ece_mod1',
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ece_4',
    courseId: 'course_electronics_digital',
    moduleId: 'mod_ece_2',
    instructorId: 'demo_instructor_1',
    title: '2.1 LED Current Limiting & Series/Parallel Resistors',
    type: 'article',
    order: 4,
    durationMinutes: 14,
    contentMarkdown: `## Protecting LEDs with Ohm’s Law
A standard red or green indicator LED has a forward voltage drop $V_f \\approx 2.0\\text{ V}$ and nominal current $I_f = 15\\text{ mA}$. Connecting it directly across a $5\\text{ V}$ supply causes thermal destruction.

Using Ohm’s law, the required series current-limiting resistor is:
$$R = \\frac{V_{cc} - V_f}{I_f} = \\frac{5.0 - 2.0}{0.015} = 200\\,\\Omega \\text{ (use standard } 220\\,\\Omega\\text{)}$$`,
    pdfNotesTitle: 'LED Protection & Resistor Sizing',
    pdfNotesContent: `## LED Series Resistor Formula\nR = (Vcc - Vf) / If\nFor 5V supply, Vf=2V, If=15mA -> R = 200 Ohm (220 Ohm standard).`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ece_5',
    courseId: 'course_electronics_digital',
    moduleId: 'mod_ece_2',
    instructorId: 'demo_instructor_1',
    title: '2.2 Practical Lab: Virtual LED & Transistor Circuit',
    type: 'practical',
    order: 5,
    durationMinutes: 25,
    contentMarkdown:
      'Open the interactive Electronics Virtual Lab to verify LED current-limiting behavior and inspect truth tables on the 3D Breadboard.',
    pdfNotesTitle: 'Electronics Lab Procedure',
    pdfNotesContent: `## Lab Procedure\nAdjust Vcc from 2V to 12V and observe safe vs over-current thresholds.`,
    resources: [],
    experimentId: 'ece-led',
    isPublic: true,
    createdAt: NOW,
  },

  // CHEMISTRY COURSE LESSONS
  {
    id: 'les_chm_1',
    courseId: 'course_chem_vsepr',
    moduleId: 'mod_chm_1',
    instructorId: 'demo_instructor_2',
    title: '1.1 Steric Number & Electron Domain Geometry',
    type: 'video',
    order: 1,
    durationMinutes: 14,
    videoScript: [
      {
        time: '00:00',
        heading: 'Valence Shell Electron Pair Repulsion',
        caption:
          'Electron pairs surrounding a central atom repel each other electrostatically and arrange in 3D space to minimize repulsion energy.',
      },
      {
        time: '06:00',
        heading: 'Lone Pair > Bond Pair Repulsion',
        caption:
          'Unshared lone pairs occupy a wider angular volume than bonding pairs, compressing bond angles from 109.5° in CH₄ to 107° in NH₃ and 104.5° in H₂O.',
      },
    ],
    contentMarkdown: `## VSEPR Steric Number Rules
The **Steric Number (SN)** equals the number of $\\sigma$-bonds plus lone pairs on the central atom:
- **SN = 2 ($sp$)**: Linear, $180^\\circ$ (e.g., $\\text{CO}_2$)
- **SN = 4 ($sp^3$)**: Tetrahedral $109.5^\\circ$ ($\\text{CH}_4$), Trigonal Pyramidal $107^\\circ$ ($\\text{NH}_3$), Bent $104.5^\\circ$ ($\\text{H}_2\\text{O}$)
- **SN = 6 ($sp^3d^2$)**: Octahedral, $90^\\circ$ ($\\text{SF}_6$)`,
    pdfNotesTitle: 'VSEPR Geometry Reference Table',
    pdfNotesContent: `## VSEPR Summary\nCO2: Linear 180 deg, 0D\nCH4: Tetrahedral 109.5 deg, 0D\nNH3: Trigonal Pyramidal 107 deg, 1.47D\nH2O: Bent 104.5 deg, 1.85D\nSF6: Octahedral 90 deg, 0D`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_chm_2',
    courseId: 'course_chem_vsepr',
    moduleId: 'mod_chm_1',
    instructorId: 'demo_instructor_2',
    title: 'Module 1 VSEPR Bonding Quiz',
    type: 'quiz',
    order: 2,
    durationMinutes: 10,
    contentMarkdown: 'Assess your grasp of hybridization, bond angles, and lone-pair distortions.',
    pdfNotesTitle: 'VSEPR Quiz Scope',
    pdfNotesContent: 'Steric numbers 2, 4, 6 and lone pair compression.',
    resources: [],
    quizId: 'quiz_chm_final',
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_chm_3',
    courseId: 'course_chem_vsepr',
    moduleId: 'mod_chm_2',
    instructorId: 'demo_instructor_2',
    title: '2.1 Symmetry & Dipole Vector Cancellation',
    type: 'article',
    order: 3,
    durationMinutes: 12,
    contentMarkdown: `## Polar Bonds vs. Polar Molecules
A covalent bond between atoms of differing electronegativity creates a bond dipole vector $\\vec{\\mu}_i$. However, molecular symmetry can cause vectors to cancel:
- In $\\text{CO}_2$, two equal $\\text{C}=\\text{O}$ dipoles point $180^\\circ$ apart, giving $\\mu_{\\text{net}} = 0\\text{ D}$ (non-polar).
- In $\\text{H}_2\\text{O}$, the bent $104.5^\\circ$ geometry reinforces both $\\text{O}-\\text{H}$ dipoles upward, yielding $\\mu_{\\text{net}} = 1.85\\text{ D}$ (strongly polar).`,
    pdfNotesTitle: 'Dipole Moments in Symmetric Molecules',
    pdfNotesContent: `## Dipole Moment\nmu_net = Sum of bond dipole vectors. Symmetry cancels dipoles in CO2, CH4, SF6.`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_chm_4',
    courseId: 'course_chem_vsepr',
    moduleId: 'mod_chm_2',
    instructorId: 'demo_instructor_2',
    title: '2.2 Practical Lab: 3D Molecular Bonding Explorer',
    type: 'practical',
    order: 4,
    durationMinutes: 20,
    contentMarkdown: 'Inspect 3D VSEPR molecules, toggle lone pair orbital lobes, and observe thermal vibrations.',
    pdfNotesTitle: '3D Molecular Lab Notes',
    pdfNotesContent: `## Lab Activity\nCompare H2O and CO2 dipole arrows in the 3D sandbox.`,
    resources: [],
    experimentId: 'cs-vsepr',
    isPublic: true,
    createdAt: NOW,
  },

  // PYTHON PROGRAMMING COURSE LESSONS
  {
    id: 'les_prog_1',
    courseId: 'course_prog_python_stem',
    moduleId: 'mod_prog_1',
    instructorId: 'demo_instructor_2',
    title: '1.1 Discretizing Motion with Euler’s Method',
    type: 'video',
    order: 1,
    durationMinutes: 16,
    videoScript: [
      {
        time: '00:00',
        heading: 'Why Numerical Integration Matters',
        caption:
          'Real-world physics with quadratic air drag cannot always be solved in closed form. Discrete timestep stepping solves any ODE.',
      },
      {
        time: '07:00',
        heading: 'Forward Euler Step in Python',
        caption:
          'At each timestep dt = 0.01s: v = v + a * dt, then y = y + v * dt. Smaller dt yields higher numerical accuracy.',
      },
    ],
    contentMarkdown: `## Numerical Simulation Loop in Python
Every 3D physics engine uses a discrete numerical integrator to update state variables over small timesteps $\\Delta t$:

\`\`\`python
g = 9.81
dt = 0.01
y, vy = 0.0, 18.0 * 0.7071

while y >= 0:
    vy = vy - g * dt
    y = y + vy * dt
\`\`\``,
    pdfNotesTitle: 'Python Euler Integration Notes',
    pdfNotesContent: `## Euler Method\ny_next = y + vy * dt\nvy_next = vy + a * dt`,
    resources: [
      {
        title: 'projectile_solver.py',
        type: 'code',
        description: 'Starter Python script for damped projectile trajectory.',
        content: 'import math\ng=9.81\ndt=0.01\nv0=20\nang=math.radians(45)\nvx,vy=v0*math.cos(ang),v0*math.sin(ang)\nx=y=0\nwhile y>=0:\n  vy-=g*dt\n  x+=vx*dt\n  y+=vy*dt\nprint(round(x,2))',
      },
    ],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_prog_2',
    courseId: 'course_prog_python_stem',
    moduleId: 'mod_prog_1',
    instructorId: 'demo_instructor_2',
    title: '1.2 Computing Experimental Error & RMSE',
    type: 'article',
    order: 2,
    durationMinutes: 12,
    contentMarkdown: `## Comparing Simulated vs. Theoretical Curves
To quantify how closely experimental telemetry matches ideal theory, compute **Root Mean Square Error (RMSE)**:
$$\\text{RMSE} = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(y_{\\text{obs}, i} - y_{\\text{theory}, i})^2}$$`,
    pdfNotesTitle: 'RMSE Error Calculation Guide',
    pdfNotesContent: `## RMSE Formula\nRMSE = sqrt(mean((y_obs - y_theory)^2))`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_prog_3',
    courseId: 'course_prog_python_stem',
    moduleId: 'mod_prog_2',
    instructorId: 'demo_instructor_2',
    title: '2.1 Practical Lab: Sorting & Algorithm Complexity',
    type: 'practical',
    order: 3,
    durationMinutes: 20,
    contentMarkdown: 'Measure comparison and swap counts in our Computer Science Virtual Lab.',
    pdfNotesTitle: 'Algorithm Complexity Notes',
    pdfNotesContent: `## Time Complexity\nBubble Sort O(n^2) vs Quick/Merge Sort O(n log n).`,
    resources: [],
    experimentId: 'cs-sorting',
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_prog_4',
    courseId: 'course_prog_python_stem',
    moduleId: 'mod_prog_2',
    instructorId: 'demo_instructor_2',
    title: 'Final Assessment: Python Numerical Labs',
    type: 'quiz',
    order: 4,
    durationMinutes: 12,
    contentMarkdown: 'Complete this final quiz to earn your Python & Numerical Computing certificate.',
    pdfNotesTitle: 'Final Quiz Topics',
    pdfNotesContent: 'Euler timesteps, CSV parsing, RMSE calculation.',
    resources: [],
    quizId: 'quiz_prog_final',
    isPublic: true,
    createdAt: NOW,
  },

  // AI COURSE LESSONS
  {
    id: 'les_ai_1',
    courseId: 'course_ai_neural_foundations',
    moduleId: 'mod_ai_1',
    instructorId: 'demo_instructor_1',
    title: '1.1 Anatomy of an Artificial Neuron & ReLU',
    type: 'video',
    order: 1,
    durationMinutes: 15,
    videoScript: [
      {
        time: '00:00',
        heading: 'Weighted Linear Combination',
        caption:
          'A neuron computes z = w₁x₁ + w₂x₂ + ... + b, aggregating evidence across all input features.',
      },
      {
        time: '07:00',
        heading: 'Why Non-Linearity is Mandatory',
        caption:
          'Stacking linear layers without activation functions collapses into a single linear transform incapable of solving XOR. ReLU(z) = max(0, z) introduces piecewise non-linearity.',
      },
    ],
    contentMarkdown: `## From Perceptron to Deep Layers
An artificial neuron transforms an input vector $\\mathbf{x}$ via:
$$z = \\mathbf{w}^T \\mathbf{x} + b, \\quad \\hat{y} = \\sigma(z)$$
Common activation functions include **Sigmoid** $\\frac{1}{1+e^{-z}}$ for probabilities and **ReLU** $\\max(0, z)$ to prevent vanishing gradients in deep networks.`,
    pdfNotesTitle: 'Neural Activations Summary',
    pdfNotesContent: `## Activations\nReLU(z) = max(0, z)\nSigmoid(z) = 1 / (1 + exp(-z))`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ai_2',
    courseId: 'course_ai_neural_foundations',
    moduleId: 'mod_ai_1',
    instructorId: 'demo_instructor_1',
    title: '1.2 Mean Squared Error vs. Cross-Entropy Loss',
    type: 'article',
    order: 2,
    durationMinutes: 12,
    contentMarkdown: `## Quantifying Prediction Error
- **Regression**: Mean Squared Error $L = \\frac{1}{N}\\sum (y_i - \\hat{y}_i)^2$
- **Binary Classification**: Binary Cross-Entropy $L = -[y\\log(\\hat{y}) + (1-y)\\log(1-\\hat{y})]$`,
    pdfNotesTitle: 'Loss Functions Reference',
    pdfNotesContent: `## Loss Functions\nUse MSE for continuous regression and Cross-Entropy for probability classification.`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ai_3',
    courseId: 'course_ai_neural_foundations',
    moduleId: 'mod_ai_2',
    instructorId: 'demo_instructor_1',
    title: '2.1 Gradient Descent Weight Updates',
    type: 'article',
    order: 3,
    durationMinutes: 15,
    contentMarkdown: `## Updating Weights Opposite the Gradient
Gradient descent iteratively minimizes loss $L(w)$ using learning rate $\\alpha$:
$$w_{\\text{new}} = w_{\\text{old}} - \\alpha \\frac{\\partial L}{\\partial w}$$
Choosing $\\alpha$ too large causes divergence; choosing $\\alpha$ too small slows convergence.`,
    pdfNotesTitle: 'Gradient Descent & Learning Rate',
    pdfNotesContent: `## Update Rule\nw_new = w_old - alpha * (dL/dw)`,
    resources: [],
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'les_ai_4',
    courseId: 'course_ai_neural_foundations',
    moduleId: 'mod_ai_2',
    instructorId: 'demo_instructor_1',
    title: 'Final Assessment: Neural Networks Foundations',
    type: 'quiz',
    order: 4,
    durationMinutes: 12,
    contentMarkdown: 'Complete this final timed assessment to unlock your AI Foundations certificate.',
    pdfNotesTitle: 'AI Final Assessment Overview',
    pdfNotesContent: 'Topics: ReLU, XOR non-linearity, MSE vs Cross-Entropy, Gradient Descent.',
    resources: [],
    quizId: 'quiz_ai_final',
    isPublic: true,
    createdAt: NOW,
  },
];

export const DEMO_QUIZZES: Quiz[] = [
  {
    id: 'quiz_phy_mod1',
    courseId: 'course_physics_kinematics',
    moduleId: 'mod_phy_1',
    instructorId: 'demo_instructor_1',
    title: 'Module 1 Check: Projectile Kinematics',
    timeLimitMinutes: 10,
    passingScore: 60,
    isFinalAssessment: false,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'quiz_phy_final',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    title: 'Final Assessment: Classical Mechanics & Ballistics',
    timeLimitMinutes: 15,
    passingScore: 70,
    isFinalAssessment: true,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'quiz_ece_mod1',
    courseId: 'course_electronics_digital',
    moduleId: 'mod_ece_1',
    instructorId: 'demo_instructor_1',
    title: 'Module 1 Check: Boolean Logic Gates',
    timeLimitMinutes: 10,
    passingScore: 60,
    isFinalAssessment: false,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'quiz_ece_final',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    title: 'Final Assessment: Digital Logic & TTL Circuits',
    timeLimitMinutes: 15,
    passingScore: 70,
    isFinalAssessment: true,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'quiz_chm_final',
    courseId: 'course_chem_vsepr',
    instructorId: 'demo_instructor_2',
    title: 'Final Assessment: VSEPR Molecular Geometry',
    timeLimitMinutes: 12,
    passingScore: 70,
    isFinalAssessment: true,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'quiz_prog_final',
    courseId: 'course_prog_python_stem',
    instructorId: 'demo_instructor_2',
    title: 'Final Assessment: Python Numerical Computing',
    timeLimitMinutes: 12,
    passingScore: 70,
    isFinalAssessment: true,
    isPublic: true,
    createdAt: NOW,
  },
  {
    id: 'quiz_ai_final',
    courseId: 'course_ai_neural_foundations',
    instructorId: 'demo_instructor_1',
    title: 'Final Assessment: Neural Networks & Gradient Descent',
    timeLimitMinutes: 12,
    passingScore: 70,
    isFinalAssessment: true,
    isPublic: true,
    createdAt: NOW,
  },
];

export const DEMO_QUESTIONS: QuizQuestion[] = [
  // Physics Module 1
  {
    id: 'q_phy_m1_1',
    quizId: 'quiz_phy_mod1',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    type: 'mcq',
    prompt: 'At what launch angle θ on level ground is the horizontal range R maximized (neglecting air drag)?',
    options: ['30°', '45°', '60°', '90°'],
    correctAnswers: ['45°'],
    explanation: 'Since R = (v₀² sin 2θ)/g, sin(2θ) reaches its peak of 1 when 2θ = 90°, so θ = 45°.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_phy_m1_2',
    quizId: 'quiz_phy_mod1',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    type: 'tf',
    prompt: 'True or False: At the highest point (apex) of a projectile’s trajectory, its total speed is zero.',
    options: ['True', 'False'],
    correctAnswers: ['False'],
    explanation: 'Only the vertical velocity component vᵧ is zero at the apex; horizontal velocity vₓ = v₀ cos(θ) remains non-zero.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_phy_m1_3',
    quizId: 'quiz_phy_mod1',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    type: 'multi',
    prompt: 'Select ALL launch angles that produce the SAME horizontal range as a 30° launch at equal speed:',
    options: ['15°', '60°', '45°', '30°'],
    correctAnswers: ['60°', '30°'],
    explanation: 'Complementary angles (30° and 60°) satisfy sin(2×60°) = sin(120°) = sin(60°) = sin(2×30°).',
    points: 10,
    isPublic: true,
  },
  // Physics Final
  {
    id: 'q_phy_f_1',
    quizId: 'quiz_phy_final',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    type: 'mcq',
    prompt: 'Which parameter controls the period T = 2π√(L/g) of an ideal small-angle simple pendulum?',
    options: ['Bob mass m', 'Rod length L and gravity g', 'Initial release angle 10°', 'Bob material density'],
    correctAnswers: ['Rod length L and gravity g'],
    explanation: 'Ideal pendulum period depends only on suspension length L and gravitational field strength g, independent of mass.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_phy_f_2',
    quizId: 'quiz_phy_final',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    type: 'tf',
    prompt: 'True or False: Launching the same projectile on the Moon (g = 1.62 m/s²) results in a significantly longer horizontal range than on Earth.',
    options: ['True', 'False'],
    correctAnswers: ['True'],
    explanation: 'Because gravity g is in the denominator of R = v₀² sin(2θ)/g, lower gravity yields roughly 6× greater range.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_phy_f_3',
    quizId: 'quiz_phy_final',
    courseId: 'course_physics_kinematics',
    instructorId: 'demo_instructor_1',
    type: 'short',
    prompt: 'What is the vertical acceleration (magnitude in m/s², rounded to 1 decimal place) of a projectile on Earth?',
    options: [],
    correctAnswers: ['9.8', '9.81'],
    explanation: 'Standard gravitational acceleration near Earth’s surface is g = 9.8 m/s² (or 9.81 m/s²).',
    points: 10,
    isPublic: true,
  },

  // Electronics Module 1 & Final
  {
    id: 'q_ece_m1_1',
    quizId: 'quiz_ece_mod1',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    type: 'mcq',
    prompt: 'Which 74xx TTL integrated circuit implements a Quad 2-Input AND gate?',
    options: ['SN7400', 'SN7404', 'SN7408', 'SN7432'],
    correctAnswers: ['SN7408'],
    explanation: 'SN7408 is Quad 2-input AND, SN7400 is NAND, SN7404 is Hex NOT, and SN7432 is OR.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_ece_m1_2',
    quizId: 'quiz_ece_mod1',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    type: 'multi',
    prompt: 'Select ALL universal logic gates that can synthesize every other Boolean function:',
    options: ['AND', 'NAND', 'XOR', 'NOR'],
    correctAnswers: ['NAND', 'NOR'],
    explanation: 'Both NAND and NOR are functionally complete (universal) gates.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_ece_f_1',
    quizId: 'quiz_ece_final',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    type: 'mcq',
    prompt: 'For A = 1 and B = 1, what is the output Q of an XOR (SN7486) gate?',
    options: ['1 (HIGH)', '0 (LOW)', 'High-Z', 'Oscillating'],
    correctAnswers: ['0 (LOW)'],
    explanation: 'XOR outputs HIGH only when its inputs are different; identical inputs (1, 1) output 0.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_ece_f_2',
    quizId: 'quiz_ece_final',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    type: 'short',
    prompt: 'Using R = (Vcc - Vf)/If with Vcc = 5V, Vf = 2V, and If = 0.015A, what minimum series resistance (in Ohms) protects the LED?',
    options: [],
    correctAnswers: ['200', '200 ohm', '200 ohms'],
    explanation: '(5 - 2) / 0.015 = 3 / 0.015 = 200 Ω (practically rounded up to standard 220 Ω).',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_ece_f_3',
    quizId: 'quiz_ece_final',
    courseId: 'course_electronics_digital',
    instructorId: 'demo_instructor_1',
    type: 'tf',
    prompt: 'True or False: By De Morgan’s law, NOT(A · B) equals (NOT A) + (NOT B).',
    options: ['True', 'False'],
    correctAnswers: ['True'],
    explanation: 'Complementing a product converts it into the sum of the complements.',
    points: 10,
    isPublic: true,
  },

  // Chemistry Final
  {
    id: 'q_chm_f_1',
    quizId: 'quiz_chm_final',
    courseId: 'course_chem_vsepr',
    instructorId: 'demo_instructor_2',
    type: 'mcq',
    prompt: 'Why is the H–O–H bond angle in water (104.5°) smaller than the ideal tetrahedral angle in methane (109.5°)?',
    options: [
      'Hydrogen atoms attract each other',
      'Oxygen has two lone pairs exerting stronger repulsion than bonding pairs',
      'Water uses sp2 hybridization',
      'Oxygen atomic radius is too small',
    ],
    correctAnswers: ['Oxygen has two lone pairs exerting stronger repulsion than bonding pairs'],
    explanation: 'Lone pair–lone pair and lone pair–bond pair repulsions exceed bond pair–bond pair repulsion, compressing the H–O–H angle.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_chm_f_2',
    quizId: 'quiz_chm_final',
    courseId: 'course_chem_vsepr',
    instructorId: 'demo_instructor_2',
    type: 'multi',
    prompt: 'Select ALL molecules with a net dipole moment of zero due to geometric symmetry:',
    options: ['CO₂', 'H₂O', 'CH₄', 'SF₆'],
    correctAnswers: ['CO₂', 'CH₄', 'SF₆'],
    explanation: 'Linear CO₂, tetrahedral CH₄, and octahedral SF₆ cancel individual bond dipoles by symmetry.',
    points: 10,
    isPublic: true,
  },

  // Programming Final
  {
    id: 'q_prog_f_1',
    quizId: 'quiz_prog_final',
    courseId: 'course_prog_python_stem',
    instructorId: 'demo_instructor_2',
    type: 'mcq',
    prompt: 'In Forward Euler numerical integration, what happens when the timestep dt is reduced from 0.1s to 0.005s?',
    options: [
      'Truncation error decreases and trajectory accuracy improves',
      'Gravity doubles',
      'The simulation becomes less accurate',
      'Nothing changes',
    ],
    correctAnswers: ['Truncation error decreases and trajectory accuracy improves'],
    explanation: 'Euler integration error scales linearly O(dt), so smaller timesteps improve accuracy at higher step count.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_prog_f_2',
    quizId: 'quiz_prog_final',
    courseId: 'course_prog_python_stem',
    instructorId: 'demo_instructor_2',
    type: 'tf',
    prompt: 'True or False: RMSE (Root Mean Square Error) shares the same physical units as the measured quantity y.',
    options: ['True', 'False'],
    correctAnswers: ['True'],
    explanation: 'Taking the square root of squared residuals restores the original unit (e.g., meters or volts).',
    points: 10,
    isPublic: true,
  },

  // AI Final
  {
    id: 'q_ai_f_1',
    quizId: 'quiz_ai_final',
    courseId: 'course_ai_neural_foundations',
    instructorId: 'demo_instructor_1',
    type: 'mcq',
    prompt: 'What is the output of ReLU(z) = max(0, z) when z = -3.4?',
    options: ['-3.4', '0', '1', '3.4'],
    correctAnswers: ['0'],
    explanation: 'ReLU zeroes out all negative pre-activation values while passing positive values linearly.',
    points: 10,
    isPublic: true,
  },
  {
    id: 'q_ai_f_2',
    quizId: 'quiz_ai_final',
    courseId: 'course_ai_neural_foundations',
    instructorId: 'demo_instructor_1',
    type: 'tf',
    prompt: 'True or False: A neural network with only linear layers (no activation functions) can learn the non-linear XOR gate.',
    options: ['True', 'False'],
    correctAnswers: ['False'],
    explanation: 'Compositions of linear maps remain strictly linear; non-linear activation functions are required for XOR.',
    points: 10,
    isPublic: true,
  },
];
