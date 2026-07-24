"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SceneState } from "./types";

interface TripleCloudBackgroundProps {
  scene: SceneState;
  isExiting: boolean;
}

export function TripleCloudBackground({ scene, isExiting }: TripleCloudBackgroundProps) {
  return (
    <>
      {/* Background — transisi ke warna #DBAF8C saat terbuka */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        animate={{
          background: isExiting ? "#DBAF8C" : "#E5C7A5",
        }}
        transition={{ duration: 2.0, ease: "easeInOut" }}
      />

      {/* Triple Cloud Background Layers — 900x1600 full canvas layering */}
      {/* Layer 1 (Awan Bawah): trippleawan-02.png — tampil di scene1, scene2, scene4 */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: scene === "scene3" ? 0 : 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
      >
        <Image
          src="/images/theojesslyn_trippleawan-02.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />
      </motion.div>

      {/* Layer 2 (Awan Tengah): trippleawan-01.png */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scene === "scene4" ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.15, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
      >
        <Image
          src="/images/theojesslyn_trippleawan-01.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />
      </motion.div>

      {/* Layer 3 (Awan Atas Overlay): trippleawan-03.png */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scene === "scene4" ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
      >
        <Image
          src="/images/theojesslyn_trippleawan-03.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />
      </motion.div>
    </>
  );
}
