import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'primary' | 'secondary' | 'blue';
  baseAlpha: number;
}

export const ParticleNetworkCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    // Mouse coordinates relative to canvas
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    let isDark = document.documentElement.classList.contains('dark');

    const updateColors = () => {
      isDark = document.documentElement.classList.contains('dark');
    };

    // Watch for theme toggle changes
    const themeObserver = new MutationObserver(() => {
      updateColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const initCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Particle count scaled to screen size: ~85 on desktop, ~45 on mobile
      const count = Math.floor((width * height) / 14000);
      particles = [];

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        const type: 'primary' | 'secondary' | 'blue' =
          rand < 0.25 ? 'blue' : rand < 0.65 ? 'primary' : 'secondary';
        const isBlue = type === 'blue';
        const radius = isBlue ? Math.random() * 1.5 + 1.2 : Math.random() * 1.8 + 0.8;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius,
          type,
          baseAlpha: isBlue ? 0.85 : Math.random() * 0.45 + 0.25,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', initCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    initCanvas();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently off boundaries
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Subtle interactive mouse repulsion
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          const angle = Math.atan2(dyMouse, dxMouse);
          p.x -= Math.cos(angle) * force * 1.2;
          p.y -= Math.sin(angle) * force * 1.2;
        }

        // Color based on theme
        let dotColor: string;
        if (isDark) {
          dotColor =
            p.type === 'blue'
              ? `rgba(96, 165, 250, ${p.baseAlpha})`
              : p.type === 'primary'
              ? `rgba(241, 245, 249, ${p.baseAlpha})`
              : `rgba(148, 163, 184, ${p.baseAlpha})`;
        } else {
          dotColor =
            p.type === 'blue'
              ? `rgba(37, 99, 235, ${p.baseAlpha})`
              : p.type === 'primary'
              ? `rgba(15, 23, 42, ${p.baseAlpha})`
              : `rgba(100, 116, 139, ${p.baseAlpha})`;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        // Connect nearby particles with delicate lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 115;

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.12 : 0.16);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(203, 213, 225, ${lineAlpha})`
              : `rgba(71, 85, 105, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect particles near cursor with delicate blue lines
        if (distMouse < mouse.radius * 0.85) {
          const cursorLineAlpha = (1 - distMouse / (mouse.radius * 0.85)) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isDark
            ? `rgba(96, 165, 250, ${cursorLineAlpha})`
            : `rgba(37, 99, 235, ${cursorLineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', initCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

export default ParticleNetworkCanvas;
