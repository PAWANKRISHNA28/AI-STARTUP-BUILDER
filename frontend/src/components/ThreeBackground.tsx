import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

const FloatingElements = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Parallax based on mouse movement
  useFrame((state) => {
    if (groupRef.current) {
      const targetX = (state.pointer.x * 2);
      const targetY = (state.pointer.y * 2);
      
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05 + targetX * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 - targetY * 0.1;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX * 0.2, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central AI Core / Planet */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshPhysicalMaterial 
            transmission={0.9}
            roughness={0.1}
            thickness={1.5}
            color="#E0E7FF"
            transparent
            opacity={0.9}
          />
        </Sphere>
      </Float>

      {/* Orbiting Rings */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
        <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#5B8CFF" emissive="#5B8CFF" emissiveIntensity={2} />
        </Torus>
      </Float>
      
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={0.5}>
        <Torus args={[3.2, 0.015, 16, 100]} rotation={[-Math.PI / 4, Math.PI / 6, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.5} />
        </Torus>
      </Float>

      {/* Floating Diamonds / Cubes (AI Chips) */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[0.5, 0.5, 0.5]} position={[3, 2, -2]} rotation={[Math.PI/4, Math.PI/4, 0]}>
          <meshPhysicalMaterial transmission={1} roughness={0.2} thickness={0.5} color="#2DD4BF" transparent opacity={0.9} />
        </Box>
      </Float>

      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        <Box args={[0.3, 0.3, 0.3]} position={[-4, -1, 1]} rotation={[Math.PI/4, Math.PI/4, 0]}>
          <meshPhysicalMaterial transmission={1} roughness={0.2} thickness={0.2} color="#FF74D4" transparent opacity={0.9} />
        </Box>
      </Float>

      <Float speed={1.5} rotationIntensity={3} floatIntensity={1}>
        <Box args={[0.4, 0.4, 0.4]} position={[1, -3, -3]} rotation={[Math.PI/4, Math.PI/4, 0]}>
          <meshPhysicalMaterial transmission={1} roughness={0.2} thickness={0.8} color="#FDBA74" transparent opacity={0.9} />
        </Box>
      </Float>

      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[0.2, 32, 32]} position={[-2, 3, 2]}>
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1} />
        </Sphere>
      </Float>
    </group>
  );
};

export const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-[#F9FBFF]">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9FBFF] via-[#EEF6FF] to-[#E0E7FF] opacity-90" />
      
      {/* ThreeJS Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        performance={{ min: 0.1, max: 1 }}
        frameloop="always"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#8B5CF6" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#5B8CFF" />
        
        <FloatingElements />
        
        {/* Holographic Particles - Reduced count for performance */}
        <Sparkles count={50} scale={12} size={1.5} speed={0.4} opacity={0.6} color="#5B8CFF" />
        <Sparkles count={30} scale={15} size={2} speed={0.2} opacity={0.4} color="#2DD4BF" />
        
      </Canvas>
    </div>
  );
};
