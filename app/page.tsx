"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "./components/FloatingHearts";

const cardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow:
    "0 25px 50px -12px rgba(136, 19, 55, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)",
};

const HomePage = () => {
  const [name, setName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = () => {
    if (!name.trim()) return;

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/${slug}`;
    setGeneratedLink(link);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = generatedLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGenerateLink();
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-8">
      <FloatingHearts />

      <motion.div
        className="relative z-10 flex max-w-lg flex-col items-center gap-8 rounded-3xl p-8 text-center sm:p-12"
        style={cardStyle}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          💌
        </motion.div>

        <h1
          className="font-dancing text-4xl font-bold tracking-wide sm:text-5xl"
          style={{ color: "#881337" }}
        >
          Valentine&apos;s Day
        </h1>

        <p style={{ color: "#9f1239" }} className="text-base leading-relaxed sm:text-lg">
          Create a special Valentine&apos;s link for your loved one. Enter their
          name below and share the magic!
        </p>

        <div className="flex w-full flex-col gap-3">
          <label htmlFor="valentine-name" className="sr-only">
            Your Valentine&apos;s name
          </label>
          <input
            id="valentine-name"
            type="text"
            placeholder="Enter their name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-full px-6 py-3.5 text-center text-lg shadow-inner outline-none transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              color: "#881337",
              border: "2px solid #fda4af",
            }}
            aria-label="Enter your Valentine's name"
          />

          <motion.button
            onClick={handleGenerateLink}
            className="rounded-full px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "linear-gradient(to right, #e11d48, #ec4899)" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!name.trim()}
            aria-label="Generate Valentine's link"
          >
            Generate Link 💕
          </motion.button>
        </div>

        {generatedLink && (
          <motion.div
            className="flex w-full flex-col gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-medium" style={{ color: "#e11d48" }}>
              Share this link with your Valentine:
            </p>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2.5 shadow-inner"
              style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
            >
              <span className="flex-1 truncate text-sm" style={{ color: "#881337" }}>
                {generatedLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#e11d48" }}
                aria-label="Copy link to clipboard"
                tabIndex={0}
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
};

export default HomePage;
