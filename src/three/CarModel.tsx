import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { ConfigState } from "../domain/types";
import { colourById } from "../data/treatments";
import type { VehicleDef } from "../domain/types";

/**
 * A deliberately abstract, brand-neutral car silhouette built from primitives.
 * No licensed GLB/GLTF was supplied with this project (see README), so the
 * studio renders a stylised placeholder whose *materials* respond faithfully
 * to every treatment — this is what the configurator is actually meant to
 * demonstrate. Swapping in a real per-vehicle GLTF later only means replacing
 * this component; the material/config wiring in Studio.tsx stays the same.
 */

interface Props {
  vehicle: VehicleDef;
  config: ConfigState;
  rotating: boolean;
  wheelsGlow: boolean;
  interiorMode: boolean;
}

function paintFor(config: ConfigState, base: string): { color: string; roughness: number; metalness: number; clearcoat: number } {
  const { film, ceramicBody } = config;
  let color = base;
  let roughness = 0.35;
  let metalness = 0.55;

  if (film.kind === "colour" && film.colourId) {
    const col = colourById(film.colourId);
    if (col) {
      color = col.id === "shift" ? (col.shiftHex ?? col.hex) : col.hex;
      if (film.finish === "satin") roughness = 0.42;
      else if (film.finish === "matte") roughness = 0.75;
      else if (film.finish === "shift") { roughness = 0.25; metalness = 0.75; }
      else roughness = 0.18;
    }
  } else if (film.kind === "clear") {
    roughness = 0.14;
  } else if (film.kind === "satin") {
    roughness = 0.4;
  } else if (film.kind === "matte") {
    roughness = 0.78;
  }

  const clearcoat = ceramicBody ? 1 : film.kind === "none" ? 0.15 : 0.4;
  if (ceramicBody) roughness = Math.max(0.08, roughness - 0.12);

  return { color, roughness, metalness, clearcoat };
}

/**
 * Renders a real GLB/GLTF vehicle (vehicle.modelUrl). Mesh names in the file
 * drive which material gets swapped, using a simple, documented convention
 * (see README "Adding real car models"):
 *   body_*  -> gets the selected paint/wrap colour + finish
 *   glass_* -> gets the selected tint
 *   wheel_* -> gets the selected wheel finish
 * Anything else (trim_*, interior_*, chrome_*…) is left exactly as authored
 * in the file. The model is auto-centred and scaled to a ~4m-long car so it
 * lines up with the studio's camera presets regardless of the source scale.
 */
