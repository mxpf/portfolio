// app/components/MenuOverlay.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

type Props = { open: boolean; onClose: () => void };

const LINKS = ["Equitable", "Stüssy", "Nike", "Aesop", "Nitro", "Prince"];

/* --- timings --- */
const EASE: [number, number, number, number] = [0.2, 0.65, 0.2, 1];
const AFTER_LIST_DELAY = 0.5; // delay for About, Contact, Close

/* --- shade --- */
const shade = {
  initial: { y: "-100%" },
  animate: { y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { y: "-100%", transition: { delay: 0.75, duration: 0.6, ease: EASE } },
};

/* --- list variants --- */
const list = {
  hidden: {},
  show: { transition: { delayChildren: 0.45, staggerChildren: 0.12 } },
  exit: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
};

const item = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
    transition: { duration: 1, ease: EASE },
  },
};

export default function MenuOverlay({ open, onClose }: Props) {
  const loseRef = useRef<HTMLSpanElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // measure “lose” for the Close hover reveal
  useEffect(() => {
    if (!btnRef.current || !loseRef.current) return;
    const setWidthVar = () => {
      const w = Math.ceil(loseRef.current!.scrollWidth);
      if (w > 0) btnRef.current!.style.setProperty("--enu-w", `${w}px`);
    };
    setWidthVar();
    (document as any).fonts?.ready?.then(setWidthVar);
    const ro = new ResizeObserver(setWidthVar);
    ro.observe(loseRef.current!);
    window.addEventListener("resize", setWidthVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setWidthVar);
    };
  }, []);

  const textClass = "text-[clamp(26px,5vw,40px)] leading-[1] font-semibold";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] text-black" initial="initial" animate="animate" exit="exit">
          {/* shade */}
          <motion.div variants={shade} className="absolute inset-0 bg-white z-0" />

          {/* content */}
          <div className="relative h-full z-10">
            {/* LEFT LIST */}
            <motion.ul
              variants={list}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute left-[var(--gutter)] top-[calc(var(--gutter)-var(--cap-crop))] space-y-3"
            >
              {LINKS.map((label) => (
                <motion.li key={label} variants={item} className={`group/row relative ${textClass}`}>
                  {/* Arrow mask at original left edge */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[1em] w-[var(--arrow-w)] overflow-hidden"
                  >
                    <span
                      className="block h-full w-[var(--arrow-w)]
                                 bg-[url('/arrow.svg')] bg-no-repeat bg-left bg-contain
                                 -translate-x-full transition-transform duration-300
                                 group-hover/row:translate-x-0"
                    />
                  </span>

                  {/* Label shifts to make room for arrow (+ a hair more) */}
                  <span className="inline-block transition-[padding] duration-300 pl-0 group-hover/row:pl-[calc(var(--arrow-w)+0.25em)]">
                    {label}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* ABOUT — delayed */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: AFTER_LIST_DELAY, duration: 0.5, ease: EASE }}
              className={`group/row fixed left-[var(--gutter)] bottom-[var(--gutter)] ${textClass}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[1em] w-[var(--arrow-w)] overflow-hidden"
              >
                <span
                  className="block h-full w-[var(--arrow-w)]
                             bg-[url('/arrow.svg')] bg-no-repeat bg-left bg-contain
                             -translate-x-full transition-transform duration-300
                             group-hover/row:translate-x-0"
                />
              </span>
              <span className="inline-block transition-[padding] duration-300 pl-0 group-hover/row:pl-[calc(var(--arrow-w)+0.25em)]">
                About
              </span>
            </motion.div>

            {/* CONTACT (menu) — mirrored hover & delayed */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: AFTER_LIST_DELAY, duration: 0.5, ease: EASE }}
              className={`group/row fixed right-[var(--gutter)] bottom-[var(--gutter)] ${textClass}`}
            >
              {/* label slides RIGHT smoothly (no jump) */}
              <span
                className="
                  inline-block
                  transform translate-x-0
                  transition-transform duration-300
                  group-hover/row:translate-x-[calc(var(--arrow-w)+0.25em)]
                "
              >
                Contact
              </span>

              {/* Arrow mask at right edge; arrow slides IN from the right */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[1em] w-[var(--arrow-w)] overflow-hidden"
              >
                <span
                  className="
                    block h-full w-[var(--arrow-w)]
                    bg-[url('/arrow.svg')] bg-no-repeat bg-right bg-contain
                    translate-x-full group-hover/row:translate-x-0
                    -scale-x-100
                    transition-transform duration-300
                  "
                />
              </span>
            </motion.div>

            {/* CLOSE — via portal, delayed */}
            {mounted &&
              createPortal(
                <motion.button
                  ref={btnRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: AFTER_LIST_DELAY, duration: 0.35, ease: EASE }}
                  onClick={onClose}
                  aria-label="Close menu"
                  className="group fixed text-black text-[clamp(26px,5vw,40px)] font-semibold leading-[1]
                             cursor-pointer pointer-events-auto relative inline-flex items-center"
                  style={{
                    top: 40,
                    right: 40,
                    left: "auto",
                    position: "fixed",
                    transform: "none",
                    zIndex: 2147483647,
                  }}
                >
                  <span className="menu-m pointer-events-none block leading-[1] font-semibold">C</span>
                  <span
                    aria-hidden="true"
                    className="menu-reveal pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden"
                  >
                    <span ref={loseRef} className="menu-enu block whitespace-nowrap leading-[1] font-semibold">
                      lose
                    </span>
                  </span>
                </motion.button>,
                document.body
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}