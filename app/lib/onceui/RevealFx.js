"use client";
import { useState, useEffect, forwardRef, useRef } from "react";
import styles from "./RevealFx.module.scss";

const RevealFx = forwardRef(function RevealFx(
  {
    children,
    speed = "fast",            // "fast" | "medium" | "slow" | number (ms)
    delay = 0,                 // additional per-card delay (seconds)
    revealedByDefault = false, // start revealed (rare)
    translateY,                // number => rem, string => var(--static-space-*)
    trigger,                   // external control (overrides scroll)
    style,
    className,

    // NEW — scroll reveal controls:
    revealOnScroll = true,     // reveal when entering viewport
    once = true,               // reveal only once
    rootMargin = "0px 0px -12% 0px",
    threshold = 0.15,

    ...rest
  },
  ref
) {
  const [isRevealed, setIsRevealed] = useState(revealedByDefault);
  const [maskRemoved, setMaskRemoved] = useState(false);

  const transitionTimeoutRef = useRef(null);
  const mountDelayRef = useRef(null);
  const ioRef = useRef(null);
  const hostRef = useRef(null);

  // plumb both forwarded ref and local ref
  const setHostRef = (node) => {
    hostRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const getSpeedDurationMs = () => {
    if (typeof speed === "number") return speed;
    switch (speed) {
      case "fast":   return 900;
      case "medium": return 1600;
      case "slow":   return 3000;
      default:       return 1600;
    }
  };
  const getSpeedDuration = () => `${getSpeedDurationMs() / 1000}s`;

  // External trigger (highest priority)
  useEffect(() => {
    if (trigger === undefined) return;
    // reset
    setMaskRemoved(false);
    setIsRevealed(!!trigger);

    if (trigger) {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => setMaskRemoved(true), getSpeedDurationMs());
    }
  }, [trigger]);

  // Scroll-triggered reveal (default behavior)
  useEffect(() => {
    if (trigger !== undefined) return; // external trigger controls it

    const revealNow = () => {
      setIsRevealed(true);
      transitionTimeoutRef.current = setTimeout(() => setMaskRemoved(true), getSpeedDurationMs());
    };

    // Fallback: reveal on mount + delay
    if (!revealOnScroll) {
      mountDelayRef.current = setTimeout(revealNow, delay * 1000);
      return () => clearTimeout(mountDelayRef.current);
    }

    const el = hostRef.current;
    if (!el) return;

    // set up IntersectionObserver
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // respect stagger delay per card
            mountDelayRef.current = setTimeout(revealNow, delay * 1000);
            if (once) io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin, threshold }
    );

    io.observe(el);
    ioRef.current = io;

    return () => {
      if (mountDelayRef.current) clearTimeout(mountDelayRef.current);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, revealOnScroll, once, rootMargin, threshold, trigger]);

  // compute translateY
  const getTranslateYValue = () => {
    if (typeof translateY === "number") return `${translateY}rem`;
    if (typeof translateY === "string")  return `var(--static-space-${translateY})`;
    return undefined;
  };
  const translateValue = getTranslateYValue();

  const revealStyle = {
    transitionDuration: getSpeedDuration(),
    transform: isRevealed
      ? "translateY(0)"
      : translateValue
      ? `translateY(${translateValue})`
      : "translateY(0)",
    width: "100%",
    ...style,
  };

  const common = { ref: setHostRef, style: revealStyle, ...rest };

  if (maskRemoved) {
    return (
      <div {...common} className={`${styles.revealedNoMask} ${className || ""}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      {...common}
      className={`${styles.revealFx} ${isRevealed ? styles.revealed : styles.hidden} ${className || ""}`}
    >
      {children}
    </div>
  );
});

RevealFx.displayName = "RevealFx";
export { RevealFx };
export default RevealFx;