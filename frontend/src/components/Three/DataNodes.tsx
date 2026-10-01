import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const DataNodes = ({ count = 20 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate random positions for the nodes
  const nodes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      ),
      color: Math.random() > 0.5 ? '#4F46E5' : '#06B6D4' // primary / secondary
    }));
  }, [count]);

  // Generate connections between nearby nodes
  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 5) {
          lines.push([nodes[i].position, nodes[j].position]);
        }
      }
    }
    return lines;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.5} color="#4F46E5" />

      <group ref={groupRef}>
        {/* Render connections */}
        {connections.map((points, idx) => (
          <Line
            key={`line-${idx}`}
            points={points}
            color="#4F46E5"
            lineWidth={0.5}
            transparent
            opacity={0.15}
          />
        ))}

        {/* Render nodes */}
        {nodes.map((node, i) => (
          <Float key={`node-${i}`} speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere args={[0.15, 16, 16]} position={node.position}>
              <meshStandardMaterial 
                color={node.color} 
                emissive={node.color} 
                emissiveIntensity={2} 
                toneMapped={false} 
              />
            </Sphere>
          </Float>
        ))}
      </group>
    </>
  );
};
