"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import RevealFx from "@/app/lib/onceui/RevealFx";

import hero1 from "@/public/images/hero1.png";
import hero2 from "@/public/images/hero2.png";
import hero3 from "@/public/images/hero3.png";
import hero4 from "@/public/images/hero4.png";
import hero5 from "@/public/images/hero5.png";

const projects = [
  { title: "Stüssy", src: hero1 },
  { title: "Nike",   src: hero2 },
  { title: "Aesop",  src: hero3 },
  { title: "Nitro",  src: hero4 },
  { title: "Prince", src: hero5 },
];

export default function HomePage() {
  // fade the center "Portfolio" title as you scroll
  const { scrollY } = useScroll();
  const centerOpacity = useTransform(scrollY, [0, 40, 120], [1, 0.5, 0]);

  useEffect(() => {
    const el = document.getElementById("centerTitle");
    if (!el) return;
    const unsub = centerOpacity.on("change", (v) => (el.style.opacity = String(v)));
    return () => unsub();
  }, [centerOpacity]);

  return (
    <main className="space-y-[var(--gutter)]">
      {/* HERO — reveal immediately (not on scroll) */}
      <section className="frame pb-[var(--gutter)]">
        <RevealFx
          className="rounded-[12px] overflow-hidden"
          translateY={1}
          delay={0}
          speed="slow"
          revealOnScroll={false}
        >
          <div
            className="relative w-full"
            style={{ height: "calc(100svh - var(--header-h) - var(--gutter))" }}
          >
            <Image
              src={projects[0].src}
              alt={projects[0].title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </RevealFx>
        <div className="card-title">{projects[0].title}</div>
      </section>

      {/* LIST — reveal on scroll with small stagger */}
      <section className="frame space-y-[var(--gutter)] pb-[var(--gutter)]">
        {projects.slice(1).map((p, i) => (
          <article key={p.title}>
            <RevealFx
              className="rounded-[12px] overflow-hidden"
              translateY={0.5}
              delay={0.06 * (i + 1)}
              speed="slow"
              rootMargin="0px 0px -12% 0px"
              threshold={0.20}
            >
              <div className="relative w-full" style={{ height: "min(72vh, 760px)" }}>
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="100vw"
                  decoding="async"
                  className="object-cover"
                />
              </div>
            </RevealFx>
            <h3 className="card-title">{p.title}</h3>
          </article>
        ))}
      </section>

      {/* hard stop between list and footer to prevent caption peeking */}
      <div className="frame" aria-hidden style={{ height: "var(--gutter)" }} />

      {/* FOOTER (fills the viewport at the end) */}
      <footer className="full-viewport">
        {/* grid rows: [paragraph][flex spacer][bottom block] */}
        <div className="w-full grid flex-1" style={{ gridTemplateRows: "auto 1fr auto" }}>
          <p className="text-[clamp(22px,4vw,40px)] leading-tight font-medium">
            We reduce where necessary and create where it matters. Less frills, more substance.
            Embracing a minimal approach, we distill ideas to their essence.
          </p>

          <div />

<div className="text-[clamp(22px,4vw,40px)] leading-tight font-medium flex items-end justify-between gap-4">
  <div>© Max Pfennighaus</div>
  <a
    href="mailto:hello@example.com"
    className="underline underline-offset-4"
  >
    Contact
  </a>
</div>
        </div>
      </footer>
    </main>
  );
}