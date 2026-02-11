"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import FloatingHearts from "../components/FloatingHearts";

// ── Helpers ──

const decodeName = (slug: string): string => {
  const decoded = decodeURIComponent(slug);
  return decoded
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const PLAYFUL_MESSAGES = [
  "Are you sure? 🤔",
  "Think again! 💭",
  "Wrong button! 😜",
  "Try the other one! 👆",
  "You can't escape love! 💘",
  "Nice try! 😂",
  "Nope, not that one! 🙈",
  "C'mon, you know you want to! 💕",
  "The answer is Yes! 😏",
  "Really?! 🥺",
];

const HEART_EMOJIS = ["💖", "💕", "💗", "💝", "💘", "❤️", "💞", "🩷", "💓", "💛"];

type BurstHeart = {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

// ── Main component ──

const ValentinePage = () => {
  const params = useParams();
  const nameSlug = (params.name as string) || "";
  const displayName = decodeName(nameSlug);

  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState<{ top: string; left: string } | null>(null);
  const [playfulMsg, setPlayfulMsg] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);
  const [yesScale, setYesScale] = useState(1);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // ── No button escape logic ──

  const handleNoEscape = useCallback(() => {
    const padding = 80;
    const maxX = typeof window !== "undefined" ? window.innerWidth - padding * 2 : 300;
    const maxY = typeof window !== "undefined" ? window.innerHeight - padding * 2 : 300;

    const newLeft = Math.max(padding, Math.floor(Math.random() * maxX));
    const newTop = Math.max(padding, Math.floor(Math.random() * maxY));

    setNoPosition({
      top: `${newTop}px`,
      left: `${newLeft}px`,
    });

    // Show playful message
    setPlayfulMsg(PLAYFUL_MESSAGES[msgIndex % PLAYFUL_MESSAGES.length]);
    setMsgIndex((prev) => prev + 1);

    // Make Yes button grow slightly each time
    setYesScale((prev) => Math.min(prev + 0.08, 1.6));
  }, [msgIndex]);

  // ── Yes button handler ──

  const handleYes = () => {
    setAccepted(true);

    // Generate burst hearts
    const hearts: BurstHeart[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      left: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 1.5,
    }));
    setBurstHearts(hearts);
  };

  // ── Reset no-button position on window resize ──

  useEffect(() => {
    const handleResize = () => {
      if (noPosition) {
        setNoPosition(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [noPosition]);

  // ── Shared card style ──
  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 25px 50px -12px rgba(136, 19, 55, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)",
  };

  // ── STATE 2: The Celebration ──

  if (accepted) {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-8">
        <FloatingHearts />

        {/* Heart burst */}
        <div className="heart-burst" aria-hidden="true">
          {burstHearts.map((heart) => (
            <span
              key={heart.id}
              className="burst-heart"
              style={{
                left: `${heart.left}%`,
                fontSize: `${heart.size}rem`,
                animationDuration: `${heart.duration}s`,
                animationDelay: `${heart.delay}s`,
              }}
            >
              {heart.emoji}
            </span>
          ))}
        </div>

        <motion.div
          className="relative z-10 flex max-w-lg flex-col items-center gap-6 rounded-3xl p-8 text-center sm:gap-8 sm:p-12"
          style={cardStyle}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <motion.div
            className="text-7xl sm:text-8xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            💖
          </motion.div>

          <motion.h1
            className="font-dancing text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
            style={{ color: "#881337" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            I Love You,
          </motion.h1>

          <motion.h2
            className="font-dancing text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ color: "#be123c" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {displayName}! 💕
          </motion.h2>

          <motion.p
            className="mt-2 text-lg sm:text-xl"
            style={{ color: "#9f1239" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            You just made my heart skip a beat! 🥰
          </motion.p>

          <motion.div
            className="mt-4 flex gap-3 text-4xl sm:text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            aria-hidden="true"
          >
            {["💗", "💖", "💕", "💝", "💗"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </main>
    );
  }

  // ── STATE 1: The Ask ──

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-8">
      <FloatingHearts />

      <motion.div
        className="relative z-10 flex max-w-lg flex-col items-center gap-6 rounded-3xl p-8 text-center sm:gap-8 sm:p-12"
        style={cardStyle}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-6xl sm:text-7xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          💝
        </motion.div>

        <h1
          className="gentle-bounce font-dancing text-4xl font-bold leading-tight tracking-wide sm:text-5xl md:text-6xl"
          style={{ color: "#881337" }}
        >
          Will You Be My Valentine?
        </h1>

        <motion.h2
          className="font-dancing text-3xl font-semibold sm:text-4xl"
          style={{ color: "#be123c" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {displayName}
        </motion.h2>

        {/* Playful message */}
        <AnimatePresence mode="wait">
          {playfulMsg && (
            <motion.p
              key={playfulMsg}
              className="text-lg font-medium"
              style={{ color: "#e11d48" }}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {playfulMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Buttons container */}
        <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {/* Yes button */}
          <motion.button
            onClick={handleYes}
            className="pulse-glow rounded-full px-10 py-4 text-xl font-bold text-white shadow-xl sm:text-2xl"
            style={{
              background: "linear-gradient(to right, #e11d48, #ec4899)",
              transform: `scale(${yesScale})`,
            }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.95 }}
            aria-label="Yes, I will be your Valentine"
            tabIndex={0}
          >
            Yes 💖
          </motion.button>

          {/* No button - escapes! */}
          {!noPosition ? (
            <motion.button
              ref={noButtonRef}
              onMouseEnter={handleNoEscape}
              onTouchStart={handleNoEscape}
              className="rounded-full px-10 py-4 text-xl font-semibold shadow-md sm:text-2xl"
              style={{
                backgroundColor: "#ffffff",
                color: "#f43f5e",
                border: "2px solid #fda4af",
              }}
              whileHover={{ scale: 1.02 }}
              aria-label="No"
              tabIndex={0}
            >
              No 😢
            </motion.button>
          ) : (
            <motion.button
              ref={noButtonRef}
              onMouseEnter={handleNoEscape}
              onTouchStart={handleNoEscape}
              className="fixed z-50 rounded-full px-8 py-3 text-lg font-semibold shadow-lg"
              style={{
                top: noPosition.top,
                left: noPosition.left,
                backgroundColor: "#ffffff",
                color: "#f43f5e",
                border: "2px solid #fda4af",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              aria-label="No"
              tabIndex={0}
            >
              No 😢
            </motion.button>
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default ValentinePage;
