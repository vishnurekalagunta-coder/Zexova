/**
 * ZEXOVA Premium Animation Utilities
 * Apple-style cinematic scroll animations — GPU-accelerated, 60fps, reduced-motion aware
 */

import { useEffect, useState } from 'react';
import { Variants } from 'framer-motion';

// ─── Reduced Motion Hook ───────────────────────────────────────────────────────
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// ─── Premium Easing Curves (Apple-inspired) ───────────────────────────────────
export const ease = {
  /** Smooth deceleration — snappy entry */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Gentle acceleration then deceleration */
  inOut: [0.45, 0, 0.55, 1] as [number, number, number, number],
  /** Cinematic spring-like ease */
  spring: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  /** Ultra-smooth luxury ease */
  luxury: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ─── Shared Viewport Config ────────────────────────────────────────────────────
export const viewport = {
  once: true,
  margin: '-80px 0px',
};

export const viewportNear = {
  once: true,
  margin: '-40px 0px',
};

// ─── Fade Up (Primary text/card entry) ────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.luxury },
  },
};

export const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 40, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: ease.luxury },
  },
};

// ─── Fade In (opacity only) ────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0, willChange: 'opacity' },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: ease.out },
  },
};

// ─── Slide In from Left / Right ────────────────────────────────────────────────
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: ease.luxury },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: ease.luxury },
  },
};

// ─── Stagger Container ─────────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.02,
    },
  },
};

// ─── Scale Up (cards, images) ──────────────────────────────────────────────────
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: ease.luxury },
  },
};

// ─── Section Header (badge + headline combo) ───────────────────────────────────
export const headerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0,
    },
  },
};

export const headerBadge: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: ease.luxury },
  },
};

export const headerTitle: Variants = {
  hidden: { opacity: 0, y: 22, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.luxury },
  },
};

export const headerSubtitle: Variants = {
  hidden: { opacity: 0, y: 16, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: ease.luxury, delay: 0.05 },
  },
};

// ─── Card Item (for grid items within stagger) ────────────────────────────────
export const cardItem: Variants = {
  hidden: { opacity: 0, y: 24, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.luxury },
  },
};

export const cardItemScale: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97, willChange: 'transform, opacity' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: ease.luxury },
  },
};

