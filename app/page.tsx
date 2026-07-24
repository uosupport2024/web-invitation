import { WagasaSection } from "@/components/sections/WagasaSection";

export default function Home() {
  return (
    // Full screen, black bg as fallback
    <div style={{ width: "100%", height: "100dvh", background: "#000", overflow: "hidden" }}>
      <WagasaSection />
    </div>
  );
}
