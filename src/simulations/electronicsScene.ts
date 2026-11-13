/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { ElectronicsParams, LogicGateType, TelemetryPoint } from '../types/simulation';
import { createContactShadowTexture, createICLabelTexture } from './common';

export interface ElectronicsSceneController {
  group: THREE.Group;
  update: (delta: number, params: ElectronicsParams, isPlaying: boolean) => TelemetryPoint;
  reset: () => void;
  dispose: () => void;
}

export function createElectronicsScene(): ElectronicsSceneController {
  const root = new THREE.Group();

  // Materials
  const breadboardWhite = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.7,
    metalness: 0.1,
  });

  const icPackageDark = new THREE.MeshStandardMaterial({
    color: 0x181c24,
    roughness: 0.6,
    metalness: 0.2,
  });

  const pinSilver = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    metalness: 0.9,
    roughness: 0.2,
  });

  const copperGold = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.8,
    roughness: 0.3,
  });

  // LED Materials
  const ledLensOff = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });

  const ledCyanOn = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.2,
    roughness: 0.1,
  });

  const ledAmberOn = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.2,
    roughness: 0.1,
  });

  const ledGreenOn = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    emissive: 0x10b981,
    emissiveIntensity: 1.6,
    roughness: 0.1,
  });

  // Base Contact Shadow
  const shadowTex = createContactShadowTexture(256);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.01;
  root.add(shadowPlane);

  // ---------------------------------------------------------------------------
  // 1. SOLDERLESS BREADBOARD ASSEMBLY (6 parts)
  // ---------------------------------------------------------------------------
  const boardGroup = new THREE.Group();
  boardGroup.position.set(0, 0, 0);

  // Breadboard main block
  const bbBase = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.4, 4.4), breadboardWhite);
  bbBase.position.y = 0.2;
  boardGroup.add(bbBase);

  // Center trough divider
  const trough = new THREE.Mesh(
    new THREE.BoxGeometry(6.8, 0.1, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
  );
  trough.position.set(0, 0.36, 0);
  boardGroup.add(trough);

  // Red & Blue Power Rails
  const redRailTop = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.02, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  redRailTop.position.set(0, 0.41, 1.95);

  const blueRailTop = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.02, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
  );
  blueRailTop.position.set(0, 0.41, 1.75);

  const redRailBottom = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.02, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  redRailBottom.position.set(0, 0.41, -1.75);

  const blueRailBottom = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.02, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
  );
  blueRailBottom.position.set(0, 0.41, -1.95);

  boardGroup.add(redRailTop, blueRailTop, redRailBottom, blueRailBottom);
  root.add(boardGroup);

  // ---------------------------------------------------------------------------
  // 2. DIP-14 IC PACKAGE (Composite Group: 15 parts)
  // ---------------------------------------------------------------------------
  const icGroup = new THREE.Group();
  icGroup.position.set(0, 0.4, 0);

  // IC Body with Silkscreen Texture
  const icTex = createICLabelTexture('SN7408N AND', 'TRINETRA LABS');
  const icTopMat = new THREE.MeshStandardMaterial({
    map: icTex,
    roughness: 0.5,
    metalness: 0.2,
  });
  const icMaterials = [
    icPackageDark, // right
    icPackageDark, // left
    icTopMat, // top
    icPackageDark, // bottom
    icPackageDark, // front
    icPackageDark, // back
  ];
  const icMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.0), icMaterials);
  icMesh.position.y = 0.2;
  icGroup.add(icMesh);

  // 14 Metallic Pins (7 on each side)
  const pinGeo = new THREE.BoxGeometry(0.08, 0.35, 0.05);
  for (let i = 0; i < 7; i++) {
    const posX = -0.9 + i * 0.3;
    // Side 1 (Z = -0.55)
    const pin1 = new THREE.Mesh(pinGeo, pinSilver);
    pin1.position.set(posX, 0.1, -0.53);
    icGroup.add(pin1);

    // Side 2 (Z = 0.55)
    const pin2 = new THREE.Mesh(pinGeo, pinSilver);
    pin2.position.set(posX, 0.1, 0.53);
    icGroup.add(pin2);
  }
  root.add(icGroup);

  // ---------------------------------------------------------------------------
  // 3. INPUT TOGGLE SWITCHES (Switch A & Switch B)
  // ---------------------------------------------------------------------------
  const switchGroupA = new THREE.Group();
  switchGroupA.position.set(-2.2, 0.4, 1.2);

  const swBaseA = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.5), icPackageDark);
  const swLeverA = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 12), pinSilver);
  swLeverA.position.y = 0.35;
  switchGroupA.add(swBaseA, swLeverA);

  const switchGroupB = new THREE.Group();
  switchGroupB.position.set(-2.2, 0.4, -1.2);

  const swBaseB = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.5), icPackageDark);
  const swLeverB = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 12), pinSilver);
  swLeverB.position.y = 0.35;
  switchGroupB.add(swBaseB, swLeverB);

  root.add(switchGroupA, switchGroupB);

  // ---------------------------------------------------------------------------
  // 4. INDICATOR LEDS (Input A, Input B, Output Q)
  // ---------------------------------------------------------------------------
  const ledGeo = new THREE.SphereGeometry(0.2, 16, 16);
  ledGeo.scale(1, 1.4, 1);

  // Input A LED
  const ledA = new THREE.Mesh(ledGeo, ledLensOff);
  ledA.position.set(-1.4, 0.6, 1.2);

  // Input B LED
  const ledB = new THREE.Mesh(ledGeo, ledLensOff);
  ledB.position.set(-1.4, 0.6, -1.2);

  // Output Q LED
  const ledQ = new THREE.Mesh(ledGeo, ledLensOff);
  ledQ.position.set(2.2, 0.6, 0);

  // Output PointLight for dynamic illumination
  const outputLight = new THREE.PointLight(0x10b981, 0, 4);
  outputLight.position.set(2.2, 1.0, 0);

  root.add(ledA, ledB, ledQ, outputLight);

  // ---------------------------------------------------------------------------
  // 5. JUMPER WIRES (Curved Tubes connecting circuit)
  // ---------------------------------------------------------------------------
  function createJumperWire(p1: THREE.Vector3, p2: THREE.Vector3, colorHex: number) {
    const mid = new THREE.Vector3()
      .addVectors(p1, p2)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0, 0.5 + Math.random() * 0.3, 0));
    const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
    const geo = new THREE.TubeGeometry(curve, 20, 0.035, 8, false);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.4,
      metalness: 0.1,
    });
    return new THREE.Mesh(geo, mat);
  }

  const wire1 = createJumperWire(new THREE.Vector3(-1.9, 0.45, 1.2), new THREE.Vector3(-0.9, 0.45, 0.55), 0x0284c7);
  const wire2 = createJumperWire(new THREE.Vector3(-1.9, 0.45, -1.2), new THREE.Vector3(-0.6, 0.45, 0.55), 0xf59e0b);
  const wire3 = createJumperWire(new THREE.Vector3(0.9, 0.45, 0.55), new THREE.Vector3(2.0, 0.45, 0), 0x10b981);
  root.add(wire1, wire2, wire3);

  // ---------------------------------------------------------------------------
  // 6. MINI DIGITAL OSCILLOSCOPE (Benchtop Instrument: 8 parts)
  // ---------------------------------------------------------------------------
  const scopeGroup = new THREE.Group();
  scopeGroup.position.set(4.8, 0, -0.6);

  // Scope chassis
  const scopeBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 2.4, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.5 })
  );
  scopeBody.position.y = 1.2;

  // Bevel front bezel
  const scopeBezel = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 })
  );
  scopeBezel.position.set(0, 1.2, 1.12);

  // Screen Canvas Texture for live waveform
  const scopeCanvas = document.createElement('canvas');
  scopeCanvas.width = 256;
  scopeCanvas.height = 256;
  const scopeCtx = scopeCanvas.getContext('2d')!;

  const scopeScreenTex = new THREE.CanvasTexture(scopeCanvas);
  scopeScreenTex.colorSpace = THREE.SRGBColorSpace;
  const scopeScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.3),
    new THREE.MeshBasicMaterial({ map: scopeScreenTex })
  );
  scopeScreen.position.set(-0.25, 1.35, 1.18);

  // Rotary control knobs
  const knobGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.15, 16);
  const knobMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
  const knob1 = new THREE.Mesh(knobGeo, knobMat);
  knob1.rotation.x = Math.PI / 2;
  knob1.position.set(0.8, 1.6, 1.18);

  const knob2 = new THREE.Mesh(knobGeo, knobMat);
  knob2.rotation.x = Math.PI / 2;
  knob2.position.set(0.8, 1.1, 1.18);

  const knob3 = new THREE.Mesh(knobGeo, knobMat);
  knob3.rotation.x = Math.PI / 2;
  knob3.position.set(0.8, 0.6, 1.18);

  scopeGroup.add(scopeBody, scopeBezel, scopeScreen, knob1, knob2, knob3);
  root.add(scopeGroup);

  // Runtime State
  let simTime = 0;
  let lastGate: LogicGateType | null = null;

  function updateScopeScreen(outputHigh: boolean, voltage: number, freq: number, t: number) {
    scopeCtx.fillStyle = '#05101a';
    scopeCtx.fillRect(0, 0, 256, 256);

    // Reticle grid
    scopeCtx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    scopeCtx.lineWidth = 1;
    for (let i = 0; i <= 256; i += 32) {
      scopeCtx.beginPath();
      scopeCtx.moveTo(i, 0);
      scopeCtx.lineTo(i, 256);
      scopeCtx.stroke();
      scopeCtx.beginPath();
      scopeCtx.moveTo(0, i);
      scopeCtx.lineTo(256, i);
      scopeCtx.stroke();
    }

    // Live wave trace
    scopeCtx.strokeStyle = outputHigh ? '#10b981' : '#06b6d4';
    scopeCtx.lineWidth = 2.5;
    scopeCtx.beginPath();

    const w = 256;
    const h = 256;
    const midY = 128;
    const scaleY = (voltage / 15) * 50;

    for (let x = 0; x < w; x++) {
      const phase = (x / w) * 4 * Math.PI + t * (freq / 80);
      // Square wave with slight RC roll-off
      const rawSq = Math.sin(phase) > 0 ? 1 : -1;
      const y = outputHigh ? midY - rawSq * scaleY : midY + 40;
      if (x === 0) scopeCtx.moveTo(x, y);
      else scopeCtx.lineTo(x, y);
    }
    scopeCtx.stroke();

    // Readout text on screen
    scopeCtx.fillStyle = '#38bdf8';
    scopeCtx.font = 'bold 14px monospace';
    scopeCtx.fillText(`CH1: ${voltage.toFixed(1)}V`, 10, 24);
    scopeCtx.fillText(`f: ${freq}Hz`, 10, 44);
    scopeCtx.fillText(outputHigh ? 'OUTPUT: HIGH' : 'OUTPUT: LOW', 10, 240);

    scopeScreenTex.needsUpdate = true;
  }

  function reset() {
    simTime = 0;
  }

  function evaluateLogic(gate: LogicGateType, a: boolean, b: boolean): boolean {
    switch (gate) {
      case 'AND':
        return a && b;
      case 'OR':
        return a || b;
      case 'NOT':
        return !a;
      case 'NAND':
        return !(a && b);
      case 'XOR':
        return a !== b;
      default:
        return false;
    }
  }

  function update(delta: number, params: ElectronicsParams, isPlaying: boolean): TelemetryPoint {
    if (isPlaying) {
      simTime += delta;
    }

    if (params.gateType !== lastGate) {
      lastGate = params.gateType;
      const icPartNo =
        params.gateType === 'AND'
          ? 'SN7408N AND'
          : params.gateType === 'OR'
            ? 'SN7432N OR'
            : params.gateType === 'NOT'
              ? 'SN7404N NOT'
              : params.gateType === 'NAND'
                ? 'SN7400N NAND'
                : 'SN7486N XOR';
      const newTex = createICLabelTexture(icPartNo, 'TRINETRA LABS');
      icTopMat.map = newTex;
      icTopMat.needsUpdate = true;
    }

    // Toggle switch physical lever tilt
    swLeverA.rotation.x = params.inputA ? 0.35 : -0.35;
    swLeverB.rotation.x = params.inputB ? 0.35 : -0.35;

    // LED status
    ledA.material = params.inputA ? ledCyanOn : ledLensOff;
    ledB.material = params.inputB ? ledAmberOn : ledLensOff;

    const outputState = evaluateLogic(params.gateType, params.inputA, params.inputB);
    ledQ.material = outputState ? ledGreenOn : ledLensOff;
    outputLight.intensity = outputState ? 2.5 : 0;

    // Oscilloscope update
    updateScopeScreen(outputState, params.supplyVoltage, params.frequency, simTime);

    const outVoltage = outputState ? params.supplyVoltage : 0.05;
    const propagationDelay = 8.5; // ns standard for 74LS series

    return {
      time: Number(simTime.toFixed(2)),
      val1: Number(outVoltage.toFixed(2)),
      val2: outputState ? 1 : 0,
      label1: 'Output Voltage (V)',
      label2: 'Logic State (0/1)',
    };
  }

  function dispose() {
    breadboardWhite.dispose();
    icPackageDark.dispose();
    pinSilver.dispose();
    copperGold.dispose();
    ledLensOff.dispose();
    ledCyanOn.dispose();
    ledAmberOn.dispose();
    ledGreenOn.dispose();
    shadowTex.dispose();
    shadowMat.dispose();
    scopeScreenTex.dispose();
  }

  return { group: root, update, reset, dispose };
}
