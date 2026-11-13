/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { ChemistryParams, MoleculeType, TelemetryPoint } from '../types/simulation';
import { createContactShadowTexture } from './common';

export interface ChemistrySceneController {
  group: THREE.Group;
  update: (delta: number, params: ChemistryParams, isPlaying: boolean) => TelemetryPoint;
  reset: () => void;
  dispose: () => void;
}

interface AtomDef {
  element: 'H' | 'C' | 'O' | 'N' | 'S' | 'F';
  basePos: THREE.Vector3;
  radius: number;
}

interface BondDef {
  atomA: number;
  atomB: number;
  order: 1 | 2; // single or double bond
}

interface MoleculeSpec {
  name: string;
  formula: string;
  geometryName: string;
  nominalAngle: number;
  dipoleDebye: number;
  atoms: AtomDef[];
  bonds: BondDef[];
  lonePairs?: THREE.Vector3[];
}

const MOLECULE_DATA: Record<MoleculeType, MoleculeSpec> = {
  H2O: {
    name: 'Water',
    formula: 'H₂O',
    geometryName: 'Bent (VSEPR sp³)',
    nominalAngle: 104.5,
    dipoleDebye: 1.85,
    atoms: [
      { element: 'O', basePos: new THREE.Vector3(0, 0, 0), radius: 0.65 },
      { element: 'H', basePos: new THREE.Vector3(-1.1, -0.7, 0), radius: 0.38 },
      { element: 'H', basePos: new THREE.Vector3(1.1, -0.7, 0), radius: 0.38 },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
    ],
    lonePairs: [new THREE.Vector3(-0.6, 1.0, 0.7), new THREE.Vector3(0.6, 1.0, -0.7)],
  },
  CO2: {
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    geometryName: 'Linear (VSEPR sp)',
    nominalAngle: 180.0,
    dipoleDebye: 0.0,
    atoms: [
      { element: 'C', basePos: new THREE.Vector3(0, 0, 0), radius: 0.6 },
      { element: 'O', basePos: new THREE.Vector3(-1.8, 0, 0), radius: 0.62 },
      { element: 'O', basePos: new THREE.Vector3(1.8, 0, 0), radius: 0.62 },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 2 },
      { atomA: 0, atomB: 2, order: 2 },
    ],
  },
  CH4: {
    name: 'Methane',
    formula: 'CH₄',
    geometryName: 'Tetrahedral (VSEPR sp³)',
    nominalAngle: 109.5,
    dipoleDebye: 0.0,
    atoms: [
      { element: 'C', basePos: new THREE.Vector3(0, 0, 0), radius: 0.62 },
      { element: 'H', basePos: new THREE.Vector3(0, 1.3, 0), radius: 0.35 },
      { element: 'H', basePos: new THREE.Vector3(1.23, -0.43, 0), radius: 0.35 },
      { element: 'H', basePos: new THREE.Vector3(-0.61, -0.43, 1.06), radius: 0.35 },
      { element: 'H', basePos: new THREE.Vector3(-0.61, -0.43, -1.06), radius: 0.35 },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
      { atomA: 0, atomB: 3, order: 1 },
      { atomA: 0, atomB: 4, order: 1 },
    ],
  },
  NH3: {
    name: 'Ammonia',
    formula: 'NH₃',
    geometryName: 'Trigonal Pyramidal (VSEPR sp³)',
    nominalAngle: 107.0,
    dipoleDebye: 1.47,
    atoms: [
      { element: 'N', basePos: new THREE.Vector3(0, 0.4, 0), radius: 0.64 },
      { element: 'H', basePos: new THREE.Vector3(1.15, -0.4, 0), radius: 0.36 },
      { element: 'H', basePos: new THREE.Vector3(-0.58, -0.4, 1.0), radius: 0.36 },
      { element: 'H', basePos: new THREE.Vector3(-0.58, -0.4, -1.0), radius: 0.36 },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
      { atomA: 0, atomB: 3, order: 1 },
    ],
    lonePairs: [new THREE.Vector3(0, 1.4, 0)],
  },
  SF6: {
    name: 'Sulfur Hexafluoride',
    formula: 'SF₆',
    geometryName: 'Octahedral (VSEPR sp³d²)',
    nominalAngle: 90.0,
    dipoleDebye: 0.0,
    atoms: [
      { element: 'S', basePos: new THREE.Vector3(0, 0, 0), radius: 0.72 },
      { element: 'F', basePos: new THREE.Vector3(0, 1.5, 0), radius: 0.48 },
      { element: 'F', basePos: new THREE.Vector3(0, -1.5, 0), radius: 0.48 },
      { element: 'F', basePos: new THREE.Vector3(1.5, 0, 0), radius: 0.48 },
      { element: 'F', basePos: new THREE.Vector3(-1.5, 0, 0), radius: 0.48 },
      { element: 'F', basePos: new THREE.Vector3(0, 0, 1.5), radius: 0.48 },
      { element: 'F', basePos: new THREE.Vector3(0, 0, -1.5), radius: 0.48 },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
      { atomA: 0, atomB: 3, order: 1 },
      { atomA: 0, atomB: 4, order: 1 },
      { atomA: 0, atomB: 5, order: 1 },
      { atomA: 0, atomB: 6, order: 1 },
    ],
  },
};

