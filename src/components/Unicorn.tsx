import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SceneBoundary } from './SceneBoundary';

// A magical rainbow palette used across the mane, tail and sparkles.
const RAINBOW = ['#ff6ad5', '#c774f7', '#a855f7', '#6366f1', '#22d3ee', '#7dffb3', '#ffd479'];

/** A tapering helix curve for the spiral of the unicorn horn. */
class HornHelix extends THREE.Curve<THREE.Vector3> {
  constructor(private height: number, private radius: number, private turns: number) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = this.turns * Math.PI * 2 * t;
    const r = this.radius * (1 - t * 0.92);
    return target.set(Math.cos(angle) * r, t * this.height, Math.sin(angle) * r);
  }
}

function Horn() {
  const helix = useMemo(() => new HornHelix(1.15, 0.11, 5), []);
  return (
    <group position={[0, 0.62, 0.28]} rotation={[0.28, 0, 0]}>
      {/* Core cone */}
      <mesh castShadow>
        <coneGeometry args={[0.13, 1.15, 24, 1]} />
        <meshStandardMaterial
          color="#ffe6a3"
          emissive="#ffb648"
          emissiveIntensity={1.6}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Spiral ribbon wound around the cone */}
      <mesh position={[0, -0.575, 0]}>
        <tubeGeometry args={[helix, 160, 0.028, 10, false]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#ffcf6b"
          emissiveIntensity={2.2}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      {/* Glow tip */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fff7e0" emissive="#ffd479" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.65, 0]} color="#ffd479" intensity={3} distance={3} />
    </group>
  );
}

function Ear({ x, mirror = 1 }: { x: number; mirror?: number }) {
  return (
    <group position={[x, 0.82, -0.28]} rotation={[-0.25, 0, mirror * 0.35]}>
      <mesh castShadow>
        <coneGeometry args={[0.15, 0.42, 20]} />
        <meshPhysicalMaterial color="#f6f1ff" roughness={0.35} clearcoat={0.6} iridescence={0.5} />
      </mesh>
      <mesh position={[0, -0.02, 0.08]} scale={[0.6, 0.75, 0.6]}>
        <coneGeometry args={[0.15, 0.42, 20]} />
        <meshStandardMaterial color="#ffb0e6" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Eye({ x }: { x: number }) {
  return (
    <group position={[x, 0.24, 0.3]}>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color="#1a0b2e" roughness={0.05} metalness={0.3} />
      </mesh>
      <mesh position={[0.04, 0.045, 0.09]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      {/* Long lashes hint */}
      <mesh position={[0.02, 0.12, 0.02]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.16, 0.015, 0.02]} />
        <meshStandardMaterial color="#2a1240" />
      </mesh>
    </group>
  );
}

function Mane() {
  const group = useRef<THREE.Group>(null);
  // A cascade of rounded tufts flowing down the back of the neck.
  const tufts = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number; color: string; phase: number }[] = [];
    const rows = 9;
    for (let i = 0; i < rows; i++) {
      const t = i / (rows - 1);
      const y = 0.78 - t * 2.0;
      const z = -0.42 - t * 0.55;
      const spread = 0.16 + t * 0.12;
      const perRow = 3;
      for (let j = 0; j < perRow; j++) {
        const x = (j - (perRow - 1) / 2) * spread;
        items.push({
          pos: [x, y, z],
          scale: 0.26 + (1 - t) * 0.12 - Math.abs(j - 1) * 0.03,
          color: RAINBOW[(i + j) % RAINBOW.length],
          phase: i * 0.6 + j,
        });
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, idx) => {
      const t = tufts[idx];
      if (!t) return;
      child.position.x = t.pos[0] + Math.sin(time * 1.4 + t.phase) * 0.05;
      child.position.z = t.pos[2] + Math.cos(time * 1.1 + t.phase) * 0.04;
    });
  });

  return (
    <group ref={group}>
      {tufts.map((t, i) => (
        <mesh key={i} position={t.pos} scale={t.scale} castShadow>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial
            color={t.color}
            emissive={t.color}
            emissiveIntensity={0.55}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
      ))}
      {/* Forelock between the ears */}
      {[0, 1, 2].map((i) => (
        <mesh key={`f${i}`} position={[(i - 1) * 0.13, 0.86, 0.02]} scale={0.16}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={RAINBOW[i]} emissive={RAINBOW[i]} emissiveIntensity={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function UnicornHead() {
  const Pearl = () => (
    <meshPhysicalMaterial
      color="#f8f4ff"
      roughness={0.28}
      metalness={0.12}
      clearcoat={0.7}
      clearcoatRoughness={0.25}
      iridescence={0.7}
      iridescenceIOR={1.35}
      sheen={0.6}
      sheenColor="#ffd6f5"
    />
  );

  return (
    <group>
      {/* Skull */}
      <mesh position={[0, 0.2, -0.2]} scale={[0.78, 0.82, 0.9]} castShadow>
        <sphereGeometry args={[1, 48, 48]} />
        <Pearl />
      </mesh>
      {/* Cheek / jaw bridge */}
      <mesh position={[0, -0.02, 0.18]} scale={[0.62, 0.62, 0.66]} castShadow>
        <sphereGeometry args={[1, 40, 40]} />
        <Pearl />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0, -0.24, 0.62]} scale={[0.42, 0.42, 0.7]} castShadow>
        <sphereGeometry args={[1, 40, 40]} />
        <Pearl />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.34, 1.08]} scale={[0.34, 0.3, 0.34]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <Pearl />
      </mesh>
      {/* Nostrils */}
      <mesh position={[0.12, -0.34, 1.22]} scale={0.05}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#2a1240" />
      </mesh>
      <mesh position={[-0.12, -0.34, 1.22]} scale={0.05}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#2a1240" />
      </mesh>

      <Eye x={0.44} />
      <Eye x={-0.44} />
      <Ear x={0.34} mirror={1} />
      <Ear x={-0.34} mirror={-1} />
      <Horn />
      <Mane />

      {/* Neck */}
      <mesh position={[0, -1.15, -0.75]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.78, 1.7, 40, 1, true]} />
        <Pearl />
      </mesh>
    </group>
  );
}

function UnicornRig() {
  const rig = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!rig.current) return;
    // Gentle idle motion — breathing + slight look-around.
    rig.current.rotation.y = Math.sin(t * 0.25) * 0.3 + 0.35;
    rig.current.rotation.x = Math.sin(t * 0.4) * 0.04;
    rig.current.position.y = Math.sin(t * 0.8) * 0.06;
  });
  return (
    <group ref={rig} position={[0, 0.15, 0]}>
      <UnicornHead />
    </group>
  );
}

