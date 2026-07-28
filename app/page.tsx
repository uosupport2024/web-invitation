"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { WagasaSection } from "@/components/sections/WagasaSection";
import { FallingLeaves } from "@/components/FallingLeaves";
import { AccommodationSection } from "@/components/sections/AccommodationSection";

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
  onReveal: () => void;
}

function InteractiveFoodItem({
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
  floatDelay = 0,
  isRevealed,
  isZoomedOut = false,
  onReveal,
}: InteractiveFoodItemProps) {
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    if (isRevealed || isZoomedOut) return;
    setShowParticles(true);
    onReveal();
    setTimeout(() => setShowParticles(false), 1000);
  };

  const shouldShowInfo = isRevealed && !isZoomedOut;

  return (
    <motion.div
      animate={
        !shouldShowInfo
          ? { y: [0, -6, 0] }
          : { y: 0 }
      }
      transition={
        !shouldShowInfo
          ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }
          : { duration: 0.4 }
      }
      style={{
        position: "absolute",
        left,
        top,
        width,
        cursor: shouldShowInfo || isZoomedOut ? "default" : "pointer",
        zIndex,
      }}
      onClick={handleClick}
      whileHover={!shouldShowInfo && !isZoomedOut ? { scale: 1.05, filter: "brightness(1.08)" } : undefined}
      whileTap={!shouldShowInfo && !isZoomedOut ? { scale: 0.95 } : undefined}
    >
      {/* Particles burst when tapped */}
      {showParticles && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 40 }}>
          {[
            { x: -50, y: -60, r: -25 },
            { x: 55, y: -50, r: 30 },
            { x: -65, y: 15, r: -45 },
            { x: 70, y: 20, r: 35 },
            { x: -35, y: 65, r: -15 },
            { x: 40, y: 60, r: 40 },
            { x: 0, y: -75, r: 10 },
            { x: 0, y: 75, r: -35 },
          ].map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.3, rotate: p.r }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                fontSize: "1.1rem",
                color: "#F3D5B5",
                textShadow: "0 0 8px rgba(243,213,181,0.8)",
                pointerEvents: "none",
                lineHeight: 1,
              }}
            >
              ✦
            </motion.span>
          ))}
        </div>
      )}

      {/* Clickability hint pulse aura (when unrevealed & not zoomed out) */}
      {!shouldShowInfo && !isZoomedOut && (
        <motion.div
          animate={{ scale: [0.95, 1.06, 0.95], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
          style={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "40%",
            border: "1.5px dashed rgba(255, 230, 190, 0.65)",
            pointerEvents: "none",
            filter: "drop-shadow(0 0 6px rgba(255, 220, 160, 0.5))",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {!shouldShowInfo ? (
          <motion.div
            key="food-state"
            initial={{ opacity: 0, filter: "blur(0px)", scale: 1 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",
              scale: 0.98,
            }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
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
            initial={{
              opacity: 0,
              filter: "blur(8px)",
              y: 10,
              scale: 1.02,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",
              y: -10,
              scale: 0.98,
            }}
            transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          >
            <Image
              src={infoImage}
              alt={altInfo}
              width={imgWidth}
              height={imgHeight}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNextPage, setIsNextPage] = useState(false);
  const [showBottomCta, setShowBottomCta] = useState(false);
  const [revealedFoods, setRevealedFoods] = useState<Record<string, boolean>>({});
  const [isSomenPulled, setIsSomenPulled] = useState(false);
  const [isSomenFullyPulled, setIsSomenFullyPulled] = useState(false);
  const [showAccomms, setShowAccomms] = useState(false);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section3TouchStartY = useRef(0);
  const allowSwipeTransition = useRef(false);

  const handleSection3TouchStart = (e: React.TouchEvent) => {
    section3TouchStartY.current = e.touches[0].clientY;
    allowSwipeTransition.current = isSomenFullyPulled;
  };

  const handleSection3TouchMove = (e: React.TouchEvent) => {
    if (!isSomenFullyPulled || showAccomms || !allowSwipeTransition.current) return;
    const touchEndY = e.touches[0].clientY;
    const diffY = section3TouchStartY.current - touchEndY;
    // Swipe up (diffY > 50) triggers entering the Accommodation section
    if (diffY > 50) {
      setShowAccomms(true);
    }
  };

  const handleSection3Wheel = (e: React.WheelEvent) => {
    if (!isSomenFullyPulled || showAccomms) return;
    // Scroll down (deltaY > 15) triggers entering the Accommodation section
    if (e.deltaY > 15) {
      setShowAccomms(true);
    }
  };

  const section2TouchStartY = useRef(0);

  const handleSection2TouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    section2TouchStartY.current = e.touches[0].clientY;
  };

  const handleSection2TouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isOpen || isNextPage || !showBottomCta) return;
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
    if (!isOpen || isNextPage || !showBottomCta) return;
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;

    // Scroll down (deltaY > 15) at the bottom transitions to next page
    if (isAtBottom && e.deltaY > 15) {
      setIsNextPage(true);
    }
  };

  useEffect(() => {
    if (revealedFoods["tomato"] && section3Ref.current) {
      section3Ref.current.scrollTop = 0;
    }
  }, [revealedFoods]);

  const handleFoodClick = (key: string) => {
    if (revealedFoods[key]) return;
    setRevealedFoods((prev) => ({ ...prev, [key]: true }));
    if (key === "tomato") {
      if (section3Ref.current) {
        section3Ref.current.scrollTop = 0;
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    setShowBottomCta(scrollTop + clientHeight >= scrollHeight - 60);
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
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        onScroll={handleScroll}
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
              src="/images/theojesslyn_names.png"
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
            onWheel={handleSection3Wheel}
            onTouchStart={handleSection3TouchStart}
            onTouchMove={handleSection3TouchMove}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              background: "#61291A",
              overflowY: revealedFoods["tomato"] ? "hidden" : "auto",
              overflowX: "hidden",
              touchAction: revealedFoods["tomato"] ? "none" : "auto",
            }}
          >
            <motion.div
              animate={{
                scale: revealedFoods["tomato"] ? 0.62 : 1,
              }}
              transition={{
                duration: 1.2,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                position: "relative",
                width: "100%",
                minHeight: revealedFoods["tomato"]
                  ? `calc(${(784 / 677) * 100 * 0.62}dvh + 48vw)`
                  : `calc(${(784 / 677) * 100}dvh - 10% + 78vw)`,
                transformOrigin: "top center",
              }}
            >
              {/* Direction text on Top Left */}
              <motion.div
                animate={{
                  opacity: revealedFoods["tomato"] ? 0 : 1,
                }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255, 255, 255, 0.88)",
                    fontFamily: "var(--font-geist-sans), var(--font-sans), system-ui, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                    fontWeight: 500,
                  }}
                >
                  * Tap on each Food
                </p>
              </motion.div>

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
                floatDelay={0}
                isRevealed={!!revealedFoods["onigiri"]}
                isZoomedOut={!!revealedFoods["tomato"]}
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
                floatDelay={0.6}
                isRevealed={!!revealedFoods["ricebowl"]}
                isZoomedOut={!!revealedFoods["tomato"]}
                onReveal={() => handleFoodClick("ricebowl")}
              />

              {/* Chopsticks image — static */}
              <div
                style={{
                  position: "absolute",
                  left: `${(-90 / 375) * 100}%`,
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
                left={`${(168 / 375) * 100}%`}
                top={`calc(${(525 / 677) * 100}dvh - 7%)`}
                width={`${(306 / 375) * 100}%`}
                imgWidth={306}
                imgHeight={306}
                zIndex={15}
                floatDelay={1.2}
                isRevealed={!!revealedFoods["sauce"]}
                isZoomedOut={!!revealedFoods["tomato"]}
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
                floatDelay={0.4}
                isRevealed={!!revealedFoods["gunkan"]}
                isZoomedOut={!!revealedFoods["tomato"]}
                onReveal={() => handleFoodClick("gunkan")}
              />

              {/* Tomato */}
              <InteractiveFoodItem
                id="tomato"
                foodImage="/images/theojesslyn_tomato.png"
                infoImage="/images/theojesslyn_tomato_silhouette.png"
                altFood="Tomato"
                altInfo="Tomato Silhouette"
                left={`${(277 / 375) * 100}%`}
                top={`calc(${(779 / 677) * 100}dvh - 10%)`}
                width={`${(153 / 375) * 100}%`}
                imgWidth={153}
                imgHeight={153}
                floatDelay={0.9}
                isRevealed={!!revealedFoods["tomato"]}
                isZoomedOut={!!revealedFoods["tomato"]}
                onReveal={() => handleFoodClick("tomato")}
              />

              {/* Direction hint: * Pull the Somen */}
              <AnimatePresence mode="wait">
                {revealedFoods["tomato"] && !isSomenFullyPulled && (
                  <motion.div
                    key="pull-somen-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setIsSomenPulled(true);
                      setIsSomenFullyPulled(true);
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `calc(${(660 / 677) * 100}dvh - 10%)`,
                      transform: "translateX(-50%)",
                      zIndex: 99999.5,
                      cursor: "pointer",
                      textAlign: "center",
                      display: isSomenPulled ? "none" : "block",
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6], y: [0, -6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "#F3D5B5",
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          fontSize: "0.85rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                          background: "rgba(97,41,26,0.85)",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          border: "1.5px dashed rgba(243, 213, 181, 0.7)",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                        }}
                      >
                        * Pull the Somen
                      </p>
                      <span style={{ fontSize: "1.3rem", color: "#F3D5B5", display: "block", marginTop: "2px" }}>
                        ↑
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Direction hint: * Scroll Down for Accommodation */}
              <AnimatePresence mode="wait">
                {isSomenFullyPulled && !showAccomms && (
                  <motion.div
                    key="scroll-accomms-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `calc(${(660 / 677) * 100}dvh - 10%)`,
                      transform: "translateX(-50%)",
                      zIndex: 99999.5,
                      textAlign: "center",
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6], y: [0, 6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "#F3D5B5",
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          fontSize: "0.85rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                          background: "rgba(97,41,26,0.85)",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          border: "1.5px dashed rgba(243, 213, 181, 0.7)",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                        }}
                      >
                        Swipe to Next
                      </p>
                      <motion.svg
                        width="18"
                        height="10"
                        viewBox="0 0 18 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        style={{ display: "block", margin: "6px auto 0" }}
                      >
                        <path
                          d="M1 1L9 9L17 1"
                          stroke="#F3D5B5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bowl Back — appears at very bottom of page (zIndex: 99998) */}
              <AnimatePresence>
                {revealedFoods["tomato"] && (
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
                {revealedFoods["tomato"] && (
                  <motion.div
                    drag="y"
                    dragConstraints={{ top: -530, bottom: 0 }}
                    dragElastic={0.15}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setIsSomenPulled(true);
                    }}
                    onDragStart={(e) => e.stopPropagation()}
                    onDrag={(e) => e.stopPropagation()}
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
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
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
                {revealedFoods["tomato"] && (
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
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
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
      <FallingLeaves visible={isOpen && !isNextPage} count={18} />

      {/* ── Bottom CTA: "Tap on the Autumn Leaf" (Only visible when scrolled to bottom) ── */}
      <AnimatePresence>
        {isOpen && !isNextPage && showBottomCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsNextPage(true)}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 60,
              padding: "20px 0 28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "var(--font-geist-sans), var(--font-sans), system-ui, sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                  fontWeight: 500,
                }}
              >
                Tap on the Autumn Leaf
              </p>
              <motion.svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  d="M1 1L9 9L17 1"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </motion.div>
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
