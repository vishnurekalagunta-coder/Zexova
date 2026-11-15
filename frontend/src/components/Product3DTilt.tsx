import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/useAnimations';

interface Product3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // 8-12 degrees per specification
  perspective?: number;
  scaleOnHover?: number; // 1.02 per specification
  enableTranslateDepth?: boolean;
}

export const Product3DTilt: React.FC<Product3DTiltProps> = ({
  children,
  className = '',
  maxRotation = 10,
  perspective = 1200,
  scaleOnHover = 1.02,
  enableTranslateDepth = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // Normalized motion values [-0.5, 0.5]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-performance spring configuration: snappy, organic Apple feel
  const springConfig = { stiffness: 280, damping: 24, mass: 0.4 };

  // 1. Mouse left (x < 0) -> rotates left (rotateY < 0)
  // 2. Mouse right (x > 0) -> rotates right (rotateY > 0)
  const targetRotateY = useTransform(x, [-0.5, 0.5], [-maxRotation, maxRotation]);
  const rotateY = useSpring(targetRotateY, springConfig);

  // 3. Mouse up (y < 0) -> tilts backward (rotateX > 0)
  // 4. Mouse down (y > 0) -> tilts forward (rotateX < 0)
  const targetRotateX = useTransform(y, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateX = useSpring(targetRotateX, springConfig);

  // Subtle 3D depth translation (moves slightly towards cursor)
  const targetTranslateX = useTransform(x, [-0.5, 0.5], enableTranslateDepth ? [-5, 5] : [0, 0]);
  const targetTranslateY = useTransform(y, [-0.5, 0.5], enableTranslateDepth ? [-5, 5] : [0, 0]);
  const translateX = useSpring(targetTranslateX, springConfig);
  const translateY = useSpring(targetTranslateY, springConfig);

  // Scale: 1.02x on hover, 1.0x on leave
  const targetScale = useMotionValue(1);
  const scale = useSpring(targetScale, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Calculate position relative to container center normalized between -0.5 and 0.5
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      x.set(mouseX);
      y.set(mouseY);
    },
    [x, y, prefersReduced]
  );

  const handleMouseEnter = useCallback(() => {
    if (prefersReduced) return;
    setIsHovered(true);
    targetScale.set(scaleOnHover);
  }, [targetScale, scaleOnHover, prefersReduced]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smoothly return to original position (0deg, 1.0x scale)
    x.set(0);
    y.set(0);
    targetScale.set(1);
  }, [x, y, targetScale]);

  // Touch device fallback: gracefully reset on touch end
  const handleTouchEnd = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouchEnd}
      style={{
        perspective: `${perspective}px`,
      }}
      className={`relative select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          scale,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        className="w-full h-full transition-shadow duration-300"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Product3DTilt;

