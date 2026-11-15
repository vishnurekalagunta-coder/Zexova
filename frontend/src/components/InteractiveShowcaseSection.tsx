import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleNetworkCanvas } from './ParticleNetworkCanvas';
import { CircularNavWheelArc } from './CircularNavWheelArc';
import { CheckCircle2, ArrowRight, ArrowLeft, Mouse } from 'lucide-react';

interface ShowcasePage {
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  paragraph: string;
  tags: string[];
  card: {
    tag: string;
    title: string;
    desc: string;
    stat: string;
    statLabel: string;
  };
}

const SHOWCASE_PAGES: ShowcasePage[] = [
  {
    step: '01',
    badge: 'CERTIFIED PRE-OWNED',
    title: 'Pre-Owned Tech, Reimagined.',
    subtitle: 'Tested, graded, and certified for longevity.',
    paragraph:
      'Every inspected pre-owned device on ZEXOVA passes our comprehensive multi-point diagnostic test covering display accuracy, battery health, thermal performance, and camera precision. Enjoy flagship engineering at a fraction of the cost, complete with transparent cosmetic grading disclosures and full return protection.',
    tags: ['100-POINT DIAGNOSTICS', 'BATTERY HEALTH REPORT', '1-YEAR WARRANTY'],
    card: {
      tag: 'Condition Certified',
      title: 'Pristine Grade A+',
      desc: 'Tested for flawless performance with verified battery retention above 90% and pristine cosmetic chassis integrity.',
      stat: '100% Tested',
      statLabel: 'Hardware Verified',
    },
  },
  {
    step: '02',
    badge: 'AUTHORIZED RETAIL',
    title: 'Brand New Electronics.',
    subtitle: 'Factory-sealed flagship hardware from verified retailers.',
    paragraph:
      'Browse factory-sealed laptops, smartphones, studio audio gear, and televisions direct from verified authorized distributor partner storefronts. Receive untouched factory packaging, official manufacturer warranties, and expedited express delivery directly to your doorstep with guaranteed authenticity on every order.',
    tags: ['ORIGINAL SEALS', 'OFFICIAL WARRANTY', 'EXPRESS DOORSTEP DISPATCH'],
    card: {
      tag: 'Direct Sourcing',
      title: 'Factory Sealed',
      desc: 'Guaranteed genuine hardware backed by direct manufacturer warranty coverage and official invoice documentation.',
      stat: 'Official',
      statLabel: 'Manufacturer Backed',
    },
  },
  {
    step: '03',
    badge: 'AI VALUATION ENGINE',
    title: 'Smart Price Estimator.',
    subtitle: 'Real-time algorithmic valuation based on actual market trends.',
    paragraph:
      'Calculate the fair market value of any device before buying or selling. Our smart estimation model continuously evaluates depreciation rates, release cycles, specifications, and device wear levels to deliver transparent, unbiased buy-and-sell price benchmarks across all major electronics.',
    tags: ['DYNAMIC ALGORITHMS', 'ACCURATE RESALE TIERS', 'INSTANT VALUATION'],
    card: {
      tag: 'Market Intelligence',
      title: 'Real-Time Valuation',
      desc: 'Instant algorithm-driven resale estimation calculated from real live secondary market transactions and device depreciation curves.',
      stat: 'Instant',
      statLabel: 'Fair-Value Quotes',
    },
  },
  {
    step: '04',
    badge: 'LOCAL DISCOVERY',
    title: 'Nearby Store Finder.',
    subtitle: 'Locate accredited physical stores in your neighborhood.',
    paragraph:
      'Experience devices in person before you finalize your purchase. Search accredited neighborhood retail storefronts and service centers on our interactive radar map with real-time distance calculation, in-stock inventories, and same-day physical walk-in pickup availability.',
    tags: ['INTERACTIVE RADAR', 'IN-PERSON INSPECTION', 'SAME-DAY STORE PICKUP'],
    card: {
      tag: 'Storefront Radar',
      title: 'Local Retail Partners',
      desc: 'Seamlessly bridge digital browsing with in-person retail confidence. Walk in to test laptops and phones hands-on before buying.',
      stat: '500+ Stores',
      statLabel: 'Accredited Centers',
    },
  },
  {
    step: '05',
    badge: 'CIRCULAR ECONOMY',
    title: 'Sustainable Tech Trade-In.',
    subtitle: 'Exchange your current tech and reduce electronic waste.',
    paragraph:
      'Participate in our zero-waste circular trade-in initiative. Trade in pre-owned gadgets to immediately offset the cost of upgrading to your next workstation or daily phone. We recondition working tech to give electronics a meaningful second life while diverting e-waste from landfills.',
    tags: ['ZERO E-WASTE MISSION', 'INSTANT TRADE CREDITS', 'CIRCULAR UPGRADE'],
    card: {
      tag: 'Circular Mission',
      title: 'E-Waste Reduction',
      desc: 'Extending the lifecycle of modern electronics by matching pre-owned hardware with new caretakers across our sustainable marketplace.',
      stat: 'Zero Waste',
      statLabel: 'Circular Hardware',
    },
  },
  {
    step: '06',
    badge: 'TRUST & SECURITY',
    title: 'Guaranteed Escrow Protection.',
    subtitle: 'Safe, encrypted transactions for buyers and sellers.',
    paragraph:
      'Every transaction on ZEXOVA is protected by secure escrow holding. Funds are released to sellers only after you receive your device, physically inspect its condition, and verify its specifications. Complete with an easy 7-day return policy and 24/7 customer support.',
    tags: ['ESCROW PAYMENT HOLD', '7-DAY RETURN WINDOW', '24/7 CONCIERGE'],
    card: {
      tag: 'Buyer Safeguard',
      title: 'Escrow Protected',
      desc: 'Your payment remains securely held in escrow until you verify your hardware in person. Zero risk, total reassurance.',
      stat: '100% Secure',
      statLabel: 'Escrow Backed',
    },
  },
];

