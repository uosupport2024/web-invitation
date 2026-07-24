"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function WagasaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Top Left Wagasa Accent */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 opacity-35 dark:opacity-20"
        animate={{
          rotate: [0, 360],
          y: [0, 12, 0],
        }}
        transition={{
          rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/images/wagasa.png"
          alt="Japanese Wagasa Umbrella Accent"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Top Right Wagasa Accent */}
      <motion.div
        className="absolute top-1/4 -right-28 w-80 h-80 md:w-[420px] md:h-[420px] opacity-25 dark:opacity-15"
        animate={{
          rotate: [360, 0],
          x: [0, -15, 0],
        }}
        transition={{
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/images/wagasa-1.png"
          alt="Japanese Wagasa Umbrella Accent 1"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Center Left Wagasa Accent */}
      <motion.div
        className="absolute top-2/3 -left-32 w-80 h-80 md:w-[400px] md:h-[400px] opacity-30 dark:opacity-20"
        animate={{
          rotate: [0, 360],
          y: [0, -18, 0],
        }}
        transition={{
          rotate: { duration: 100, repeat: Infinity, ease: "linear" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/images/wagasa-2.png"
          alt="Japanese Wagasa Umbrella Accent 2"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Bottom Right Wagasa Accent */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-72 h-72 md:w-96 md:h-96 opacity-35 dark:opacity-20"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 110, repeat: Infinity, ease: "linear" },
          scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/images/wagasa.png"
          alt="Japanese Wagasa Umbrella Accent Bottom"
          fill
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}
