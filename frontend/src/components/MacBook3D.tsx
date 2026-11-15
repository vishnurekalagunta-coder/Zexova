import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// Procedural screen texture showing macOS Sequoia wallpaper with ZEXOVA interface
function createScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Elegant deep cosmic gradient background
    const bg = ctx.createLinearGradient(0, 0, 1024, 640);
    bg.addColorStop(0, '#0a0d1a');
    bg.addColorStop(0.3, '#101633');
    bg.addColorStop(0.65, '#0d1326');
    bg.addColorStop(1, '#05070d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 640);

    // Subtle ambient light orbs (Electric Blue & Amber)
    const orb1 = ctx.createRadialGradient(250, 200, 10, 250, 200, 320);
    orb1.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    orb1.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
    orb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, 1024, 640);

    const orb2 = ctx.createRadialGradient(800, 420, 20, 800, 420, 360);
    orb2.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
    orb2.addColorStop(0.6, 'rgba(236, 72, 153, 0.15)');
    orb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, 1024, 640);

    // Top macOS Menu Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, 0, 1024, 28);

    // Apple Logo & Menu items
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('', 18, 18);
    ctx.font = '500 11px system-ui, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Zexova Studio', 40, 18);
    ctx.fillText('Products', 135, 18);
    ctx.fillText('3D View', 198, 18);
    ctx.fillText('Marketplace', 255, 18);

    // Right menu icons / battery / clock
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('⚡ 100%   Mon 8 Nov   8:45 PM', 820, 18);

    // Center Window: ZEXOVA Luxury Store Interface
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(80, 65, 864, 490, 16);
    ctx.fill();
    ctx.stroke();

    // Window control buttons (Red, Yellow, Green)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(102, 85, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.beginPath(); ctx.arc(118, 85, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(134, 85, 5, 0, Math.PI * 2); ctx.fill();

    // ZEXOVA Header inside window
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px system-ui, sans-serif';
    ctx.fillText('Z E X O V A', 160, 92);

    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('MACBOOK PRO 16" • M3 MAX SILICON', 160, 115);

    // Main Showcase Text inside mock window
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 32px system-ui, sans-serif';
    ctx.fillText('Scary Fast. Masterfully Built.', 160, 185);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 14px system-ui, sans-serif';
    ctx.fillText('The most advanced Mac chips ever built. Up to 128GB unified memory,', 160, 220);
    ctx.fillText('Liquid Retina XDR with 1,600 nits peak brightness, and 22 hours of battery life.', 160, 245);

    // Feature chips inside screen
    const chips = ['M3 Max 16-Core', '40-Core GPU', '128GB Unified RAM', '8TB Storage'];
    chips.forEach((c, i) => {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.roundRect(160 + i * 165, 280, 150, 44, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(c, 175 + i * 165, 307);
    });

    // Price tag inside mockup screen
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 34px system-ui, sans-serif';
    ctx.fillText('₹2,49,900', 160, 400);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 16px system-ui, sans-serif';
    ctx.fillText('MRP ₹2,89,900', 345, 395);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('SAVE 14% • In Stock at ZEXOVA', 345, 415);

    // Bottom dock representation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.roundRect(362, 575, 300, 48, 16);
    ctx.fill();

    // Dock app icons
    const dockColors = ['#38bdf8', '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];
    dockColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(380 + i * 42, 584, 30, 30, 8);
      ctx.fill();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// Keyboard key layout texture
function createKeyboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    // Draw keyboard rows
    const rows = 5;
    const cols = 14;
    const keyW = 32;
    const keyH = 36;
    const gap = 3;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 12 + c * (keyW + gap);
        const y = 14 + r * (keyH + gap);
        ctx.beginPath();
        ctx.roundRect(x, y, keyW, keyH, 4);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Spacebar
    ctx.beginPath();
    ctx.roundRect(145, 14 + 5 * (keyH + gap), 220, keyH, 4);
    ctx.fill();
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

// The Realistic 3D MacBook Pro Component
export const MacBookModel: React.FC<{ isOpen?: boolean }> = ({ isOpen = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hingeRef = useRef<THREE.Group>(null);

  // Materials & Textures
  const screenTexture = useMemo(() => createScreenTexture(), []);
  const keyboardTexture = useMemo(() => createKeyboardTexture(), []);

  // Metallic Space Gray Body Material
  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#262930', // Deep Space Black/Gray
        metalness: 0.88,
        roughness: 0.22,
        envMapIntensity: 1.2,
      }),
    []
  );

  // Keyboard Well Material
  const keyboardWellMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#15171c',
        metalness: 0.6,
        roughness: 0.45,
      }),
    []
  );

  // Trackpad Glass Material
  const trackpadMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d313b',
        metalness: 0.75,
        roughness: 0.18,
      }),
    []
  );

  // Black Bezel Material
  const bezelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#08090b',
        metalness: 0.3,
        roughness: 0.1,
      }),
    []
  );

  // Screen Emissive Material
  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: screenTexture,
        roughness: 0.08,
        metalness: 0.1,
        emissive: '#ffffff',
        emissiveMap: screenTexture,
        emissiveIntensity: 0.42,
      }),
    [screenTexture]
  );

  // Animate opening of lid on mount + continuous subtle bobbing
  useFrame((state, delta) => {
    // Smooth opening of screen lid
    if (hingeRef.current) {
      const targetAngle = isOpen ? -1.88 : 0; // ~108 degrees open
      hingeRef.current.rotation.x = THREE.MathUtils.damp(
        hingeRef.current.rotation.x,
        targetAngle,
        3.5,
        delta
      );
    }

    // Continuous subtle turntable & floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.4) * 0.18 - 0.22,
        2.0,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} rotation={[0.22, -0.22, 0]}>
      
      {/* ========================================================
          1. BOTTOM BASE CHASSIS
      ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Main Aluminum Unibody Base */}
        <mesh position={[0, 0, 0]} material={metalMaterial} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.12, 2.45]} />
        </mesh>

        {/* Recessed Keyboard Bed */}
        <mesh position={[0, 0.065, -0.28]} material={keyboardWellMaterial}>
          <boxGeometry args={[3.1, 0.005, 1.35]} />
        </mesh>

        {/* Keyboard Keys Layer */}
        <mesh position={[0, 0.07, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.05, 1.3]} />
          <meshStandardMaterial
            map={keyboardTexture}
            roughness={0.4}
            metalness={0.2}
            color="#0b0f19"
          />
        </mesh>

        {/* Large Force Touch Glass Trackpad */}
        <mesh position={[0, 0.065, 0.68]} material={trackpadMaterial}>
          <boxGeometry args={[1.35, 0.006, 0.88]} />
        </mesh>

        {/* Left Speaker Grill */}
        <mesh position={[-1.62, 0.063, -0.28]} material={keyboardWellMaterial}>
          <boxGeometry args={[0.14, 0.002, 1.3]} />
        </mesh>

        {/* Right Speaker Grill */}
        <mesh position={[1.62, 0.063, -0.28]} material={keyboardWellMaterial}>
          <boxGeometry args={[0.14, 0.002, 1.3]} />
        </mesh>

        {/* Front Thumb Indentation to open lid */}
        <mesh position={[0, 0.045, 1.22]} material={keyboardWellMaterial}>
          <boxGeometry args={[0.5, 0.03, 0.02]} />
        </mesh>

        {/* Bottom rubber feet */}
        {[-1.5, 1.5].map((x) =>
          [-1.0, 1.0].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.065, z]}>
              <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
              <meshBasicMaterial color="#111317" />
            </mesh>
          ))
        )}
      </group>

      {/* ========================================================
          2. HINGE & TOP SCREEN DISPLAY LID (ANIMATED ROTATION)
      ======================================================== */}
      <group ref={hingeRef} position={[0, 0.06, -1.22]}>
        
        {/* Hinge Cylinder */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={metalMaterial}>
          <cylinderGeometry args={[0.04, 0.04, 3.2, 16]} />
        </mesh>

        {/* Top Display Enclosure (Extending up from hinge) */}
        <group position={[0, 0, 1.22]}>
          
          {/* Aluminum Outer Shell / Back Lid */}
          <mesh position={[0, 0.04, 0]} material={metalMaterial} castShadow>
            <boxGeometry args={[3.6, 0.05, 2.44]} />
          </mesh>

          {/* Glowing Apple Logo on Back of Lid */}
          <mesh position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.14, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.6}
              roughness={0.1}
            />
          </mesh>

          {/* Glossy Black Display Front Bezel */}
          <mesh position={[0, 0.014, 0]} material={bezelMaterial}>
            <boxGeometry args={[3.55, 0.004, 2.4]} />
          </mesh>

          {/* Camera Notch at top */}
          <mesh position={[0, 0.018, 1.15]} material={bezelMaterial}>
            <boxGeometry args={[0.22, 0.005, 0.06]} />
          </mesh>
          <mesh position={[0, 0.021, 1.16]}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>

          {/* High-Resolution Retina Screen Surface */}
          <mesh position={[0, 0.017, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.45, 2.24]} />
            <primitive object={screenMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Subtle soft contact shadow underneath the MacBook */}
      <ContactShadows
        position={[0, -0.65, 0]}
        opacity={0.65}
        scale={6}
        blur={2.4}
        far={3.5}
      />
    </group>
  );
};