export function createChemistryScene(): ChemistrySceneController {
  const root = new THREE.Group();

  // Atom materials (CPK Color Standard with PBR polish)
  const elementMaterials: Record<string, THREE.MeshStandardMaterial> = {
    H: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.15, roughness: 0.25 }),
    C: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4, roughness: 0.35 }),
    O: new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.2, roughness: 0.3 }),
    N: new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.3, roughness: 0.3 }),
    S: new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.35, roughness: 0.3 }),
    F: new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.25, roughness: 0.3 }),
  };

  const bondMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.6,
    roughness: 0.35,
  });

  const lonePairMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    depthWrite: false,
    emissive: 0x0284c7,
    emissiveIntensity: 0.4,
  });

  const dipoleMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.4,
    roughness: 0.3,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
  });

  // Holographic Stage Base
  const stageGroup = new THREE.Group();
  stageGroup.position.set(0, -2.4, 0);

  const stageBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3.6, 4.0, 0.4, 48),
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.3 })
  );
  stageBase.position.y = 0.2;

  const stageRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.06, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6 })
  );
  stageRing.position.y = 0.41;
  stageRing.rotation.x = Math.PI / 2;

  stageGroup.add(stageBase, stageRing);
  root.add(stageGroup);

  // Soft Contact shadow
  const shadowTex = createContactShadowTexture(256);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -2.39;
  root.add(shadowPlane);

  // Molecule container
  const moleculeContainer = new THREE.Group();
  moleculeContainer.position.set(0, 0, 0);
  root.add(moleculeContainer);

  let currentMoleculeType: MoleculeType | null = null;
  const atomMeshes: THREE.Mesh[] = [];
  const bondMeshes: THREE.Mesh[] = [];
  const orbitalMeshes: THREE.Mesh[] = [];
  let dipoleMesh: THREE.Group | null = null;

  function buildMolecule(type: MoleculeType) {
    // Clear previous
    atomMeshes.forEach((m) => moleculeContainer.remove(m));
    bondMeshes.forEach((m) => moleculeContainer.remove(m));
    orbitalMeshes.forEach((m) => moleculeContainer.remove(m));
    if (dipoleMesh) moleculeContainer.remove(dipoleMesh);

    atomMeshes.length = 0;
    bondMeshes.length = 0;
    orbitalMeshes.length = 0;
    dipoleMesh = null;

    currentMoleculeType = type;
    const spec = MOLECULE_DATA[type];

    // Atoms
    spec.atoms.forEach((atom) => {
      const geo = new THREE.SphereGeometry(atom.radius, 32, 32);
      const mat = elementMaterials[atom.element] || elementMaterials.C;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(atom.basePos);
      moleculeContainer.add(mesh);
      atomMeshes.push(mesh);
    });

    // Bonds
    spec.bonds.forEach((bond) => {
      const a1 = spec.atoms[bond.atomA].basePos;
      const a2 = spec.atoms[bond.atomB].basePos;
      const dir = new THREE.Vector3().subVectors(a2, a1);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(a1, a2).multiplyScalar(0.5);

      if (bond.order === 1) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, len, 16), bondMaterial);
        cyl.position.copy(mid);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        moleculeContainer.add(cyl);
        bondMeshes.push(cyl);
      } else {
        // Double bond: two parallel cylinders
        const normal = new THREE.Vector3(0, 0, 1).cross(dir).normalize().multiplyScalar(0.12);
        [-1, 1].forEach((sign) => {
          const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, len, 16), bondMaterial);
          cyl.position.copy(mid).addScaledVector(normal, sign);
          cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
          moleculeContainer.add(cyl);
          bondMeshes.push(cyl);
        });
      }
    });

    // Lone pair electron orbitals
    if (spec.lonePairs) {
      spec.lonePairs.forEach((lpPos) => {
        const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), lonePairMaterial);
        lobe.scale.set(0.8, 1.4, 0.8);
        lobe.position.copy(lpPos);
        moleculeContainer.add(lobe);
        orbitalMeshes.push(lobe);
      });
    }

    // Dipole Moment vector arrow (if polar)
    if (spec.dipoleDebye > 0) {
      const arrowGroup = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 12), dipoleMaterial);
      shaft.position.y = 0.8;
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 16), dipoleMaterial);
      head.position.y = 1.7;
      arrowGroup.add(shaft, head);
      arrowGroup.position.set(0, 0.2, 0);
      moleculeContainer.add(arrowGroup);
      dipoleMesh = arrowGroup;
    }
  }

  buildMolecule('H2O');

  let simTime = 0;

  function reset() {
    simTime = 0;
  }

  function update(delta: number, params: ChemistryParams, isPlaying: boolean): TelemetryPoint {
    if (params.molecule !== currentMoleculeType) {
      buildMolecule(params.molecule);
    }

    const spec = MOLECULE_DATA[params.molecule];

    if (isPlaying) {
      simTime += delta * params.vibrationSpeed;
    }

    // Orbital Opacity
    lonePairMaterial.opacity = params.orbitalOpacity;
    lonePairMaterial.visible = params.orbitalOpacity > 0.05;

    // Dipole visibility
    if (dipoleMesh) {
      dipoleMesh.visible = params.showDipole && spec.dipoleDebye > 0;
    }

    // Thermal vibration amplitude (proportional to temperature)
    const thermalAmp = 0.03 * (params.temperature / 300);
    const freq = 12 * params.vibrationSpeed;

    // Apply vibrational perturbation to peripheral atoms
    spec.atoms.forEach((atom, idx) => {
      if (idx === 0) return; // Keep central atom fixed
      const mesh = atomMeshes[idx];
      if (!mesh) return;

      const phase = idx * 1.5;
      const offset = new THREE.Vector3(
        Math.sin(simTime * freq + phase) * thermalAmp,
        Math.cos(simTime * freq * 1.2 + phase) * thermalAmp,
        Math.sin(simTime * freq * 0.8 + phase) * thermalAmp
      );
      mesh.position.copy(atom.basePos).add(offset);
    });

    // Gentle slow rotation of entire molecule for inspection
    if (isPlaying) {
      moleculeContainer.rotation.y += delta * 0.35;
    }

    // Calculate live kinetic energy (J/mol roughly)
    const kineticEnergy = (3 / 2) * 8.314 * params.temperature;
    const instantaneousVibration = Math.abs(Math.sin(simTime * freq)) * 100;

    return {
      time: Number(simTime.toFixed(2)),
      val1: Number(instantaneousVibration.toFixed(1)),
      val2: Number(kineticEnergy.toFixed(0)),
      label1: 'Vibration Amplitude (%)',
      label2: 'Kinetic Energy (J/mol)',
    };
  }

  function dispose() {
    Object.values(elementMaterials).forEach((m) => m.dispose());
    bondMaterial.dispose();
    lonePairMaterial.dispose();
    dipoleMaterial.dispose();
    shadowTex.dispose();
    shadowMat.dispose();
  }

  return { group: root, update, reset, dispose };
}