function SceneContents() {
  return (
    <>
      <color attach="background" args={['#070311']} />
      <fog attach="fog" args={['#0c0620', 6, 16]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#b892ff', '#1a0b2e', 0.7]} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff0fb" castShadow />
      <pointLight position={[-4, 1, 3]} intensity={2.4} color="#22d3ee" distance={14} />
      <pointLight position={[4, -1, 2]} intensity={2.2} color="#ff6ad5" distance={14} />
      <spotLight position={[0, 6, 2]} angle={0.5} penumbra={0.8} intensity={1.4} color="#a855f7" />

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <UnicornRig />
      </Float>

      <Sparkles count={80} scale={[9, 6, 6]} size={3} speed={0.4} color="#ffd479" opacity={0.8} />
      <Sparkles count={60} scale={[8, 6, 5]} size={2} speed={0.3} color="#22d3ee" opacity={0.6} />
      <Stars radius={40} depth={30} count={1200} factor={3} saturation={0.6} fade speed={0.6} />

      <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={12} blur={2.6} far={4} color="#a855f7" />

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.3} radius={0.7} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

function CssFallback() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-magic-pink via-magic-violet to-magic-cyan blur-2xl opacity-60 animate-pulse-glow" />
      <div className="relative text-8xl animate-float drop-shadow-[0_0_35px_rgba(168,85,247,0.8)]">🦄</div>
    </div>
  );
}

export default function Unicorn() {
  return (
    <SceneBoundary fallback={<CssFallback />}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContents />
      </Canvas>
    </SceneBoundary>
  );
}
