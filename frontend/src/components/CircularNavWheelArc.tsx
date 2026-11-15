import React from 'react';
import { motion } from 'framer-motion';

interface CircularNavWheelArcProps {
  activeStep: number;
  onSelectStep: (step: number) => void;
}

export const CircularNavWheelArc: React.FC<CircularNavWheelArcProps> = ({
  activeStep,
  onSelectStep,
}) => {
  // Wheel geometry: positioned far left so the arc enters gracefully
  const R = 385; // Arc radius in px
  const cx = -210; // Circle center is anchored off-screen to the left
  const cy = 300; // Vertical midpoint

  // Step angles: 6 items spaced by 16° each (0° to 80°)
  const stepAngleDelta = 16;
  const currentRotation = -activeStep * stepAngleDelta;

  const items = [
    { num: '01', angle: 0 },
    { num: '02', angle: stepAngleDelta },
    { num: '03', angle: stepAngleDelta * 2 },
    { num: '04', angle: stepAngleDelta * 3 },
    { num: '05', angle: stepAngleDelta * 4 },
    { num: '06', angle: stepAngleDelta * 5 },
  ];

  // Generate radial dial ticks spanning -68° to +72°
  const ticks = [];
  for (let a = -68; a <= 72; a += 4) {
    const isMajor = a % 12 === 0;
    const rad = (a * Math.PI) / 180;
    const rInner = isMajor ? R - 14 : R - 8;
    const rOuter = isMajor ? R + 8 : R + 4;
    ticks.push({
      angle: a,
      x1: cx + rInner * Math.cos(rad),
      y1: cy + rInner * Math.sin(rad),
      x2: cx + rOuter * Math.cos(rad),
      y2: cy + rOuter * Math.sin(rad),
      isMajor,
    });
  }

  // Calculate SVG arc path from -70° to +75°
  const startRad = (-70 * Math.PI) / 180;
  const endRad = (75 * Math.PI) / 180;
  const arcStartX = cx + R * Math.cos(startRad);
  const arcStartY = cy + R * Math.sin(startRad);
  const arcEndX = cx + R * Math.cos(endRad);
  const arcEndY = cy + R * Math.sin(endRad);
  const arcPath = `M ${arcStartX} ${arcStartY} A ${R} ${R} 0 0 1 ${arcEndX} ${arcEndY}`;

  // Concentric dashed inner arc path
  const rInnerArc = R - 20;
  const innerStartX = cx + rInnerArc * Math.cos(startRad);
  const innerStartY = cy + rInnerArc * Math.sin(startRad);
  const innerEndX = cx + rInnerArc * Math.cos(endRad);
  const innerEndY = cy + rInnerArc * Math.sin(endRad);
  const innerArcPath = `M ${innerStartX} ${innerStartY} A ${rInnerArc} ${rInnerArc} 0 0 1 ${innerEndX} ${innerEndY}`;

  // Focal point where the active number sits at 0°
  const focalX = cx + R; // 175
  const blueDotX = focalX - 26; // 149

  return (
    <div className="relative w-[220px] sm:w-[260px] h-[540px] sm:h-[600px] select-none flex items-center shrink-0">
      
      {/* ─── Stationary SVG Dial Framework ─────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 260 600"
      >
        <defs>
          <linearGradient id="wheelArcGrad6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#64748b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Outer Solid Curved Arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#wheelArcGrad6)"
          strokeWidth="1.5"
        />

        {/* Concentric Inner Dashed Guide Track */}
        <path
          d={innerArcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 7"
          className="text-zinc-300 dark:text-zinc-700"
        />

        {/* Precision Dial Tick Marks */}
        {ticks.map((t) => (
          <line
            key={t.angle}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="currentColor"
            strokeWidth={t.isMajor ? 1.5 : 0.8}
            className={
              t.isMajor
                ? 'text-zinc-400 dark:text-zinc-500'
                : 'text-zinc-300/70 dark:text-zinc-700/70'
            }
          />
        ))}

        {/* Horizontal Guideline to active focal point */}
        <line
          x1={20}
          y1={cy}
          x2={blueDotX - 10}
          y2={cy}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="text-zinc-300 dark:text-zinc-700 opacity-60"
        />

        {/* Stationary Active Focal Dot Indicator (at 0° horizon) */}
        <circle
          cx={blueDotX}
          cy={cy}
          r="4.5"
          fill="#2563eb"
          className="animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.9)]"
        />
        <circle
          cx={blueDotX}
          cy={cy}
          r="9"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </svg>

      {/* ─── Rotating Container with 6 Numbers (01 - 06) ───────────────────── */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          transformOrigin: `${cx}px ${cy}px`,
        }}
        animate={{ rotate: currentRotation }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 26,
          mass: 0.8,
        }}
      >
        {items.map((item, idx) => {
          const isActive = activeStep === idx;
          const rad = (item.angle * Math.PI) / 180;
          // Position numbers right along the outer arc radius
          const itemX = cx + (R + 6) * Math.cos(rad);
          const itemY = cy + (R + 6) * Math.sin(rad);

          return (
            <motion.button
              key={item.num}
              onClick={() => onSelectStep(idx)}
              className="absolute focus:outline-none cursor-pointer group flex items-center"
              style={{
                left: `${itemX}px`,
                top: `${itemY}px`,
                transform: `translate(0, -50%) rotate(${item.angle}deg)`,
                transformOrigin: 'left center',
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              title={`Section ${item.num}`}
            >
              {/* Clean Number Only (01, 02, 03, 04, 05, 06) */}
              <span
                className={`font-mono text-2xl sm:text-3xl tracking-tight transition-all duration-300 ${
                  isActive
                    ? 'text-zinc-950 dark:text-zinc-50 font-black scale-105'
                    : 'text-zinc-400/50 dark:text-zinc-600 font-semibold group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                }`}
              >
                {item.num}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

    </div>
  );
};

export default CircularNavWheelArc;
