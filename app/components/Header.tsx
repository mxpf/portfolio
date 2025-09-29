"use client";

import { useEffect, useRef } from "react";

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);

  // Keep --header-h in sync with rendered header height
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
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50"
      // no padding here; we’ll put it on the row itself
      style={{ paddingBlock: 0 }}
    >
      <div className="w-full px-[var(--gutter)]">
        <div
          className="grid grid-cols-[1fr_auto_1fr] items-center leading-none"
          style={
            {
              // own the nav typography on the row
              "--navSize": "clamp(26px,5vw,40px)",
              fontSize: "var(--navSize)",
              lineHeight: 1,
              // exact visual 40px top/bottom: subtract a tiny em to remove font leading
              paddingBlock: "calc(var(--gutter) - 0.14em)",
            } as React.CSSProperties
          }
        >
          <div className="justify-self-start font-medium">Max®</div>
          <div id="centerTitle" className="justify-self-center font-semibold">
            Portfolio
          </div>
          <div className="justify-self-end font-medium">M</div>
        </div>
      </div>
    </header>
  );
}