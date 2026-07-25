"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { WagasaSection } from "@/components/sections/WagasaSection";
import { FallingLeaves } from "@/components/FallingLeaves";

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
  onReveal,
}: InteractiveFoodItemProps) {
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    if (isRevealed) return;
    setShowParticles(true);
    onReveal();
    setTimeout(() => setShowParticles(false), 1000);
  };

  return (
    <motion.div
      animate={
        !isRevealed
          ? { y: [0, -6, 0] }
          : { y: 0 }
      }
      transition={
        !isRevealed
          ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }
          : { duration: 0.4 }
      }
      style={{
        position: "absolute",
        left,
        top,
        width,
        cursor: isRevealed ? "default" : "pointer",
        zIndex,
      }}
      onClick={handleClick}
      whileHover={!isRevealed ? { scale: 1.05, filter: "brightness(1.08)" } : undefined}
      whileTap={!isRevealed ? { scale: 0.95 } : undefined}
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

      {/* Clickability hint pulse aura (when unrevealed) */}
      {!isRevealed && (
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
        {!isRevealed ? (
          <motion.div
            key="food-state"
            initial={{ opacity: 1, scale: 1 }}
            exit={{
              clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
              scale: 0.9,
              opacity: 0,
              rotate: -3,
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
              clipPath: "circle(0% at 50% 50%)",
              scale: 1.15,
              opacity: 0,
              rotate: 3,
            }}
            animate={{
              clipPath: "circle(150% at 50% 50%)",
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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

  const handleFoodClick = (key: string) => {
    if (revealedFoods[key]) return;
    setRevealedFoods((prev) => ({ ...prev, [key]: true }));
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
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          overflowY: "auto",
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
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              background: "#61291A",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div style={{ position: "relative", width: "100%", minHeight: `calc(${(784 / 677) * 100}dvh - 10% + 78vw)` }}>
              {/* Direction text on Top Left */}
              <div
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
              </div>

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
                onReveal={() => handleFoodClick("ricebowl")}
              />

              {/* Chopsticks image */}
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
                onReveal={() => handleFoodClick("tomato")}
              />
            </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
