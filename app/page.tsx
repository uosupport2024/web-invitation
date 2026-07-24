import { WagasaSection } from "@/components/sections/WagasaSection";

export default function Home() {
  return (
    // Outer: full screen, black background (letterbox on desktop)
    <div className="min-h-screen bg-black flex items-start justify-center">
      {/* Phone frame: max 375/812 ratio, fills viewport height */}
      <div
        style={{
          width: "min(100vw, calc(100vh * 375 / 677))",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <WagasaSection />
      </div>
    </div>
  );
}
