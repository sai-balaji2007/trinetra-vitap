/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LabExperimentType = 'physics' | 'chemistry' | 'electronics';

export type NavigationPage =
  | 'home'
  | 'courses'
  | 'course-detail'
  | 'learn'
  | 'labs'
  | 'dashboard'
  | 'instructor'
  | 'admin'
  | 'community'
  | 'verify-certificate'
  | 'about'
  | 'explore'
  | 'institutions'
  | 'pricing'
  | 'contact';

export interface PhysicsParams {
  subMode: 'projectile' | 'pendulum';
  gravity: number; // m/s^2 (e.g. 9.8 for Earth, 1.6 for Moon, 24.8 for Jupiter)
  velocity: number; // m/s
  angle: number; // degrees
  airResistance: number; // 0 to 1
  pendulumLength: number; // meters (0.5 to 3.0)
  pendulumInitialAngle: number; // degrees
  mass: number; // kg
}

export type MoleculeType = 'H2O' | 'CO2' | 'CH4' | 'NH3' | 'SF6';

export interface ChemistryParams {
  molecule: MoleculeType;
  vibrationSpeed: number; // 0.1 to 3.0
  orbitalOpacity: number; // 0.0 to 0.8
  temperature: number; // Kelvin (100K to 800K)
  showDipole: boolean;
  showBondAngles: boolean;
}

export type LogicGateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'XOR';

export interface ElectronicsParams {
  subMode: 'logic' | 'rlc';
  gateType: LogicGateType;
  inputA: boolean;
  inputB: boolean;
  supplyVoltage: number; // Volts (1V to 15V)
  frequency: number; // Hz (10Hz to 1000Hz)
  resistance: number; // Ohms (100 to 10000)
  capacitance: number; // microFarads (1 to 100)
}

export interface TelemetryPoint {
  time: number; // seconds
  val1: number; // primary readout (e.g. height, bond energy, output V)
  val2: number; // secondary readout (e.g. velocity, temperature, current)
  label1: string;
  label2: string;
  velocityVal?: number; // instantaneous velocity in m/s
}

export interface VelocityTimePoint {
  time: number; // seconds
  velocity: number; // m/s
}

export interface ExperimentSummary {
  id: LabExperimentType;
  title: string;
  subtitle: string;
  badge: string;
  syllabusAlignment: string;
}

export const LAB_EXPERIMENTS: ExperimentSummary[] = [
  {
    id: 'physics',
    title: 'Physics Mechanics',
    subtitle: 'Projectile & Simple Pendulum Motion',
    badge: 'CBSE 11 / B.Tech Engg Physics',
    syllabusAlignment: 'CBSE Practical Exp 3 & AICTE Engg Physics Lab Module 1',
  },
  {
    id: 'chemistry',
    title: 'Molecular Chemistry',
    subtitle: '3D VSEPR Molecular Bonding & Orbitals',
    badge: 'CBSE 11-12 / Engg Chemistry',
    syllabusAlignment: 'CBSE Class 11 Unit 4 Chemical Bonding & VSEPR Theory',
  },
  {
    id: 'electronics',
    title: 'Digital & Analog Electronics',
    subtitle: 'Digital Logic Gates & RLC Resonant Circuit',
    badge: 'B.Tech 1st Year / Polytechnic',
    syllabusAlignment: 'Basic Electrical & Electronics Engg (BEEE) Lab Syllabus',
  },
];

export interface CatalogSimulation {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Electronics' | 'Electrical' | 'Mechanical' | 'Computer Science';
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  learningOutcomes: string[];
  isPlayableInSandbox: boolean;
  associatedLabId?: LabExperimentType;
  durationMinutes: number;
  completedByCount: number;
  rating: number;
}
