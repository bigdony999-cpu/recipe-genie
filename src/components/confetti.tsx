import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  "#e2542a",
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
  "#facc15",
  "#34d399",
];

interface Piece {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
  round: boolean;
}

/**
 * A zero-dependency confetti burst (pure framer-motion). Renders a fixed,
 * pointer-events-none overlay that scatters colored paper pieces from the
 * center of the screen and then unmounts itself.
 */
export function ConfettiBurst() {
  const [gone, setGone] = useState(false);

  // Unmount ourselves once the longest piece finishes animating, so the
  // fixed overlay doesn't linger in the DOM after the burst.
  useEffect(() => {
    const timer = window.setTimeout(() => setGone(true), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  const pieces = useMemo<Piece[]>(() => {
    const count = 46;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      const distance = 120 + Math.random() * 220;
      const round = i % 3 === 0;
      const width = round ? 8 + Math.random() * 6 : 6 + Math.random() * 8;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 60,
        rotate: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        width,
        height: round ? width : 10 + Math.random() * 10,
        delay: Math.random() * 0.12,
        duration: 1.4 + Math.random() * 1,
        round,
      };
    });
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y + 240,
            opacity: [1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "absolute left-1/2 top-1/2",
            p.round ? "rounded-full" : "rounded-sm",
          )}
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            marginLeft: -p.width / 2,
            marginTop: -p.height / 2,
          }}
        />
      ))}
    </div>
  );
}
