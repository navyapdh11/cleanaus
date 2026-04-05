'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function FloatingOrb({
  position,
  color,
  scale,
  speed,
  distort,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField({ count = 100 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#93c5fd" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#c084fc" />

      <FloatingOrb position={[-4, 2, -2]} color="#3b82f6" scale={1.5} speed={1.2} distort={0.4} />
      <FloatingOrb position={[3, -1, -3]} color="#8b5cf6" scale={1.2} speed={0.8} distort={0.3} />
      <FloatingOrb position={[0, 3, -4]} color="#06b6d4" scale={0.8} speed={1.5} distort={0.5} />
      <FloatingOrb position={[-2, -2, -1]} color="#10b981" scale={0.6} speed={1.0} distort={0.35} />
      <FloatingOrb position={[4, 1, -2]} color="#f59e0b" scale={0.5} speed={1.8} distort={0.25} />

      <ParticleField count={150} />
    </>
  );
}
