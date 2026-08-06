import { motion } from "framer-motion";
import { useMemo } from "react";

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
  emoji: string | null;
}

const EMOJI = ["🍳", "🥘", "✨", "🎉", "🍝", "🧑‍🍳"];

/**
 * A zero-dependency confetti burst (pure framer-motion). Renders a fixed,
 * pointer-events-none overlay that scatters colored pieces + food emoji from
 * the center of the screen and then unmounts itself.
 */
export function ConfettiBurst() {
  const pieces = useMemo<Piece[]>(() => {
    const count = 42;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      const distance = 120 + Math.random() * 220;
      const isEmoji = i % 6 === 0;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 60,
        rotate: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        width: 6 + Math.random() * 8,
        height: 10 + Math.random() * 10,
        delay: Math.random() * 0.12,
        duration: 1.4 + Math.random() * 1,
        emoji: isEmoji ? EMOJI[Math.floor(Math.random() * EMOJI.length)] : null,
      };
    });
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {pieces.map((p) =>
        p.emoji ? (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: p.x,
              y: p.y + 200,
              opacity: [1, 1, 0],
              scale: [0.4, 1.4, 1],
              rotate: p.rotate,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute left-1/2 top-1/2 text-2xl"
            style={{ marginLeft: -14, marginTop: -14 }}
          >
            {p.emoji}
          </motion.span>
        ) : (
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
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{
              width: p.width,
              height: p.height,
              backgroundColor: p.color,
              marginLeft: -p.width / 2,
              marginTop: -p.height / 2,
            }}
          />
        ),
      )}
    </div>
  );
}
