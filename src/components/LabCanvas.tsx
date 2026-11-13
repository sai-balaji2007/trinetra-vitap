/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ChemistryParams,
  ElectronicsParams,
  LabExperimentType,
  PhysicsParams,
  TelemetryPoint,
} from '../types/simulation';
import { createWorkbenchGridTexture, isSoftwareGl } from '../simulations/common';
import { createPhysicsScene, PhysicsSceneController } from '../simulations/physicsScene';
import { createChemistryScene, ChemistrySceneController } from '../simulations/chemistryScene';
import { createElectronicsScene, ElectronicsSceneController } from '../simulations/electronicsScene';

interface LabCanvasProps {
  experiment: LabExperimentType;
  physicsParams: PhysicsParams;
  chemistryParams: ChemistryParams;
  electronicsParams: ElectronicsParams;
  isPlaying: boolean;
  speedMultiplier: number;
  onTelemetryUpdate: (point: TelemetryPoint) => void;
  resetSignal: number;
  isFullscreen?: boolean;
}

export const LabCanvas: React.FC<LabCanvasProps> = ({
  experiment,
  physicsParams,
  chemistryParams,
  electronicsParams,
  isPlaying,
  speedMultiplier,
  onTelemetryUpdate,
  resetSignal,
  isFullscreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const physicsCtrlRef = useRef<PhysicsSceneController | null>(null);
  const chemistryCtrlRef = useRef<ChemistrySceneController | null>(null);
  const electronicsCtrlRef = useRef<ElectronicsSceneController | null>(null);

  // Store mutable params in refs to prevent tearing down Three.js canvas on prop updates
  const paramsRef = useRef({
    experiment,
    physicsParams,
    chemistryParams,
    electronicsParams,
    isPlaying,
    speedMultiplier,
    onTelemetryUpdate,
  });

  useEffect(() => {
    paramsRef.current = {
      experiment,
      physicsParams,
      chemistryParams,
      electronicsParams,
      isPlaying,
      speedMultiplier,
      onTelemetryUpdate,
    };
  }, [
    experiment,
    physicsParams,
    chemistryParams,
    electronicsParams,
    isPlaying,
    speedMultiplier,
    onTelemetryUpdate,
  ]);

  // Handle external reset signal
  useEffect(() => {
    if (resetSignal > 0) {
      physicsCtrlRef.current?.reset();
      chemistryCtrlRef.current?.reset();
      electronicsCtrlRef.current?.reset();
    }
  }, [resetSignal]);

  // Initialize Three.js WebGL Scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer setup adhering to Three.js skill
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);
    scene.fog = new THREE.FogExp2(0x080c14, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.5, 12.5);

    // OrbitControls with exponential damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below workbench
    controls.minDistance = 3.5;
    controls.maxDistance = 24.0;
    controls.target.set(0, 1.2, 0);

    // Studio Environment map via RoomEnvironment & PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting Rig
    // Warm directional key light with tight shadow frustum
    const keyLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 30;
      const d = 10;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool sky/ground hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.9);
    scene.add(hemiLight);

    // Subtle cyan accent rim light from back-left
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // Workbench Table Grid Surface
    const gridTex = createWorkbenchGridTexture(512);
    gridTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const benchGeo = new THREE.PlaneGeometry(36, 36);
    const benchMat = new THREE.MeshStandardMaterial({
      map: gridTex,
      roughness: 0.65,
      metalness: 0.25,
    });
    const benchMesh = new THREE.Mesh(benchGeo, benchMat);
    benchMesh.rotation.x = -Math.PI / 2;
    benchMesh.position.y = 0;
    benchMesh.receiveShadow = !isSoftwareGl;
    scene.add(benchMesh);

    // Initialize the 3 Experiment Scenes
    const physicsCtrl = createPhysicsScene();
    const chemistryCtrl = createChemistryScene();
    const electronicsCtrl = createElectronicsScene();

    physicsCtrlRef.current = physicsCtrl;
    chemistryCtrlRef.current = chemistryCtrl;
    electronicsCtrlRef.current = electronicsCtrl;

    scene.add(physicsCtrl.group);
    scene.add(chemistryCtrl.group);
    scene.add(electronicsCtrl.group);

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Animation & Pacing Loop
    let frameId = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const rawDelta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const currentParams = paramsRef.current;
      const delta = rawDelta * currentParams.speedMultiplier;

      // Toggle group visibility according to active experiment
      physicsCtrl.group.visible = currentParams.experiment === 'physics';
      chemistryCtrl.group.visible = currentParams.experiment === 'chemistry';
      electronicsCtrl.group.visible = currentParams.experiment === 'electronics';

      // Update active controller and capture telemetry
      let point: TelemetryPoint | null = null;
      if (currentParams.experiment === 'physics') {
        point = physicsCtrl.update(delta, currentParams.physicsParams, currentParams.isPlaying);
      } else if (currentParams.experiment === 'chemistry') {
        point = chemistryCtrl.update(delta, currentParams.chemistryParams, currentParams.isPlaying);
      } else if (currentParams.experiment === 'electronics') {
        point = electronicsCtrl.update(delta, currentParams.electronicsParams, currentParams.isPlaying);
      }

      if (point && currentParams.onTelemetryUpdate) {
        currentParams.onTelemetryUpdate(point);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Start loop
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (isSoftwareGl) {
        window.clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      physicsCtrl.dispose();
      chemistryCtrl.dispose();
      electronicsCtrl.dispose();
      benchGeo.dispose();
      benchMat.dispose();
      gridTex.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        isFullscreen
          ? 'h-full'
          : 'h-[360px] sm:h-[480px] md:h-[600px] lg:h-[700px]'
      } bg-[#080d1a] overflow-hidden select-none cursor-grab active:cursor-grabbing`}
    />
  );
};
