import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CarModel } from "./CarModel";
import type { ConfigState, VehicleDef } from "../domain/types";
import type { CameraPreset } from "../domain/types";

const presets: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  hero: { pos: [4.2, 1.6, 4.6], target: [0, 0.6, 0] },
  threeQuarterFront: { pos: [4.4, 1.5, 3.6], target: [0, 0.55, 0] },
  threeQuarterRear: { pos: [-4.4, 1.5, -3.6], target: [0, 0.55, 0] },
  front: { pos: [0, 1.2, 5.2], target: [0, 0.6, 0] },
  rear: { pos: [0, 1.2, -5.2], target: [0, 0.6, 0] },
  side: { pos: [5.6, 1.1, 0], target: [0, 0.6, 0] },
  top: { pos: [0.2, 6.2, 0.2], target: [0, 0.4, 0] },
  detail: { pos: [2.1, 0.8, 2.4], target: [0.9, 0.4, 0.9] },
  interior: { pos: [1.6, 1.8, 0.2], target: [-0.15, 1.0, 0] },
};

function CameraRig({ preset }: { preset: CameraPreset }) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    const p = presets[preset];
    const start = camera.position.clone();
    const startTarget = controls.current?.target.clone() ?? new THREE.Vector3(0, 0.6, 0);
    const endPos = new THREE.Vector3(...p.pos);
    const endTarget = new THREE.Vector3(...p.target);
    let raf = 0;
    const t0 = performance.now();
    const duration = 650;
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(start, endPos, ease);
      if (controls.current) {
        controls.current.target.lerpVectors(startTarget, endTarget, ease);
        controls.current.update();
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);
  return <OrbitControls ref={controls} enablePan={false} minDistance={2.6} maxDistance={9} maxPolarAngle={Math.PI / 2.05} enableDamping dampingFactor={0.12} />;
}

interface Props {
  vehicle: VehicleDef;
  config: ConfigState;
  camera: CameraPreset;
  rotating?: boolean;
  wheelsGlow?: boolean;
  interactive?: boolean;
  className?: string;
}

export function StudioCanvas({ vehicle, config, camera, rotating = false, wheelsGlow = false, interactive = true, className }: Props) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: presets[camera].pos }}
    >
      <color attach="background" args={["#0b0b0d"]} />
      <fog attach="fog" args={["#0b0b0d", 9, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight castShadow position={[4, 6, 3]} intensity={1.4} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#8fa3c8" />
      <Suspense fallback={null}>
        {/* Fully procedural studio environment — no external HDR fetch, works fully offline */}
        <Environment resolution={256} background={false}>
          <Lightformer intensity={2.2} color="#ffffff" position={[0, 6, -6]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} color="#93a6cc" position={[-6, 2, 3]} scale={[6, 6, 1]} />
          <Lightformer intensity={0.7} color="#ffffff" position={[6, 1, 4]} scale={[4, 10, 1]} />
          <Lightformer intensity={0.5} color="#ffffff" position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 1]} />
        </Environment>
        <CarModel vehicle={vehicle} config={config} rotating={rotating} wheelsGlow={wheelsGlow} interiorMode={camera === "interior"} />
        {/* Showroom floor — dark reflective slab so the car reads as sitting in a studio bay, not floating in void */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={512}
            mixBlur={1}
            mixStrength={35}
            roughness={0.92}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#0c0c0e"
            metalness={0.4}
            mirror={0.35}
          />
        </mesh>
        <ContactShadows position={[0, 0.001, 0]} opacity={0.6} scale={10} blur={2.4} far={4} />
      </Suspense>
      {interactive && <CameraRig preset={camera} />}
    </Canvas>
  );
}
