import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ChartData {
  label: string;
  value: number;
}

interface Chart3DProps {
  data: ChartData[];
  maxValue?: number;
}

export const Chart3D: React.FC<Chart3DProps> = ({ data, maxValue = 100 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating animation for the whole chart
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  const barWidth = 0.8;
  const spacing = 1.2;
  const totalWidth = (data.length - 1) * spacing;
  const startX = -totalWidth / 2;

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Base Platform */}
      <Box args={[totalWidth + 2, 0.2, 2]} position={[0, -0.1, 0]}>
        <meshPhysicalMaterial 
          color="#0f172a" 
          metalness={0.8} 
          roughness={0.2} 
          transparent 
          opacity={0.8} 
        />
      </Box>

      {/* Bars */}
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 5; // Scale height (max 5 units)
        const xPos = startX + index * spacing;
        const color = index % 2 === 0 ? '#4F46E5' : '#06B6D4';

        return (
          <group key={index} position={[xPos, 0, 0]}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
              {/* The actual Bar */}
              <Box args={[barWidth, height, barWidth]} position={[0, height / 2, 0]}>
                <meshStandardMaterial 
                  color={color} 
                  emissive={color} 
                  emissiveIntensity={0.5} 
                  transparent 
                  opacity={0.85} 
                />
              </Box>
            </Float>
            
            {/* Value Label (Top) */}
            <Text
              position={[0, height + 0.5, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {item.value}
            </Text>
            
            {/* X-Axis Label (Bottom) */}
            <Text
              position={[0, -0.6, 0]}
              fontSize={0.25}
              color="#9ca3af"
              anchorX="center"
              anchorY="middle"
            >
              {item.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