function GLTFCarModel({ vehicle, config, rotating, wheelsGlow, interiorMode }: Props) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(vehicle.modelUrl!);
  const paint = useMemo(() => paintFor(config, vehicle.basePaint), [config, vehicle.basePaint]);
  const glassOpacity = config.tint === "dark" ? 0.35 : config.tint === "light" ? 0.55 : 0.72;
  const glassTintColor = config.tint === "dark" ? "#0a0c10" : config.tint === "light" ? "#1c232c" : "#20313f";
  const wheelColor = config.wheels === "none" ? "#2b2c30" : "#d8d9dc";
  const wheelRough = config.wheels === "none" ? 0.6 : 0.22;

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scale = size.x > 0 ? 4.0 / Math.max(size.x, size.z) : 1;
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center.multiplyScalar(scale));
    clone.scale.setScalar(scale);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const name = mesh.name.toLowerCase();
        if (name.startsWith("body")) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: interiorMode ? "#1c1a17" : paint.color,
            roughness: interiorMode ? 0.55 : paint.roughness,
            metalness: interiorMode ? 0.05 : paint.metalness,
            clearcoat: interiorMode ? 0 : paint.clearcoat,
            clearcoatRoughness: 0.08,
          });
        } else if (name.startsWith("glass")) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: glassTintColor,
            roughness: 0.06,
            transparent: true,
            opacity: glassOpacity,
            transmission: 0.4,
          });
        } else if (name.startsWith("wheel")) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: wheelColor,
            roughness: wheelRough,
            metalness: 0.85,
            clearcoat: wheelsGlow ? 1 : 0.2,
          });
        }
      }
    });
    return clone;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, paint, glassOpacity, glassTintColor, wheelColor, wheelRough, interiorMode, wheelsGlow]);

  useFrame((_, delta) => {
    if (rotating && group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={prepared} />
    </group>
  );
}

function ProceduralCarModel({ vehicle, config, rotating, wheelsGlow, interiorMode }: Props) {
  const group = useRef<THREE.Group>(null);
  const paint = useMemo(() => paintFor(config, vehicle.basePaint), [config, vehicle.basePaint]);

  const glassOpacity = config.tint === "dark" ? 0.35 : config.tint === "light" ? 0.55 : 0.72;
  const glassTintColor = config.tint === "dark" ? "#0a0c10" : config.tint === "light" ? "#1c232c" : "#20313f";
  const wheelColor = config.wheels === "none" ? "#2b2c30" : "#d8d9dc";
  const wheelRough = config.wheels === "none" ? 0.6 : 0.22;

  useFrame((_, delta) => {
    if (rotating && group.current) group.current.rotation.y += delta * 0.35;
  });

  const isSuv = vehicle.bodyType === "suv";
  const isCoupe = vehicle.bodyType === "coupe";
  const bodyH = isSuv ? 0.62 : isCoupe ? 0.36 : 0.42;
  const cabinH = isSuv ? 0.5 : isCoupe ? 0.34 : 0.4;
  const length = isSuv ? 4.3 : isCoupe ? 4.15 : 4.0;
  const width = 1.7;
  const bodyY = bodyH / 2 + 0.28;
  const rockerColor = "#111114";

  const bodyMat = (
    <meshPhysicalMaterial color={paint.color} roughness={paint.roughness} metalness={paint.metalness} clearcoat={paint.clearcoat} clearcoatRoughness={0.08} envMapIntensity={1.1} />
  );

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Main body */}
      <RoundedBox args={[length, bodyH, width]} radius={0.18} smoothness={4} position={[0, bodyY, 0]} castShadow receiveShadow>
        {bodyMat}
      </RoundedBox>

      {/* Hood — slight forward taper/step, reads as a distinct panel */}
      <RoundedBox
        args={[length * 0.26, bodyH * 0.7, width * 0.94]}
        radius={0.14}
        smoothness={4}
        position={[length * 0.34, bodyY + bodyH * 0.32, 0]}
        rotation={[0, 0, -0.05]}
        castShadow
      >
        {bodyMat}
      </RoundedBox>

      {/* Front & rear bumper caps */}
      <RoundedBox args={[0.34, bodyH * 0.72, width * 0.98]} radius={0.14} smoothness={4} position={[length / 2 - 0.02, bodyY - bodyH * 0.06, 0]} castShadow>
        <meshPhysicalMaterial color="#141416" roughness={0.55} metalness={0.15} clearcoat={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.3, bodyH * 0.7, width * 0.98]} radius={0.14} smoothness={4} position={[-length / 2 + 0.02, bodyY - bodyH * 0.06, 0]} castShadow>
        <meshPhysicalMaterial color="#141416" roughness={0.55} metalness={0.15} clearcoat={0.3} />
      </RoundedBox>

      {/* Rocker/sill panel — dark strip that visually lowers the car and hides the wheel-hub seam */}
      <RoundedBox args={[length * 0.78, 0.1, width + 0.02]} radius={0.04} smoothness={2} position={[0, 0.16, 0]}>
        <meshStandardMaterial color={rockerColor} roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Cabin — tapered greenhouse via two stacked volumes to fake a fastback rake */}
      <RoundedBox
        args={[length * 0.5, cabinH, width * 0.86]}
        radius={0.2}
        smoothness={4}
        position={[-0.18, bodyH + cabinH / 2 + 0.22, 0]}
        castShadow
      >
        <meshPhysicalMaterial
          color={interiorMode ? "#1c1a17" : paint.color}
          roughness={interiorMode ? 0.55 : paint.roughness}
          metalness={interiorMode ? 0.05 : paint.metalness}
          clearcoat={interiorMode ? 0 : paint.clearcoat}
        />
      </RoundedBox>
      <RoundedBox
        args={[length * 0.3, cabinH * 0.66, width * 0.82]}
        radius={0.18}
        smoothness={4}
        position={[-length * 0.16, bodyH + cabinH + 0.16, 0]}
        rotation={[0, 0, 0.09]}
        castShadow
      >
        <meshPhysicalMaterial
          color={interiorMode ? "#1c1a17" : paint.color}
          roughness={interiorMode ? 0.55 : paint.roughness}
          metalness={interiorMode ? 0.05 : paint.metalness}
          clearcoat={interiorMode ? 0 : paint.clearcoat}
        />
      </RoundedBox>

      {/* Glass band, wrapped around the whole greenhouse */}
      <RoundedBox args={[length * 0.56, cabinH * 0.6, width * 0.88]} radius={0.2} smoothness={4} position={[-0.15, bodyH + cabinH * 0.7 + 0.24, 0]}>
        <meshPhysicalMaterial color={glassTintColor} roughness={0.06} metalness={0} transparent opacity={glassOpacity} transmission={0.4} />
      </RoundedBox>

      {/* Side mirrors */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[length * 0.14, bodyH + cabinH * 0.55 + 0.22, side * (width / 2 + 0.05)]} castShadow>
          <boxGeometry args={[0.16, 0.09, 0.1]} />
          <meshPhysicalMaterial color={paint.color} roughness={paint.roughness} metalness={paint.metalness} clearcoat={paint.clearcoat} />
        </mesh>
      ))}

      {/* Wheel arches — flared cuffs around each wheel to break up the flat flank */}
      {[
        [length / 2 - 0.55, 0.92],
        [length / 2 - 0.55, -0.92],
        [-length / 2 + 0.6, 0.92],
        [-length / 2 + 0.6, -0.92],
      ].map((p, i) => (
        <mesh key={`arch-${i}`} position={[p[0], 0.42, p[1]]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.07, 12, 24, Math.PI]} />
          <meshPhysicalMaterial color={paint.color} roughness={Math.min(0.9, paint.roughness + 0.1)} metalness={paint.metalness * 0.6} clearcoat={paint.clearcoat * 0.5} />
        </mesh>
      ))}

      {/* Wheels */}
      {[
        [length / 2 - 0.55, 0.42, 0.92],
        [length / 2 - 0.55, 0.42, -0.92],
        [-length / 2 + 0.6, 0.42, 0.92],
        [-length / 2 + 0.6, 0.42, -0.92],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.32, 32]} />
            <meshStandardMaterial color="#0c0c0d" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.34, 24]} />
            <meshPhysicalMaterial color={wheelColor} roughness={wheelRough} metalness={0.85} clearcoat={wheelsGlow ? 1 : 0.2} />
          </mesh>
          {/* Spokes — thin radial bars so the wheel finish reads even at rest */}
          {[0, 1, 2, 3, 4].map((s) => (
            <mesh key={s} rotation={[0, 0, (s * Math.PI * 2) / 5]} position={[0, 0.12, 0]}>
              <boxGeometry args={[0.05, 0.24, 0.06]} />
              <meshStandardMaterial color="#1a1a1c" roughness={0.5} metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Optics */}
      <mesh position={[length / 2 + 0.02, bodyH * 0.75 + 0.28, 0.55]}>
        <boxGeometry args={[0.05, 0.14, 0.5]} />
        <meshPhysicalMaterial
          color={config.optics === "none" ? "#e9e6df" : "#fefefe"}
          roughness={config.optics === "none" ? 0.4 : 0.08}
          transmission={config.optics === "none" ? 0 : 0.3}
          clearcoat={config.optics === "none" ? 0 : 1}
        />
      </mesh>
      <mesh position={[-length / 2 - 0.02, bodyH * 0.75 + 0.28, 0.55]}>
        <boxGeometry args={[0.05, 0.12, 0.5]} />
        <meshPhysicalMaterial color={config.optics === "none" ? "#8f1219" : "#c21e28"} roughness={config.optics === "none" ? 0.4 : 0.1} clearcoat={config.optics === "none" ? 0 : 1} />
      </mesh>

      {/* Rear diffuser fins — small visual anchor so the tail doesn't read as a blunt box */}
      {[-0.5, 0, 0.5].map((z) => (
        <mesh key={z} position={[-length / 2 - 0.06, 0.14, z]}>
          <boxGeometry args={[0.04, 0.08, 0.14]} />
          <meshStandardMaterial color="#0a0a0b" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}

      {/* Exhaust tips — dual round outlets, chromed */}
      {[0.32, -0.32].map((z) => (
        <mesh key={z} position={[-length / 2 - 0.1, 0.16, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.12, 16]} />
          <meshPhysicalMaterial color="#c9cbce" roughness={0.2} metalness={0.95} clearcoat={1} />
        </mesh>
      ))}

      {/* Coupe rear spoiler — low ducktail wing */}
      {isCoupe && (
        <group position={[-length / 2 + 0.35, bodyH + cabinH * 0.4 + 0.24, 0]}>
          <mesh position={[0, 0, 0.62]} castShadow>
            <boxGeometry args={[0.32, 0.05, 0.08]} />
            {bodyMat}
          </mesh>
          <mesh position={[0, 0, -0.62]} castShadow>
            <boxGeometry args={[0.32, 0.05, 0.08]} />
            {bodyMat}
          </mesh>
          <mesh position={[0.12, -0.06, 0]} castShadow>
            <boxGeometry args={[0.06, 0.14, width * 0.82]} />
            {bodyMat}
          </mesh>
        </group>
      )}

      {/* SUV roof rails — twin bars running the length of the roof */}
      {isSuv &&
        [1, -1].map((side) => (
          <mesh key={side} position={[0.05, bodyH + cabinH + 0.28, side * width * 0.32]} castShadow>
            <boxGeometry args={[length * 0.55, 0.05, 0.05]} />
            <meshStandardMaterial color="#111114" roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
    </group>
  );
}

/** Public entry point used by StudioCanvas: real GLB when the vehicle has one, procedural placeholder otherwise. */
export function CarModel(props: Props) {
  if (props.vehicle.modelUrl) return <GLTFCarModel {...props} />;
  return <ProceduralCarModel {...props} />;
}
