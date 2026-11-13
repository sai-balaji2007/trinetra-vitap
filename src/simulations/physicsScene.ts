/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { PhysicsParams, TelemetryPoint } from '../types/simulation';
import { createContactShadowTexture } from './common';

export interface PhysicsSceneController {
  group: THREE.Group;
  update: (delta: number, params: PhysicsParams, isPlaying: boolean) => TelemetryPoint;
  reset: () => void;
  dispose: () => void;
}

export function createPhysicsScene(): PhysicsSceneController {
  const root = new THREE.Group();

  // Reusable materials
  const metalBrass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.25,
  });

  const castIronDark = new THREE.MeshStandardMaterial({
    color: 0x242a36,
    metalness: 0.6,
    roughness: 0.5,
  });

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
  });

  const cyanAccent = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    metalness: 0.4,
    roughness: 0.3,
    emissive: 0x0891b2,
    emissiveIntensity: 0.4,
  });

  // Base contact shadow
  const shadowTex = createContactShadowTexture(256);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.01;
  root.add(shadowPlane);

  // ---------------------------------------------------------------------------
  // 1. CANNON / PROJECTILE RIG (Composite Group: 7 parts)
  // ---------------------------------------------------------------------------
  const cannonGroup = new THREE.Group();
  cannonGroup.position.set(-6, 0, 0);

  // 1a. Base plate with bevel
  const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.3, 32);
  const baseMesh = new THREE.Mesh(baseGeo, castIronDark);
  baseMesh.position.y = 0.15;
  cannonGroup.add(baseMesh);

  // 1b. Swivel yoke uprights
  const yokeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.6), castIronDark);
  yokeLeft.position.set(0, 0.9, -0.65);
  const yokeRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.6), castIronDark);
  yokeRight.position.set(0, 0.9, 0.65);
  cannonGroup.add(yokeLeft, yokeRight);

  // 1c. Protractor arc
  const arcGeo = new THREE.TorusGeometry(0.9, 0.05, 12, 32, Math.PI / 2);
  const arcMesh = new THREE.Mesh(arcGeo, cyanAccent);
  arcMesh.position.set(0, 1.2, 0.66);
  arcMesh.rotation.y = Math.PI / 2;
  cannonGroup.add(arcMesh);

  // 1d. Trunnion pivot axle & Barrel Assembly
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 1.2, 0);

  // Main barrel body (Lathe / tapered cylinder)
  const barrelGeo = new THREE.CylinderGeometry(0.28, 0.42, 2.8, 24);
  barrelGeo.translate(0, 1.2, 0);
  const barrelMesh = new THREE.Mesh(barrelGeo, metalBrass);
  barrelMesh.rotation.z = -Math.PI / 2;

  // Barrel Muzzle Ring
  const muzzleGeo = new THREE.TorusGeometry(0.32, 0.06, 12, 24);
  const muzzleMesh = new THREE.Mesh(muzzleGeo, polishedSteel);
  muzzleMesh.position.set(2.6, 0, 0);
  muzzleMesh.rotation.y = Math.PI / 2;

  // Elevation needle pointer
  const needleGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 8);
  needleGeo.translate(0, 0.4, 0);
  const needleMesh = new THREE.Mesh(needleGeo, cyanAccent);
  needleMesh.position.set(0, 0, 0.68);
  needleMesh.rotation.z = -Math.PI / 2;

  barrelPivot.add(barrelMesh, muzzleMesh, needleMesh);
  cannonGroup.add(barrelPivot);
  root.add(cannonGroup);

  // Projectile Ball
  const projectileMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), polishedSteel);
  projectileMesh.position.set(-3.4, 1.2, 0);
  root.add(projectileMesh);

  // Trajectory Trail line
  const maxTrailPoints = 120;
  const trailPositions = new Float32Array(maxTrailPoints * 3);
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMaterial = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.85,
    linewidth: 2,
  });
  const trajectoryLine = new THREE.Line(trailGeometry, trailMaterial);
  root.add(trajectoryLine);

  // Landing range target marks
  const groundGridGroup = new THREE.Group();
  for (let d = 2; d <= 18; d += 2) {
    const markGeo = new THREE.RingGeometry(0.1, 0.16, 16);
    const markMat = new THREE.MeshBasicMaterial({
      color: d % 4 === 0 ? 0x06b6d4 : 0x334155,
      side: THREE.DoubleSide,
    });
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(-6 + d, 0.02, 0);
    groundGridGroup.add(mark);
  }
  root.add(groundGridGroup);

  // ---------------------------------------------------------------------------
  // 2. PENDULUM RIG (Composite Group: 6 parts)
  // ---------------------------------------------------------------------------
  const pendulumGroup = new THREE.Group();
  pendulumGroup.position.set(0, 0, 0);
  pendulumGroup.visible = false;

  // Stand upright column
  const standPost = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 6.0, 16), castIronDark);
  standPost.position.set(-1.8, 3.0, -0.8);

  // Stand heavy base
  const standBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 1.6), castIronDark);
  standBase.position.set(-1.8, 0.12, -0.8);

  // Horizontal cantilever boom
  const standBoom = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 0.18), castIronDark);
  standBoom.position.set(-0.7, 5.9, -0.8);

  // Chuck clamp mount
  const chuckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.35, 16), metalBrass);
  chuckMesh.position.set(0.3, 5.75, -0.8);

  pendulumGroup.add(standPost, standBase, standBoom, chuckMesh);

  // Pendulum Suspension Assembly
  const suspensionPivot = new THREE.Group();
  suspensionPivot.position.set(0.3, 5.7, -0.8);

  // Suspension wire
  const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
  wireGeo.translate(0, -0.5, 0);
  const wireMesh = new THREE.Mesh(wireGeo, polishedSteel);

  // Pendulum Bob
  const bobMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), metalBrass);
  bobMesh.position.set(0, -1, 0);

  // Bottom plumb indicator tip
  const plumbTip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 16), metalBrass);
  plumbTip.position.set(0, -0.4, 0);
  plumbTip.rotation.x = Math.PI;
  bobMesh.add(plumbTip);

  suspensionPivot.add(wireMesh, bobMesh);
  pendulumGroup.add(suspensionPivot);
  root.add(pendulumGroup);

  // ---------------------------------------------------------------------------
  // Runtime State
  // ---------------------------------------------------------------------------
  let simTime = 0;
  let projectileActive = true;
  let projFlightTime = 0;
  let pendulumTheta = 0;
  let pendulumOmega = 0;

  function updateTrajectory(params: PhysicsParams) {
    const v0 = params.velocity;
    const rad = (params.angle * Math.PI) / 180;
    const g = params.gravity;
    const totalTime = (2 * v0 * Math.sin(rad)) / g;

    const posAttr = trailGeometry.getAttribute('position') as THREE.BufferAttribute;
    const startX = -6;
    const startY = 1.2;

    for (let i = 0; i < maxTrailPoints; i++) {
      const t = (i / (maxTrailPoints - 1)) * totalTime;
      const x = startX + v0 * Math.cos(rad) * t;
      const y = Math.max(0.02, startY + v0 * Math.sin(rad) * t - 0.5 * g * t * t);
      posAttr.setXYZ(i, x, y, 0);
    }
    posAttr.needsUpdate = true;
  }

  function reset() {
    simTime = 0;
    projFlightTime = 0;
    pendulumTheta = 0;
    pendulumOmega = 0;
    projectileActive = true;
  }

  function update(delta: number, params: PhysicsParams, isPlaying: boolean): TelemetryPoint {
    const isProjectile = params.subMode === 'projectile';
    cannonGroup.visible = isProjectile;
    projectileMesh.visible = isProjectile;
    trajectoryLine.visible = isProjectile;
    groundGridGroup.visible = isProjectile;
    pendulumGroup.visible = !isProjectile;

    if (isPlaying) {
      simTime += delta;
    }

    if (isProjectile) {
      // Adjust barrel tilt
      const rad = (params.angle * Math.PI) / 180;
      barrelPivot.rotation.z = rad;
      updateTrajectory(params);

      const v0 = params.velocity;
      const g = params.gravity;
      const totalFlightTime = (2 * v0 * Math.sin(rad)) / g;

      if (isPlaying) {
        projFlightTime += delta;
        if (projFlightTime > totalFlightTime + 0.8) {
          projFlightTime = 0; // Loop trajectory smoothly
        }
      }

      const tClamped = Math.min(projFlightTime, totalFlightTime);
      const startX = -6;
      const startY = 1.2;
      const posX = startX + v0 * Math.cos(rad) * tClamped;
      const posY = Math.max(0.24, startY + v0 * Math.sin(rad) * tClamped - 0.5 * g * tClamped * tClamped);
      projectileMesh.position.set(posX, posY, 0);

      const currentVx = v0 * Math.cos(rad);
      const currentVy = v0 * Math.sin(rad) - g * tClamped;
      const currentV = Math.sqrt(currentVx * currentVx + currentVy * currentVy);
      const maxRange = (v0 * v0 * Math.sin(2 * rad)) / g;
      const maxHeight = startY + (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * g);

      return {
        time: Number(simTime.toFixed(2)),
        val1: Number(posY.toFixed(2)), // altitude
        val2: Number(currentV.toFixed(2)), // velocity
        label1: 'Altitude (m)',
        label2: 'Speed (m/s)',
      };
    } else {
      // Pendulum Mode
      const L = params.pendulumLength;
      const g = params.gravity;
      const omega0 = Math.sqrt(g / L);
      const initialRad = (params.pendulumInitialAngle * Math.PI) / 180;
      const dampingFactor = 0.08 * (1 + params.airResistance);

      // Wire & Bob scaling
      wireMesh.scale.set(1, L * 1.5, 1);
      bobMesh.position.y = -L * 1.5;

      if (isPlaying) {
        pendulumTheta = initialRad * Math.exp(-dampingFactor * simTime) * Math.cos(omega0 * simTime);
        pendulumOmega = -initialRad * omega0 * Math.sin(omega0 * simTime);
      } else {
        pendulumTheta = initialRad;
        pendulumOmega = 0;
      }

      suspensionPivot.rotation.z = pendulumTheta;

      const currentPeriod = 2 * Math.PI * Math.sqrt(L / g);
      const bobHeight = L * (1 - Math.cos(pendulumTheta));
      const velocity = Math.abs(pendulumOmega * L);

      return {
        time: Number(simTime.toFixed(2)),
        val1: Number((pendulumTheta * (180 / Math.PI)).toFixed(1)), // angle
        val2: Number(velocity.toFixed(2)), // speed
        label1: 'Deflection (°)',
        label2: 'Linear Speed (m/s)',
      };
    }
  }

  function dispose() {
    trailGeometry.dispose();
    trailMaterial.dispose();
    shadowTex.dispose();
    shadowMat.dispose();
    metalBrass.dispose();
    castIronDark.dispose();
    polishedSteel.dispose();
    cyanAccent.dispose();
  }

  return { group: root, update, reset, dispose };
}
