import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const LegoBlock = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 0.4, 1]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3} 
        roughness={0.4}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

const LegoScene = () => {
  const blocks = [
    { pos: [-3, 0, -2] as [number, number, number], color: '#FCD34D' },
    { pos: [-1, 0, -2] as [number, number, number], color: '#FBBF24' },
    { pos: [1, 0, -2] as [number, number, number], color: '#F59E0B' },
    { pos: [3, 0, -2] as [number, number, number], color: '#D97706' },
    { pos: [-2, 0.4, -2] as [number, number, number], color: '#FBBF24' },
    { pos: [0, 0.4, -2] as [number, number, number], color: '#F59E0B' },
    { pos: [2, 0.4, -2] as [number, number, number], color: '#FCD34D' },
    { pos: [-1, 0.8, -2] as [number, number, number], color: '#D97706' },
    { pos: [1, 0.8, -2] as [number, number, number], color: '#FBBF24' },
    { pos: [0, 1.2, -2] as [number, number, number], color: '#F59E0B' },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      
      {blocks.map((block, i) => (
        <LegoBlock key={i} position={block.pos} color={block.color} />
      ))}
    </>
  );
};

export const LegoBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <LegoScene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
