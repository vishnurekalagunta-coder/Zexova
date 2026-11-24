import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Maximize2, Sparkles, ShieldCheck, Clock, Droplets, Compass } from 'lucide-react';
import LaptopCodeEditor from './LaptopCodeEditor';
import Product3DTilt from './Product3DTilt';
import { usePrefersReducedMotion } from '../hooks/useAnimations';

export type ProductId = 'laptop' | 'phone' | 'tv' | 'earbuds' | 'watch';
export type SlotId = 'center' | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const budsVideoRef = useRef<HTMLVideoElement>(null);
  const budsVideoDarkRef = useRef<HTMLVideoElement>(null);
  const watchVideoRef = useRef<HTMLVideoElement>(null);
  const watchVideoDarkRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Ensure buds and watch videos autoplay reliably and remain perfectly time-synchronized across themes
  React.useEffect(() => {
    const lightVid = budsVideoRef.current;
    const darkVid = budsVideoDarkRef.current;
    const watchLight = watchVideoRef.current;
    const watchDark = watchVideoDarkRef.current;

    if (lightVid) lightVid.play().catch(() => {});
    if (darkVid) darkVid.play().catch(() => {});
    if (watchLight) watchLight.play().catch(() => {});
    if (watchDark) watchDark.play().catch(() => {});

    // Continuously sync playback time so theme toggling has zero jump or blink
    let syncTimer: number;
    const syncVideos = () => {
      if (lightVid && darkVid && !lightVid.paused) {
        if (Math.abs(lightVid.currentTime - darkVid.currentTime) > 0.04) {
          darkVid.currentTime = lightVid.currentTime;
        }
      }
      if (watchLight && watchDark && !watchLight.paused) {
        if (Math.abs(watchLight.currentTime - watchDark.currentTime) > 0.04) {
          watchDark.currentTime = watchLight.currentTime;
        }
      }
      syncTimer = requestAnimationFrame(syncVideos);
    };

    syncTimer = requestAnimationFrame(syncVideos);

    return () => {
      cancelAnimationFrame(syncTimer);
    };
  }, []);

  // ─── Slot Assignment State: Track which product is in which slot ───────────
  const [productSlots, setProductSlots] = useState<Record<ProductId, SlotId>>({
    laptop: 'center',
    phone: 'topLeft',
    tv: 'topRight',
    earbuds: 'bottomRight',
    watch: 'bottomLeft',
  });

  // Track the simultaneous swapping pair for 3D flight rotation flair
  const [swapping, setSwapping] = useState<{
    incoming: ProductId | null;
    outgoing: ProductId | null;
  }>({ incoming: null, outgoing: null });

  // ─── Simultaneous Position-Swapping Handler ────────────────────────────────
  const handleViewBig = useCallback(
    (clickedId: ProductId) => {
      const currentSlot = productSlots[clickedId];
      if (currentSlot === 'center') return; // Already main featured

      // Find the product currently occupying 'center'
      const currentCenterId = (Object.keys(productSlots) as ProductId[]).find(
        (id) => productSlots[id] === 'center'
      ) || 'laptop';

      // Set swapping pair for 3D trajectory flair
      setSwapping({
        incoming: clickedId,
        outgoing: currentCenterId,
      });

      // Simultaneously exchange positions:
      // The clicked product travels to 'center', and previous center product travels to clicked product's slot!
      setProductSlots((prev) => ({
        ...prev,
        [clickedId]: 'center',
        [currentCenterId]: currentSlot,
      }));

      // Reset swapping flair after animation completes
      setTimeout(() => {
        setSwapping({ incoming: null, outgoing: null });
      }, 1100);
    },
    [productSlots]
  );

  // ─── Parallax Scroll Tracking ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.0001,
  });

  const scrollParallaxY = useTransform(smoothProgress, [0, 1], prefersReduced ? [0, 0] : [0, -45]);
  const scrollOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.8]);

  // ─── Slot Class Helpers for Responsive Grid ────────────────────────────────
  // On desktop (md:): 12-column grid
  // On mobile: 2-column grid
  const getSlotGridClasses = (slot: SlotId): string => {
    switch (slot) {
      case 'center':
        return 'col-span-2 row-start-1 md:col-start-4 md:col-end-10 md:row-start-1 md:row-end-3 md:translate-y-4 lg:translate-y-6 xl:translate-y-8 flex flex-col items-center justify-center';
      case 'topLeft':
        return 'col-start-1 row-start-2 md:col-start-1 md:col-end-4 md:row-start-1 md:row-end-2 flex flex-col items-center md:items-start justify-start py-1 lg:py-2 md:translate-x-1.5 lg:translate-x-3';
      case 'topRight':
        return 'col-start-2 row-start-2 md:col-start-10 md:col-end-13 md:row-start-1 md:row-end-2 flex flex-col items-center md:items-end justify-start py-1 lg:py-2';
      case 'bottomLeft':
        return 'col-start-1 row-start-3 md:col-start-1 md:col-end-4 md:row-start-2 md:row-end-3 flex flex-col items-center md:items-start justify-end py-1 lg:py-2 md:translate-x-1.5 lg:translate-x-3';
      case 'bottomRight':
        return 'col-start-2 row-start-3 md:col-start-10 md:col-end-13 md:row-start-2 md:row-end-3 flex flex-col items-center md:items-end justify-end py-1 lg:py-2 md:mr-4 lg:mr-8';
    }
  };

  // ─── Helper for View Big Action Button / Badge ─────────────────────────────
  const renderSlotControl = (productId: ProductId, slot: SlotId, label: string) => {
    const isCenter = slot === 'center';
    return (
      <div className="flex items-center justify-center mt-2.5 z-20">
        {isCenter ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/90 dark:bg-white/90 text-white dark:text-zinc-950 text-[10px] sm:text-[11px] font-black tracking-wide shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">{label} Featured</span>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewBig(productId);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#18181b]/95 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-white/15 text-[10px] sm:text-[11px] font-bold tracking-wide shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group/btn"
            title={`Exchange position with main view to view ${label} big`}
          >
            <Maximize2 className="w-3 h-3 text-sky-500 group-hover/btn:text-white dark:group-hover/btn:text-black transition-colors" />
            <span>View Big</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: scrollParallaxY, opacity: scrollOpacity }}
      initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full pt-3 sm:pt-4 md:pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-hidden bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors flex flex-col items-center justify-start select-none"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =====================================================================
            UNIFIED RESPONSIVE SHOWCASE GRID:
            All 4 products reside in this single grid container.
            When any product is clicked, Framer Motion FLIP coordinates smoothly
            exchange positions simultaneously with 3D physical movement.
            ===================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-12 items-center gap-4 lg:gap-8 min-h-[500px] md:min-h-[520px] lg:min-h-[580px] xl:min-h-[620px] relative w-full">

          {/* ════════════════════════════════════════════════════════════════════
              1. LAPTOP COMPONENT (Dynamic Code Typing IDE + Realistic Frame)
              ════════════════════════════════════════════════════════════════════ */}
          {(() => {
            const slot = productSlots.laptop;
            const isCenter = slot === 'center';
            const isIncoming = swapping.incoming === 'laptop';
            const isOutgoing = swapping.outgoing === 'laptop';

            return (
              <motion.div
                layout
                transition={{
                  layout: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                animate={
                  isIncoming
                    ? { rotateY: [0, -7, 0], rotateX: [0, 3, 0], scale: [1, 1.04, 1], zIndex: 40 }
                    : isOutgoing
                    ? { rotateY: [0, 7, 0], rotateX: [0, -3, 0], scale: [1, 0.96, 1], zIndex: 20 }
                    : { rotateY: 0, rotateX: 0, scale: 1, zIndex: isCenter ? 30 : 10 }
                }
                className={`${getSlotGridClasses(slot)} ${!isCenter ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                  if (!isCenter) handleViewBig('laptop');
                }}
              >
                <div
                  className={`relative w-full transition-all duration-700 ease-out ${
                    isCenter
                      ? 'max-w-[460px] md:max-w-[480px] lg:max-w-[580px] xl:max-w-[660px] 2xl:max-w-[700px]'
                      : 'max-w-[240px] md:max-w-[250px] lg:max-w-[300px] xl:max-w-[340px]'
                  }`}
                >
                  <Product3DTilt maxRotation={isCenter ? 8 : 10} className="w-full">
                    <div className="relative w-full aspect-[1.5/1]">
                      {/* ZEXOVA Dynamic Code Typing Display Inside Laptop Screen */}
                      <div
                        className="absolute rounded-[2px] sm:rounded-[3px] overflow-hidden bg-[#0f1117] flex flex-col pointer-events-none border border-black/40 shadow-inner"
                        style={{
                          top: '7.3%',
                          left: '16.3%',
                          width: '67.4%',
                          height: '64.0%',
                        }}
                      >
                        <LaptopCodeEditor />
                      </div>

                      {/* Laptop Mockup Frame Overlay */}
                      <img
                        src="/laptop-hero.png"
                        alt="ZEXOVA Laptop"
                        className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_22px_44px_rgba(0,0,0,0.85)]"
                        draggable={false}
                      />
                    </div>
                  </Product3DTilt>

                  {/* Floor / Base Shadow */}
                  <div
                    className={`mx-auto -mt-2 rounded-[100%] bg-zinc-900/10 dark:bg-black/80 blur-md pointer-events-none transition-all duration-700 ${
                      isCenter ? 'w-4/5 h-3' : 'w-3/4 h-2'
                    }`}
                  />

                  {/* View Big Action Button / Active Badge */}
                  {renderSlotControl('laptop', slot, 'Laptop')}
                </div>
              </motion.div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════════
              2. MOBILE PHONE COMPONENT (Video Screen + Dark Silver Metallic)
              ════════════════════════════════════════════════════════════════════ */}
          {(() => {
            const slot = productSlots.phone;
            const isCenter = slot === 'center';
            const isIncoming = swapping.incoming === 'phone';
            const isOutgoing = swapping.outgoing === 'phone';

            return (
              <motion.div
                layout
                transition={{
                  layout: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                animate={
                  isIncoming
                    ? { rotateY: [0, -8, 0], rotateX: [0, 4, 0], scale: [1, 1.05, 1], zIndex: 40 }
                    : isOutgoing
                    ? { rotateY: [0, 8, 0], rotateX: [0, -4, 0], scale: [1, 0.95, 1], zIndex: 20 }
                    : { rotateY: 0, rotateX: 0, scale: 1, zIndex: isCenter ? 30 : 10 }
                }
                className={`${getSlotGridClasses(slot)} ${!isCenter ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                  if (!isCenter) handleViewBig('phone');
                }}
              >
                <div
                  className={`relative w-full transition-all duration-700 ease-out ${
                    isCenter
                      ? 'max-w-[420px] md:max-w-[460px] lg:max-w-[540px] xl:max-w-[620px]'
                      : 'max-w-[250px] md:max-w-[250px] lg:max-w-[320px] xl:max-w-[360px] 2xl:max-w-[380px]'
                  }`}
                >
                  <Product3DTilt maxRotation={10} className="w-full">
                    <div className="relative w-full aspect-[2.028/1]">
                      {/* Phone Inner Screen Display with Autoplaying Video */}
                      <div
                        className="absolute z-0 rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] overflow-hidden bg-black pointer-events-none"
                        style={{
                          top: '8.8%',
                          left: '4.9%',
                          width: '90.2%',
                          height: '82.5%',
                        }}
                      >
                        <video
                          src="/video1.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Phone Frame PNG with Dark Silver Metallic Edges */}
                      <img
                        src="/phone-hero.png"
                        alt="ZEXOVA Smartphone"
                        className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_0_1.5px_rgba(175,180,192,0.65)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)]"
                        draggable={false}
                      />
                    </div>
                  </Product3DTilt>

                  {/* Floor Shadow */}
                  <div
                    className={`mx-auto -mt-1 rounded-[100%] bg-zinc-900/10 dark:bg-black/60 blur-sm pointer-events-none transition-all duration-700 ${
                      isCenter ? 'w-4/5 h-2.5' : 'w-4/5 h-2'
                    }`}
                  />

                  {/* View Big Action Button / Active Badge */}
                  {renderSlotControl('phone', slot, 'Phone')}
                </div>
              </motion.div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════════
              3. TELEVISION COMPONENT (Video Display + Light/Dark Frame)
              ════════════════════════════════════════════════════════════════════ */}
          {(() => {
            const slot = productSlots.tv;
            const isCenter = slot === 'center';
            const isIncoming = swapping.incoming === 'tv';
            const isOutgoing = swapping.outgoing === 'tv';

            return (
              <motion.div
                layout
                transition={{
                  layout: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                animate={
                  isIncoming
                    ? { rotateY: [0, -7, 0], rotateX: [0, 3, 0], scale: [1, 1.04, 1], zIndex: 40 }
                    : isOutgoing
                    ? { rotateY: [0, 7, 0], rotateX: [0, -3, 0], scale: [1, 0.96, 1], zIndex: 20 }
                    : { rotateY: 0, rotateX: 0, scale: 1, zIndex: isCenter ? 30 : 10 }
                }
                className={`${getSlotGridClasses(slot)} ${!isCenter ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                  if (!isCenter) handleViewBig('tv');
                }}
              >
                <div
                  className={`relative w-full transition-all duration-700 ease-out ${
                    isCenter
                      ? 'max-w-[460px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[680px]'
                      : 'max-w-[320px] md:max-w-[340px] lg:max-w-[420px] xl:max-w-[480px] 2xl:max-w-[520px]'
                  }`}
                >
                  <Product3DTilt maxRotation={9} className="w-full">
                    <div className="relative w-full aspect-[1.565/1]">
                      {/* TV Inner Screen Display with Autoplaying Video */}
                      <div 
                        style={{
                          left: '7.72%',
                          top: '6.00%',
                          width: '84.60%',
                          height: '74.55%',
                        }}
                        className="absolute z-0 overflow-hidden rounded-[2px] bg-black pointer-events-none"
                      >
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="w-full h-full object-cover"
                        >
                          <source src="/video 2.mp4" type="video/mp4" />
                          <source src="/video2.mp4" type="video/mp4" />
                        </video>
                      </div>

                      {/* TV Frame — Light Mode: Deep Black Frame & Stand */}
                      <img
                        src="/tv-hero-black.png"
                        alt="ZEXOVA Television"
                        className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_22px_rgba(0,0,0,0.12)] dark:hidden"
                        draggable={false}
                      />

                      {/* TV Frame — Dark Mode: Dark Silver Metallic Frame & Stand */}
                      <img
                        src="/tv-hero.png"
                        alt="ZEXOVA Television"
                        className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_0_1.5px_rgba(175,180,192,0.65)] drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)] hidden dark:block"
                        draggable={false}
                      />
                    </div>
                  </Product3DTilt>

                  {/* Floor Shadow */}
                  <div
                    className={`mx-auto -mt-1 rounded-[100%] bg-zinc-900/10 dark:bg-black/60 blur-sm pointer-events-none transition-all duration-700 ${
                      isCenter ? 'w-4/5 h-3' : 'w-4/5 h-2.5'
                    }`}
                  />

                  {/* View Big Action Button / Active Badge */}
                  {renderSlotControl('tv', slot, 'Television')}
                </div>
              </motion.div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════════
              4. EARBUDS COMPONENT (Wireless Earbuds with Charging Case)
              ════════════════════════════════════════════════════════════════════ */}
          {(() => {
            const slot = productSlots.earbuds;
            const isCenter = slot === 'center';
            const isIncoming = swapping.incoming === 'earbuds';
            const isOutgoing = swapping.outgoing === 'earbuds';

            return (
              <motion.div
                layout
                transition={{
                  layout: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                animate={
                  isIncoming
                    ? { rotateY: [0, -8, 0], rotateX: [0, 4, 0], scale: [1, 1.06, 1], zIndex: 40 }
                    : isOutgoing
                    ? { rotateY: [0, 8, 0], rotateX: [0, -4, 0], scale: [1, 0.94, 1], zIndex: 20 }
                    : { rotateY: 0, rotateX: 0, scale: 1, zIndex: isCenter ? 30 : 10 }
                }
                className={`${getSlotGridClasses(slot)} ${!isCenter ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                  if (!isCenter) handleViewBig('earbuds');
                }}
              >
                <div
                  className={`relative flex flex-col items-center transition-all duration-700 ease-out ${
                    isCenter
                      ? 'w-[280px] sm:w-[330px] md:w-[380px] lg:max-w-[430px] xl:max-w-[480px]'
                      : 'w-[125px] sm:w-[140px] lg:w-[160px] xl:w-[180px]'
                  }`}
                >
                  <Product3DTilt maxRotation={12} className="w-full flex items-center justify-center">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl flex items-center justify-center bg-[#f5f5f7] dark:bg-[#09090b] transition-colors duration-300">
                      {/* Light Mode Video (#f5f5f7 Half-White Background with subtle edge definition) */}
                      <video
                        ref={budsVideoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        src="/video-buds-light.mp4?v=light1"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-[#f5f5f7] opacity-100 dark:opacity-0 transition-opacity duration-300 ease-in-out"
                      >
                        <source src="/video-buds-light.mp4?v=light1" type="video/mp4" />
                      </video>

                      {/* Dark Mode Video (#09090b Black Background) */}
                      <video
                        ref={budsVideoDarkRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        src="/video-buds-dark.mp4?v=dark1"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-[#09090b] opacity-0 dark:opacity-100 transition-opacity duration-300 ease-in-out"
                      >
                        <source src="/video-buds-dark.mp4?v=dark1" type="video/mp4" />
                      </video>
                    </div>
                  </Product3DTilt>

                  {/* Floor Shadow */}
                  <div
                    className={`mx-auto -mt-1 rounded-[100%] bg-zinc-900/10 dark:bg-black/60 blur-sm pointer-events-none transition-all duration-700 ${
                      isCenter ? 'w-4/5 h-3.5' : 'w-4/5 h-2.5'
                    }`}
                  />

                  {/* View Big Action Button / Active Badge */}
                  {renderSlotControl('earbuds', slot, 'Earbuds')}
                </div>
              </motion.div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════════
              5. WATCH COMPONENT (Luxury Chronograph Smartwatch Video)
              ════════════════════════════════════════════════════════════════════ */}
          {(() => {
            const slot = productSlots.watch;
            const isCenter = slot === 'center';
            const isIncoming = swapping.incoming === 'watch';
            const isOutgoing = swapping.outgoing === 'watch';

            return (
              <motion.div
                layout
                transition={{
                  layout: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                animate={
                  isIncoming
                    ? { rotateY: [0, -8, 0], rotateX: [0, 4, 0], scale: [1, 1.06, 1], zIndex: 40 }
                    : isOutgoing
                    ? { rotateY: [0, 8, 0], rotateX: [0, -4, 0], scale: [1, 0.94, 1], zIndex: 20 }
                    : { rotateY: 0, rotateX: 0, scale: 1, zIndex: isCenter ? 30 : 10 }
                }
                className={`${getSlotGridClasses(slot)} ${!isCenter ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                  if (!isCenter) handleViewBig('watch');
                }}
              >
                <div
                  className={`relative flex flex-col items-center transition-all duration-700 ease-out ${
                    isCenter
                      ? 'w-[360px] sm:w-[420px] md:w-[480px] lg:max-w-[560px] xl:max-w-[600px]'
                      : 'w-[160px] sm:w-[185px] lg:w-[215px] xl:w-[240px]'
                  }`}
                >
                  <Product3DTilt maxRotation={12} className="w-full flex items-center justify-center">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl flex items-center justify-center bg-[#f5f5f7] dark:bg-[#09090b] transition-colors duration-300">
                      {/* Mini Feature Badge when small */}
                      {!isCenter && (
                        <div className="absolute top-2 left-2 z-20 pointer-events-none">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase bg-black/60 dark:bg-white/10 text-white backdrop-blur-md border border-white/10 shadow-sm">
                            Apple Watch
                          </span>
                        </div>
                      )}

                      {/* Light Mode Video (#f5f5f7 Half-White Background) */}
                      <video
                        ref={watchVideoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        src="/video-watch-light.mp4?v=v4_flawless"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-[#f5f5f7] opacity-100 dark:opacity-0 transition-opacity duration-300 ease-in-out"
                      >
                        <source src="/video-watch-light.mp4?v=v4_flawless" type="video/mp4" />
                      </video>

                      {/* Dark Mode Video (#09090b Black Background) */}
                      <video
                        ref={watchVideoDarkRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        src="/video-watch-dark.mp4?v=v4_flawless"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-[#09090b] opacity-0 dark:opacity-100 transition-opacity duration-300 ease-in-out"
                      >
                        <source src="/video-watch-dark.mp4?v=v4_flawless" type="video/mp4" />
                      </video>
                    </div>
                  </Product3DTilt>

                  {/* Floor Shadow */}
                  <div
                    className={`mx-auto -mt-1 rounded-[100%] bg-zinc-900/10 dark:bg-black/60 blur-sm pointer-events-none transition-all duration-700 ${
                      isCenter ? 'w-4/5 h-3.5' : 'w-4/5 h-2.5'
                    }`}
                  />

                  {/* View Big Action Button / Active Badge */}
                  {renderSlotControl('watch', slot, 'Apple Watch')}

                  {/* Luxury Watch Feature Callout Grid when Featured in Center */}
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="w-full mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 px-1 z-20"
                    >
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-500 mb-0.5" />
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Retina OLED</span>
                        <span className="text-[8px] text-zinc-500 dark:text-zinc-400">Always-On Display</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Digital Crown</span>
                        <span className="text-[8px] text-zinc-500 dark:text-zinc-400">Haptic Navigation</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500 mb-0.5" />
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">S9 SiP Chip</span>
                        <span className="text-[8px] text-zinc-500 dark:text-zinc-400">Double Tap Gesture</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-sm">
                        <Droplets className="w-3.5 h-3.5 text-emerald-500 mb-0.5" />
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">50M Waterproof</span>
                        <span className="text-[8px] text-zinc-500 dark:text-zinc-400">Swimproof & ECG</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })()}

        </div>

      </div>
    </motion.section>
  );
};

export default HeroSection;