export const InteractiveShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const activeStepRef = useRef<number>(0);

  // Keep ref synchronized with state
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  // ─── Native Wheel Interceptor (Holds in place, advances numbers 01 -> 06) ───
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let isLocked = false;
    let lockTimeout: ReturnType<typeof setTimeout> | null = null;

    const onNativeWheel = (e: WheelEvent) => {
      // Ignore minor trackpad jitter
      if (Math.abs(e.deltaY) < 16) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // When scrolling down and not yet at step 6: stay in section, advance number & text
      if (scrollingDown && activeStepRef.current < 5) {
        e.preventDefault();
        if (!isLocked) {
          isLocked = true;
          setActiveStep((prev) => {
            const next = Math.min(5, prev + 1);
            activeStepRef.current = next;
            return next;
          });
          if (lockTimeout) clearTimeout(lockTimeout);
          lockTimeout = setTimeout(() => {
            isLocked = false;
          }, 360);
        }
      } else if (scrollingUp && activeStepRef.current > 0) {
        // When scrolling up and not yet at step 1: stay in section, reverse number & text
        e.preventDefault();
        if (!isLocked) {
          isLocked = true;
          setActiveStep((prev) => {
            const next = Math.max(0, prev - 1);
            activeStepRef.current = next;
            return next;
          });
          if (lockTimeout) clearTimeout(lockTimeout);
          lockTimeout = setTimeout(() => {
            isLocked = false;
          }, 360);
        }
      }
      // If at step 6 and scrolling down, or at step 1 and scrolling up:
      // Event is NOT prevented, allowing normal page scrolling to continue!
    };

    el.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onNativeWheel);
      if (lockTimeout) clearTimeout(lockTimeout);
    };
  }, []);

  // ─── Mobile Touch Swipe Support ───────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let touchStartY = 0;
    let isTouchLocked = false;
    let touchTimeout: ReturnType<typeof setTimeout> | null = null;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) < 32) return;

      if (diffY > 0 && activeStepRef.current < 5) {
        // Swipe up -> Next number
        if (!isTouchLocked) {
          isTouchLocked = true;
          setActiveStep((prev) => {
            const next = Math.min(5, prev + 1);
            activeStepRef.current = next;
            return next;
          });
          touchTimeout = setTimeout(() => {
            isTouchLocked = false;
          }, 360);
        }
      } else if (diffY < 0 && activeStepRef.current > 0) {
        // Swipe down -> Prev number
        if (!isTouchLocked) {
          isTouchLocked = true;
          setActiveStep((prev) => {
            const next = Math.max(0, prev - 1);
            activeStepRef.current = next;
            return next;
          });
          touchTimeout = setTimeout(() => {
            isTouchLocked = false;
          }, 360);
        }
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      if (touchTimeout) clearTimeout(touchTimeout);
    };
  }, []);

  const selectStep = (index: number) => {
    setActiveStep(index);
    activeStepRef.current = index;
  };

  const currentPage = SHOWCASE_PAGES[activeStep] || SHOWCASE_PAGES[0];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[92vh] sm:min-h-screen py-10 sm:py-16 flex items-center justify-between overflow-hidden bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors"
    >
      {/* ─── Subtle Dot Matrix Grid ────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-35 dark:opacity-20 pointer-events-none z-0" />

      {/* ─── Interactive Particle Network Canvas Layer ─────────────────────── */}
      <ParticleNetworkCanvas className="z-[1]" />

      {/* ─── Main Content Container ────────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        
        {/* ══════════════════════════════════════════════════════════════════
            LEFT-SIDE ROTARY WHEEL ARC (01 - 06, no Z=, moved left):
            Only the numbers move along the arc when scrolled or clicked!
            ══════════════════════════════════════════════════════════════════ */}
        <div className="relative shrink-0 flex items-center z-20 pointer-events-auto">
          <CircularNavWheelArc
            activeStep={activeStep}
            onSelectStep={selectStep}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CENTER EDITORIAL CONTENT & RIGHT CARD:
            Changes in the same page according to the active number.
            ══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 w-full max-w-4xl py-4 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`showcase-${currentPage.step}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
            >
              {/* Left Column: Badge, Title, Subtitle, Paragraph, Tags */}
              <div className="lg:col-span-7 space-y-5">
                {/* Small Uppercase Badge */}
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-[0.22em] text-blue-600 uppercase">
                    {currentPage.badge}
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.08]">
                  {currentPage.title}
                </h2>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
                  {currentPage.subtitle}
                </p>

                {/* Main Paragraph */}
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                  {currentPage.paragraph}
                </p>

                {/* Bottom Metadata Tags */}
                <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex flex-wrap gap-2">
                  {currentPage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-[10px] font-mono font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xl max-w-[340px] w-full space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentPage.card.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      {currentPage.step} / 06
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
                      {currentPage.card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {currentPage.card.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-50">
                        {currentPage.card.stat}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                        {currentPage.card.statLabel}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeStep > 0 && (
                        <button
                          onClick={() => selectStep(activeStep - 1)}
                          className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          title="Previous"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => selectStep((activeStep + 1) % 6)}
                        className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
                        title="Next"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* ─── Bottom Subtle Scroll Indicator ────────────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 pointer-events-none select-none">
        <Mouse className="w-3.5 h-3.5 animate-bounce" />
        <span>Scroll or click 01–06 to rotate</span>
      </div>

    </section>
  );
};

export default InteractiveShowcaseSection;
