import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Animated particle field that drifts and reacts subtly to pointer + scroll. */
function ParticleField({ count = 1800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const cyan = new THREE.Color('#22d3ee');
    const purple = new THREE.Color('#a855f7');
    for (let i = 0; i < count; i++) {
      const c = Math.random() > 0.6 ? purple : cyan;
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    pts.rotation.y += delta * 0.03;
    pts.rotation.x += delta * 0.008;
    // subtle pointer parallax
    const mx = state.pointer.x * 0.3;
    const my = state.pointer.y * 0.3;
    pts.rotation.y += (mx - pts.rotation.y) * 0.01;
    pts.rotation.x += (-my - pts.rotation.x) * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Wireframe icosahedron centerpiece that rotates and reacts to the pointer. */
function WireObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
      const mx = state.pointer.x;
      const my = state.pointer.y;
      meshRef.current.rotation.y += (mx * 0.6 - meshRef.current.rotation.y) * 0.02;
      meshRef.current.rotation.x += (my * 0.4 - meshRef.current.rotation.x) * 0.02;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.25;
      innerRef.current.rotation.y -= delta * 0.18;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={innerRef} scale={0.55}>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

interface SceneProps {
  variant?: 'full' | 'particles';
}

export default function Scene3D({ variant = 'full' }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.4} />
      <ParticleField count={variant === 'full' ? 2000 : 1200} />
      {variant === 'full' && <WireObject />}
    </Canvas>
  );
}
