import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NexusNodeProps {
  position: [number, number, number];
  color: string;
  label: string;
  value: string;
  size?: number;
  onClick?: () => void;
  link?: string;
}

function NexusNode({ position, color, label, value, size = 0.5, onClick, link }: NexusNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} onClick={handleClick} style={{ cursor: link ? 'pointer' : 'default' }}>
        {/* Outer glow */}
        <Sphere ref={glowRef} args={[size * 1.5, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </Sphere>
        
        {/* Main sphere */}
        <Sphere ref={meshRef} args={[size, 32, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
          />
        </Sphere>

        {/* Label - Make it clickable */}
        <Html position={[0, size + 0.5, 0]} center distanceFactor={8}>
          <div 
            className={cn("text-center cursor-pointer hover:opacity-80 transition-opacity", link && "pointer-events-auto")}
            onClick={link ? handleClick : undefined}
          >
            <p className="font-display text-xs text-foreground/80 whitespace-nowrap">{label}</p>
            <p className="font-mono text-sm font-bold text-primary text-glow-sm whitespace-nowrap">{value}</p>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function OrbitRing({ radius, color, speed = 1, opacity = 0.3 }: { radius: number; color: string; speed?: number; opacity?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.1;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

function DataFlowLine({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    geo.setFromPoints(points);
    return geo;
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.4,
    });
  }, [color]);

  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
}

function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.01;
      coreRef.current.rotation.z += 0.005;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.015;
      const scale = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      innerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Outer icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner sphere */}
      <Sphere ref={innerRef} args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1}
          roughness={0}
          metalness={1}
        />
      </Sphere>

      {/* Core glow */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.05} />
      </Sphere>
    </group>
  );
}

function Scene({ onNodeClick }: { onNodeClick?: (link: string) => void }) {
  const nodes = [
    { position: [3, 0.5, 0] as [number, number, number], color: "#22c55e", label: "Income", value: "USh 2.8M", link: "/transactions" },
    { position: [-2.5, 1, 1.5] as [number, number, number], color: "#00d4ff", label: "Flux Pods", value: "USh 1.2M", link: "/flux-pods" },
    { position: [-1, -1.5, 2.5] as [number, number, number], color: "#f59e0b", label: "Goals", value: "3 Active", link: "/goals" },
    { position: [1.5, -1, -2.5] as [number, number, number], color: "#a855f7", label: "Net Worth", value: "USh 8.5M", link: "/reports" },
    { position: [-2, 0, -2] as [number, number, number], color: "#ef4444", label: "Expenses", value: "USh 450K", link: "/transactions" },
  ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00d4ff" />

      {/* Central Core */}
      <CentralCore />

      {/* Orbit Rings */}
      <OrbitRing radius={2} color="#00d4ff" speed={0.5} opacity={0.2} />
      <OrbitRing radius={3.5} color="#a855f7" speed={-0.3} opacity={0.15} />
      <OrbitRing radius={5} color="#f59e0b" speed={0.2} opacity={0.1} />

      {/* Nodes */}
      {nodes.map((node, index) => (
        <NexusNode 
          key={index} 
          {...node} 
          link={node.link}
          onClick={node.link && onNodeClick ? () => onNodeClick(node.link!) : undefined}
        />
      ))}

      {/* Data Flow Lines */}
      <DataFlowLine start={[0, 0, 0]} end={nodes[0].position} color="#22c55e" />
      <DataFlowLine start={[0, 0, 0]} end={nodes[1].position} color="#00d4ff" />
      <DataFlowLine start={[0, 0, 0]} end={nodes[2].position} color="#f59e0b" />
      <DataFlowLine start={[0, 0, 0]} end={nodes[3].position} color="#a855f7" />
      <DataFlowLine start={nodes[0].position} end={nodes[4].position} color="#ef4444" />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function FinancialNexus() {
  const navigate = useNavigate();

  const handleNodeClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene onNodeClick={handleNodeClick} />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  );
}
