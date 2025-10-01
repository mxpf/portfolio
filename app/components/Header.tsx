// app/components/Header.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import MenuOverlay from "./MenuOverlay";

/** Right-side hover control: "M" reveals to "Menu" */
function MenuButton({ onClick }: { onClick: () => void }) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const enuRef = useRef<HTMLSpanElement | null>(null);

  // measure the width of "enu" so the M slides exactly that far
  useEffect(() => {
    const setWidthVar = () => {
      if (!btnRef.current || !enuRef.current) return;
      const w = Math.ceil(enuRef.current.scrollWidth);
      if (w > 0) btnRef.current.style.setProperty("--enu-w", `${w}px`);
    };
    setWidthVar();
    if ((document as any).fonts?.ready) (document as any).fonts.ready.then(setWidthVar);
    const ro = new ResizeObserver(setWidthVar);
    if (enuRef.current) ro.observe(enuRef.current);
    window.addEventListener("resize", setWidthVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setWidthVar);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className="group relative inline-flex items-center justify-self-end cursor-pointer select-none"
    >
      {/* Static M (slides left by --enu-w on hover) */}
      <span className="menu-m pointer-events-none block text-[clamp(26px,5vw,40px)] font-medium leading-tight">
        M
      </span>

      {/* “enu” wrapper grows from 0 → --enu-w */}
      <span
        aria-hidden="true"
        className="menu-reveal pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden"
      >
        <span
          ref={enuRef}
          className="menu-enu block whitespace-nowrap text-[clamp(26px,5vw,40px)] font-medium leading-tight"
        >
          enu
        </span>
      </span>
    </button>
  );
}

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep --header-h synced to the rendered header height
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const h = Math.round(ref.current.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-50"
        style={{ paddingBlock: "var(--gutter)" }} // 40px above & below the row
      >
        {/* full-width row with 40px side gutters */}
        <div className="w-full px-[var(--gutter)]">
          {/* Equal side tracks => true centered title */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* left */}
            <div className="justify-self-start text-[clamp(26px,5vw,40px)] leading-tight font-medium">
              Max®
            </div>

            {/* center (fades via page script) */}
            <div
              id="centerTitle"
              className="justify-self-center text-[clamp(26px,5vw,40px)] leading-tight font-semibold"
            >
              Portfolio
            </div>

            {/* right: hover “M → Menu”, click opens overlay */}
            <MenuButton onClick={() => setMenuOpen(true)} />
          </div>
        </div>
      </header>

      {/* top “window-shade” overlay */}
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}