// Canvas wrapper with studio lighting and mouse orbital control
export const MacBookCanvas: React.FC<{ isOpen?: boolean }> = ({ isOpen = true }) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 42 }}
        shadows
        dpr={[1, 2]} // Crisp rendering on high-DPI displays
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.8} />

        {/* Directional Key Light (Warm soft white) */}
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />

        {/* Futuristic Electric Blue / Cyan Rim Light */}
        <directionalLight
          position={[-6, 4, -4]}
          intensity={2.8}
          color="#38bdf8"
        />

        {/* Soft Indigo Fill Light from underneath */}
        <pointLight position={[0, -2, 2]} intensity={0.9} color="#6366f1" />

        {/* Subtle Top White Overhead Light */}
        <pointLight position={[0, 4, 0]} intensity={1.2} color="#ffffff" />

        {/* Presentation controls for smooth mouse interaction without camera disorientation */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 350 }}
          snap={{ mass: 3, tension: 250 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 8, Math.PI / 8]} // Up/down tilt boundary
          azimuth={[-Math.PI / 4, Math.PI / 4]} // Left/right turn boundary
        >
          <Float
            speed={1.6}
            rotationIntensity={0.3}
            floatIntensity={0.4}
            floatingRange={[-0.08, 0.08]}
          >
            <MacBookModel isOpen={isOpen} />
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  );
};

export default MacBookCanvas;
