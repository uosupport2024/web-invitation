"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { WagasaSection } from "@/components/sections/WagasaSection";
import { FallingLeaves } from "@/components/FallingLeaves";
import { AccommodationSection } from "@/components/sections/AccommodationSection";
import { InstructionPill } from "@/components/InstructionPill";
import { ScrollChevron } from "@/components/ScrollChevron";
import { BackgroundMusic } from "@/components/BackgroundMusic";

interface MapLink {
  url: string;
  left: string;
  top: string;
  color?: string;
  ariaLabel: string;
}

interface InteractiveFoodItemProps {
  id: string;
  foodImage: string;
  infoImage: string;
  altFood: string;
  altInfo: string;
  left: string;
  top: string;
  width: string;
  imgWidth: number;
  imgHeight: number;
  zIndex?: number;
  floatDelay?: number;
  isRevealed: boolean;
  isZoomedOut?: boolean;
  mapLinks?: MapLink[];
  onReveal: () => void;
}

function InteractiveFoodItem({
  id,
  foodImage,
  infoImage,
  altFood,
  altInfo,
  left,
  top,
  width,
  imgWidth,
  imgHeight,
  zIndex = 10,
  isRevealed,
  isZoomedOut = false,
  mapLinks,
  onReveal,
}: InteractiveFoodItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isZoomedOut) return;
    // For normal items, if already revealed, do nothing. For tomato, clicking the revealed silhouette triggers step 2 (somen noodle).
    if (isRevealed && id !== "tomato") return;
    onReveal();
  };

  const shouldShowInfo = isRevealed && !isZoomedOut;
  const isClickable = !isZoomedOut && (!shouldShowInfo || id === "tomato");

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        cursor: isClickable ? "pointer" : "default",
        zIndex: shouldShowInfo ? Math.max(zIndex + 15, 30) : zIndex,
      }}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        {!shouldShowInfo ? (
          <motion.div
            key="food-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image
              src={foodImage}
              alt={altFood}
              width={imgWidth}
              height={imgHeight}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </motion.div>
        ) : (
          <motion.div
            key="info-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            whileHover={id === "tomato" ? { scale: 1.05 } : undefined}
            whileTap={id === "tomato" ? { scale: 0.95 } : undefined}
            style={{ position: "relative" }}
          >
            <Image
              src={infoImage}
              alt={altInfo}
              width={imgWidth}
              height={imgHeight}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />

            {mapLinks &&
              mapLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{
                    position: "absolute",
                    left: link.left,
                    top: link.top,
                    transform: "translate(-50%, -50%)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                    minWidth: "38px",
                    minHeight: "38px",
                    cursor: "pointer",
                    zIndex: 35,
                    textDecoration: "none",
                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.88 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={link.color || "#FFFFFF"}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </motion.div>
                </a>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNextPage, setIsNextPage] = useState(false);
  const [revealedFoods, setRevealedFoods] = useState<Record<string, boolean>>({});
  const [isSomenActivated, setIsSomenActivated] = useState(false);
  const [isSomenPulled, setIsSomenPulled] = useState(false);
  const [isSomenFullyPulled, setIsSomenFullyPulled] = useState(false);
  const [showAccomms, setShowAccomms] = useState(false);
  const [isSection2AtBottom, setIsSection2AtBottom] = useState(false);
  const [isSection2Scrolled, setIsSection2Scrolled] = useState(false);
  const [isSection3AtBottom, setIsSection3AtBottom] = useState(false);
  const [isSection3Scrolled, setIsSection3Scrolled] = useState(false);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section3TouchStartY = useRef(0);
  const bottomTouchStartY = useRef(0);
  const allowSwipeTransition = useRef(false);
  const somenWasActivatedOnTouchStart = useRef(false);
  const lastSomenDeactivateTime = useRef(0);

  useEffect(() => {
    if (section3Ref.current) {
      section3Ref.current.scrollTop = 0;
    }
    queueMicrotask(() => {
      setIsSection3AtBottom(false);
      setIsSection3Scrolled(false);
    });
  }, [isSomenActivated, isNextPage, showAccomms]);

  const handleFoodClick = (key: string) => {
    if (key === "tomato") {
      if (!revealedFoods["tomato"]) {
        // Step 1: First click shows the tomato silhouette image
        setRevealedFoods((prev) => ({ ...prev, tomato: true }));
      } else if (!isSomenActivated) {
        // Step 2: Second click on tomato silhouette enters the somen noodle scene
        setIsSomenActivated(true);
        if (section3Ref.current) {
          section3Ref.current.scrollTop = 0;
        }
      }
      return;
    }

    if (revealedFoods[key]) return;
    setRevealedFoods((prev) => ({ ...prev, [key]: true }));
  };

  const handleSection3TouchStart = (e: React.TouchEvent) => {
    section3TouchStartY.current = e.touches[0].clientY;
    somenWasActivatedOnTouchStart.current = isSomenActivated;
    allowSwipeTransition.current = isSomenFullyPulled;
  };

  const handleSection3TouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndY = e.touches[0].clientY;
    const diffY = section3TouchStartY.current - touchEndY;
    const scrollTop = e.currentTarget.scrollTop;

    // 1. Swipe down (diffY < -40) at the top of Section 3 to go back
    if (scrollTop <= 10 && diffY < -40) {
      if (somenWasActivatedOnTouchStart.current) {
        if (isSomenActivated) {
          setIsSomenActivated(false);
          setIsSomenPulled(false);
          setIsSomenFullyPulled(false);
          lastSomenDeactivateTime.current = Date.now();
        }
      } else {
        if (Date.now() - lastSomenDeactivateTime.current > 600) {
          setIsNextPage(false);
        }
      }
      return;
    }
  };

  const handleSection3Wheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    // 1. Scroll up (deltaY < -15) at the top of Section 3
    if (scrollTop <= 5 && e.deltaY < -15) {
      if (isSomenActivated) {
        setIsSomenActivated(false);
        setIsSomenPulled(false);
        setIsSomenFullyPulled(false);
        lastSomenDeactivateTime.current = Date.now();
      } else {
        if (Date.now() - lastSomenDeactivateTime.current > 800) {
          setIsNextPage(false);
        }
      }
      return;
    }

    // 2. Scroll down (deltaY > 15) when somen is fully pulled -> Go to Accommodation (Section 4)
    if (isSomenFullyPulled && !showAccomms && e.deltaY > 15) {
      setShowAccomms(true);
    }
  };

  const handleSection3Scroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 60;
    setIsSection3AtBottom(atBottom);
    setIsSection3Scrolled(scrollTop > 20);
  };

  const scrollSection2Down = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (section2Ref.current) {
      section2Ref.current.scrollBy({
        top: window.innerHeight * 0.75,
        behavior: "smooth",
      });
    }
  };

  const scrollSection3Down = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (section3Ref.current) {
      section3Ref.current.scrollBy({
        top: window.innerHeight * 0.7,
        behavior: "smooth",
      });
    }
  };

  const section2TouchStartY = useRef(0);

  const handleSection2Scroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 120;
    setIsSection2AtBottom(atBottom);
    setIsSection2Scrolled(scrollTop > 20);
  };

  const handleSection2TouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    section2TouchStartY.current = e.touches[0].clientY;
  };

  const handleSection2TouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isOpen || isNextPage) return;
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;

    if (isAtBottom) {
      const touchEndY = e.touches[0].clientY;
      const diffY = section2TouchStartY.current - touchEndY;
      // Swipe up (diffY > 50) at the bottom transitions to next page
      if (diffY > 50) {
        setIsNextPage(true);
      }
    }
  };

  const handleSection2Wheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isOpen || isNextPage) return;
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;

    // Scroll down (deltaY > 15) at the bottom transitions to next page
    if (isAtBottom && e.deltaY > 15) {
      setIsNextPage(true);
    }
  };

  const handleAutumnLeafTap = () => {
    if (!section2Ref.current) {
      setIsNextPage(true);
      return;
    }
    const { scrollTop, clientHeight, scrollHeight } = section2Ref.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 80;

    if (isAtBottom) {
      setIsNextPage(true);
    } else {
      section2Ref.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    // Outer: overflow hidden — user CANNOT manually scroll the page
    <div
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000",
        position: "relative",
      }}
    >
      {/* ── Background Music Player ── */}
      <BackgroundMusic />

      {/* ── Section 1: Wagasa Intro — slides UP when opened ── */}
      <motion.div
        animate={{ y: isOpen ? "-100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <WagasaSection onOpen={() => setIsOpen(true)} />
      </motion.div>

      {/* ── Section 2: bgscroll.png + overlays ── */}
      <motion.div
        ref={section2Ref}
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        onScroll={handleSection2Scroll}
        onWheel={handleSection2Wheel}
        onTouchStart={handleSection2TouchStart}
        onTouchMove={handleSection2TouchMove}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          overflowY: isNextPage ? "hidden" : "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Container relative — overlays positioned against bgscroll */}
        <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
          {/* Background scroll image */}
          <Image
            src="/images/theojesslyn_bgscroll.png"
            alt="Wedding invitation"
            width={900}
            height={3200}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />

          {/* Date overlay — "10th of NOVEMBER 2026 in KYOTO" over pagoda scene */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "55%",
              aspectRatio: "400 / 120",
              pointerEvents: "none",
            }}
          >
            <Image
              src="/images/theojesslyn_date.png"
              alt="10th of November 2026 in Kyoto"
              fill
              className="object-contain"
              sizes="55vw"
            />
          </div>

          {/* Names overlay — above leaves (zIndex: 10) */}
          <div
            style={{
              position: "absolute",
              top: "70%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "68%",
              aspectRatio: "600 / 530",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <Image
              src="/images/theojesslyn_names_dark.png"
              alt="Theodore Otto Hartono & Jesslyn Mulianto"
              fill
              className="object-contain"
              sizes="85vw"
            />
          </div>

          {/* Maple leaf — Upper Right (mapleleaf01) — wind sway */}
          <motion.div
            style={{
              position: "absolute",
              top: "60%",
              right: "-2%",
              width: "70%",
              aspectRatio: "516 / 280",
              pointerEvents: "none",
              transformOrigin: "90% 30%",
              zIndex: 5,
            }}
            animate={{ rotate: [0, 4, -2, 3, 0], y: [0, -4, 2, -3, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/theojesslyn_mapleleaf01.png"
              alt=""
              fill
              className="object-contain object-right"
              sizes="55vw"
            />
          </motion.div>

          {/* Maple leaf — Left (mapleleaf02) — wind sway */}
          <motion.div
            style={{
              position: "absolute",
              top: "78%",
              left: "-10%",
              width: "70%",
              aspectRatio: "516 / 280",
              pointerEvents: "none",
              transformOrigin: "10% 60%",
              zIndex: 5,
            }}
            animate={{ rotate: [0, -3, 2, -4, 0], y: [0, 3, -2, 4, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/theojesslyn_mapleleaf02.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="55vw"
            />
          </motion.div>

          {/* Maple leaf — Left flipped vertical (mapleleaf02 scaleY -1) — wind sway */}
          <motion.div
            style={{
              position: "absolute",
              top: "90%",
              left: "-10%",
              width: "70%",
              aspectRatio: "516 / 280",
              pointerEvents: "none",
              transform: "scaleY(-1)",
              transformOrigin: "10% 40%",
              zIndex: 5,
            }}
            animate={{ rotate: [0, 5, -3, 4, 0], y: [0, -3, 2, -4, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Image
              src="/images/theojesslyn_mapleleaf02.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="55vw"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Section 3: Image 4.1 — slides in when bottom CTA clicked ── */}
      <AnimatePresence>
        {isNextPage && (
          <motion.div
            ref={section3Ref}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            onScroll={handleSection3Scroll}
            onWheel={handleSection3Wheel}
            onTouchStart={handleSection3TouchStart}
            onTouchMove={handleSection3TouchMove}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              background: "#61291A",
              overflowY: isSomenActivated ? "hidden" : "auto",
              overflowX: "hidden",
            }}
          >
            {/* Soft Back Button on Top Left (Fixed so it stays visible & unscaled in Somen mode) */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                if (isSomenActivated) {
                  setIsSomenActivated(false);
                  setIsSomenPulled(false);
                  setIsSomenFullyPulled(false);
                  lastSomenDeactivateTime.current = Date.now();
                } else {
                  if (Date.now() - lastSomenDeactivateTime.current > 400) {
                    setIsNextPage(false);
                  }
                }
              }}
              style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                zIndex: 100005,
                background: "rgba(97, 41, 26, 0.75)",
                border: "1px solid rgba(243, 213, 181, 0.4)",
                borderRadius: "20px",
                padding: "6px 14px 6px 10px",
                color: "#F3D5B5",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
                pointerEvents: "auto",
              }}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(97, 41, 26, 0.9)" }}
              whileTap={{ scale: 0.96 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L8 12L15 5"
                  stroke="#F3D5B5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back</span>
            </motion.button>

            {/* Direction text fixed on Top Left when food menu is active */}
            <AnimatePresence>
              {!isSomenActivated && !isSection3Scrolled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "fixed",
                    top: "62px",
                    left: "20px",
                    zIndex: 100004,
                    pointerEvents: "none",
                  }}
                >
                  <InstructionPill text="TAP EACH FOOD" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                scale: isSomenActivated ? 0.62 : 1,
              }}
              transition={{
                duration: 1.2,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                position: "relative",
                width: "100%",
                minHeight: isSomenActivated
                  ? "100dvh"
                  : `calc(${(850 / 677) * 100}dvh - 10% + 35vw)`,
                transformOrigin: "top center",
              }}
            >

              {/* Onigiri */}
              <InteractiveFoodItem
                id="onigiri"
                foodImage="/images/theojesslyn_onigiri.png"
                infoImage="/images/theojesslyn_onigiri_welcomedinner.png"
                altFood="Onigiri"
                altInfo="Onigiri Welcome Dinner"
                left={`${(129 / 375) * 100}%`}
                top={`calc(${(26 / 677) * 100}dvh - 2%)`}
                width={`${(364 / 375) * 100}%`}
                imgWidth={364}
                imgHeight={364}
                isRevealed={!!revealedFoods["onigiri"]}
                isZoomedOut={isSomenActivated}
                mapLinks={[
                  {
                    url: "https://maps.app.goo.gl/25vec9h4CoArVZAM6?g_st=ipc",
                    left: "64.5%",
                    top: "73.8%",
                    color: "#FFFFFF",
                    ariaLabel: "SAAMI Google Maps Location",
                  },
                ]}
                onReveal={() => handleFoodClick("onigiri")}
              />

              {/* Ricebowl */}
              <InteractiveFoodItem
                id="ricebowl"
                foodImage="/images/theojesslyn_ricebowl.png"
                infoImage="/images/theojesslyn_bowl_holmat.png"
                altFood="Ricebowl"
                altInfo="Ricebowl Holy Matrimony"
                left={`${(-96 / 375) * 100}%`}
                top={`calc(${(291 / 677) * 100}dvh - 7%)`}
                width={`${(325 / 375) * 100}%`}
                imgWidth={325}
                imgHeight={325}
                isRevealed={!!revealedFoods["ricebowl"]}
                isZoomedOut={isSomenActivated}
                mapLinks={[
                  {
                    url: "https://maps.app.goo.gl/HUVre8hNoui6zNFY8?g_st=ipc",
                    left: "45.5%",
                    top: "61.5%",
                    color: "#FFFFFF",
                    ariaLabel: "KODAIJI JUGYUAN Google Maps Location",
                  },
                ]}
                onReveal={() => handleFoodClick("ricebowl")}
              />

              {/* Chopsticks image — static */}
              <div
                style={{
                  position: "absolute",
                  left: `${(-120 / 375) * 100}%`,
                  top: `calc(${(600 / 677) * 100}dvh - 7%)`,
                  width: `${(337 / 375) * 100}%`,
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                <Image
                  src="/images/theojesslyn_chopsticks.png"
                  alt="Chopsticks"
                  width={337}
                  height={337}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </div>

              {/* Sauce */}
              <InteractiveFoodItem
                id="sauce"
                foodImage="/images/theojesslyn_sauce.png"
                infoImage="/images/theojesslyn_sauce_cocktail.png"
                altFood="Sauce"
                altInfo="Sauce Cocktail"
                left={`${(135 / 375) * 100}%`}
                top={`calc(${(525 / 677) * 100}dvh - 7%)`}
                width={`${(306 / 375) * 100}%`}
                imgWidth={306}
                imgHeight={306}
                zIndex={15}
                isRevealed={!!revealedFoods["sauce"]}
                isZoomedOut={isSomenActivated}
                mapLinks={[
                  {
                    url: "https://maps.app.goo.gl/QHi3UtwnUG2kwGZRA?g_st=ipc",
                    left: "56.0%",
                    top: "72.5%",
                    color: "#8F381E",
                    ariaLabel: "FOUR SEASONS KYOTO Google Maps Location",
                  },
                ]}
                onReveal={() => handleFoodClick("sauce")}
              />

              {/* Gunkan */}
              <InteractiveFoodItem
                id="gunkan"
                foodImage="/images/theojesslyn_gunkan.png"
                infoImage="/images/theojesslyn_gunkan_dinner.png"
                altFood="Gunkan"
                altInfo="Gunkan Dinner"
                left={`${(-19 / 375) * 100}%`}
                top={`calc(${(784 / 677) * 100}dvh - 10%)`}
                width={`${(274 / 375) * 100}%`}
                imgWidth={274}
                imgHeight={274}
                isRevealed={!!revealedFoods["gunkan"]}
                isZoomedOut={isSomenActivated}
                mapLinks={[
                  {
                    url: "https://maps.app.goo.gl/QHi3UtwnUG2kwGZRA?g_st=ipc",
                    left: "45.5%",
                    top: "45.0%",
                    color: "#FFFFFF",
                    ariaLabel: "FOUR SEASONS KYOTO Google Maps Location",
                  },
                  {
                    url: "https://maps.app.goo.gl/TYygXMnss3Up4NeLA?g_st=ipc",
                    left: "48.0%",
                    top: "76.0%",
                    color: "#FFFFFF",
                    ariaLabel: "WORLD KYOTO Google Maps Location",
                  },
                ]}
                onReveal={() => handleFoodClick("gunkan")}
              />

              {/* Tomato */}
              <InteractiveFoodItem
                id="tomato"
                foodImage="/images/theojesslyn_tomato.png"
                infoImage="/images/theojesslyn_tomato_silhouette.png"
                altFood="Tomato"
                altInfo="Tomato Silhouette"
                left={`${(245 / 375) * 100}%`}
                top={`calc(${(850 / 677) * 100}dvh - 10%)`}
                width={`${(130 / 375) * 100}%`}
                imgWidth={153}
                imgHeight={153}
                isRevealed={!!revealedFoods["tomato"]}
                isZoomedOut={isSomenActivated}
                onReveal={() => handleFoodClick("tomato")}
              />

              {/* Direction hint: * Pull the Somen */}
              <AnimatePresence mode="wait">
                {isSomenActivated && !isSomenPulled && !isSomenFullyPulled && (
                  <motion.div
                    key="pull-somen-hint"
                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.85, x: "-50%" }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    onClick={() => {
                      setIsSomenPulled(true);
                      setIsSomenFullyPulled(true);
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `calc(${(595 / 677) * 100}dvh - 5%)`,
                      zIndex: 100001,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <InstructionPill
                      text="PULL THE SOMEN"
                      showArrow={true}
                      arrowDirection="up"
                      size="lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Direction hint: * Scroll Down for Accommodation */}
              <AnimatePresence mode="wait">
                {isSomenFullyPulled && !showAccomms && (
                  <motion.div
                    key="scroll-accomms-hint"
                    initial={{ opacity: 0, y: 15, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.85, x: "-50%" }}
                    transition={{ duration: 0.5 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAccomms(true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      bottomTouchStartY.current = e.touches[0].clientY;
                    }}
                    onTouchMove={(e) => {
                      e.stopPropagation();
                      const diffY = bottomTouchStartY.current - e.touches[0].clientY;
                      if (diffY > 30 || diffY < -30) {
                        setShowAccomms(true);
                      }
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `calc(${(1030 / 677) * 100}dvh - 10%)`,
                      zIndex: 100001,
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "16px 24px",
                      touchAction: "none",
                    }}
                  >
                    <InstructionPill
                      text="SWIPE FOR NEXT"
                      showArrow={true}
                      arrowDirection="down"
                      size="lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bowl Back — appears at very bottom of page (zIndex: 99998) */}
              <AnimatePresence>
                {isSomenActivated && (
                  <motion.div
                    initial={{ opacity: 0, y: 250 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 250 }}
                    transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                      position: "absolute",
                      left: `${(-272 / 375) * 100}%`,
                      top: `calc(${(644 / 677) * 100}dvh - 10%)`,
                      width: `${(911 / 375) * 100}%`,
                      zIndex: 99998,
                      pointerEvents: "none",
                    }}
                  >
                    <Image
                      src="/images/theojesslyn_bowlback.png"
                      alt="Bowl Back"
                      width={911}
                      height={403}
                      style={{ width: "100%", height: "auto", display: "block" }}
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Somen — enlarged by 10% & raised 20% higher, draggable upward with swaying & 10% right shift (zIndex: 99999) */}
              <AnimatePresence>
                {isSomenActivated && (
                  <motion.div
                    drag="y"
                    dragConstraints={{ top: -530, bottom: 0 }}
                    dragElastic={0.15}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchMove={(e) => {
                      e.stopPropagation();
                    }}
                    onDragStart={() => {
                      setIsSomenPulled(true);
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setIsSomenPulled(true);
                    }}
                    onDragEnd={(e, info) => {
                      e.stopPropagation();
                      if (info.offset.y < -30 || info.velocity.y < -50) {
                        setIsSomenPulled(true);
                        setIsSomenFullyPulled(true);
                      } else if (info.offset.y > 30 || info.velocity.y > 50) {
                        setIsSomenPulled(false);
                        setIsSomenFullyPulled(false);
                      }
                    }}
                    initial={{ opacity: 0, y: 250 }}
                    animate={{
                      opacity: 1,
                      y: isSomenPulled ? -530 : 0,
                      x: isSomenPulled ? "5%" : "0%",
                      rotate: isSomenPulled
                        ? [0, -3.5, 3.5, -2, 2, -0.8, 0]
                        : [0, 3.5, -3.5, 2, -2, 0.8, 0],
                      scaleY: isSomenPulled
                        ? [1, 1.05, 0.98, 1.02, 1]
                        : [1, 0.96, 1.03, 0.98, 1],
                      skewX: isSomenPulled
                        ? [0, -2.5, 2.5, -1, 1, 0]
                        : [0, 2.5, -2.5, 1, -1, 0],
                    }}
                    exit={{ opacity: 0, y: 250 }}
                    transition={{
                      duration: 1.6,
                      ease: [0.25, 1, 0.5, 1],
                      rotate: { duration: 2.2, ease: [0.37, 0, 0.63, 1] },
                      scaleY: { duration: 1.6, ease: "easeInOut" },
                      skewX: { duration: 2.0, ease: "easeInOut" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSomenPulled((prev) => {
                        const next = !prev;
                        setIsSomenFullyPulled(next);
                        return next;
                      });
                    }}
                    style={{
                      position: "absolute",
                      left: `${(-280 / 375) * 100}%`,
                      top: `calc(${(530 / 677) * 100}dvh - 10%)`,
                      width: `${(954 / 375) * 100}%`,
                      zIndex: 99999,
                      cursor: "grab",
                      touchAction: "none",
                      transformOrigin: "50% 15%",
                    }}
                  >
                    <Image
                      src="/images/theojesslyn_somen.png"
                      alt="Somen Noodles"
                      width={954}
                      height={1105}
                      style={{ width: "100%", height: "auto", display: "block" }}
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bowl Front — appears at very bottom of page (zIndex: 100000) */}
              <AnimatePresence>
                {isSomenActivated && (
                  <motion.div
                    initial={{ opacity: 0, y: 250 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 250 }}
                    transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSomenPulled((prev) => {
                        const next = !prev;
                        setIsSomenFullyPulled(next);
                        return next;
                      });
                    }}
                    style={{
                      position: "absolute",
                      left: `${(-242 / 375) * 100}%`,
                      top: `calc(${(764 / 677) * 100}dvh - 10%)`,
                      width: `${(845 / 375) * 100}%`,
                      zIndex: 100000,
                      cursor: "pointer",
                    }}
                  >
                    <Image
                      src="/images/theojesslyn_bowlfront.png"
                      alt="Bowl Front"
                      width={845}
                      height={641}
                      style={{ width: "100%", height: "auto", display: "block" }}
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Falling Leaves overlay (visible on section 2) ── */}
      <FallingLeaves
        visible={isOpen && !isNextPage}
        count={18}
        onLeafClick={handleAutumnLeafTap}
      />

      {/* ── Soft Back Button on Section 2 (returns to Wagasa intro cover) ── */}
      <AnimatePresence>
        {isOpen && !isNextPage && !isSection2Scrolled && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{
              position: "fixed",
              top: "20px",
              left: "20px",
              zIndex: 65,
              background: "rgba(30, 20, 15, 0.45)",
              border: "1px solid rgba(255, 245, 230, 0.35)",
              borderRadius: "20px",
              padding: "6px 14px 6px 10px",
              color: "rgba(255, 245, 230, 0.95)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)",
            }}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(30, 20, 15, 0.65)" }}
            whileTap={{ scale: 0.96 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="rgba(255, 245, 230, 0.95)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Scroll indicator on Section 2 (visible until scrolled) ── */}
      <AnimatePresence>
        {isOpen && !isNextPage && !isSection2Scrolled && !isSection2AtBottom && (
          <ScrollChevron onClick={scrollSection2Down} />
        )}
      </AnimatePresence>

      {/* ── Bottom CTA on Section 2: "TAP ON THE AUTUMN LEAF" (Only visible when scrolled to bottom) ── */}
      <AnimatePresence>
        {isOpen && !isNextPage && isSection2AtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={handleAutumnLeafTap}
            style={{
              position: "fixed",
              bottom: "24px",
              left: "50%",
              zIndex: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <InstructionPill
              text="TAP THE AUTUMN LEAF"
              showArrow={true}
              arrowDirection="down"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll indicator on Section 3 (visible until scrolled to bottom or somen active) ── */}
      <AnimatePresence>
        {isNextPage && !isSomenActivated && !showAccomms && !isSection3AtBottom && (
          <ScrollChevron onClick={scrollSection3Down} />
        )}
      </AnimatePresence>

      {/* ── Section 4: Accommodation ── */}
      <AccommodationSection
        isActive={showAccomms}
        onClose={() => setShowAccomms(false)}
      />
    </div>
  );
}
