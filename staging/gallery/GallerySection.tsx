"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GalleryPhoto } from "@/lib/types";

const AUTO_MS = 4200;

export function GallerySection({ photos }: { photos: GalleryPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ startX: number; scrollLeft: number; moved: boolean } | null>(null);

  const items =
    photos.length > 0
      ? photos
      : [];

  const count = items.length;

  useEffect(() => {
    if (count === 0 || paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || count === 0) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, [index, count]);

  function go(delta: number) {
    if (count === 0) return;
    setIndex((current) => (current + delta + count) % count);
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) return;
    setPaused(true);
    drag.current = {
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    const state = drag.current;
    if (!el || !state) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 6) state.moved = true;
    el.scrollLeft = state.scrollLeft - dx;
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    const state = drag.current;
    drag.current = null;
    if (!el || !state) return;
    el.releasePointerCapture(e.pointerId);

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) {
      setPaused(false);
      return;
    }

    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    children.forEach((child, i) => {
      const mid = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });

    if (state.moved) {
      const dx = e.clientX - state.startX;
      if (dx < -40) nearest = Math.min(count - 1, index + 1);
      if (dx > 40) nearest = Math.max(0, index - 1);
    }

    setIndex(nearest);
    window.setTimeout(() => setPaused(false), 1200);
  }

  if (count === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {["Bruno & Juliana", "Juntos", "Nossa história", "Em breve"].map((label) => (
          <div
            key={label}
            className="relative flex aspect-[3/4] items-end overflow-hidden bg-gradient-to-br from-navy/10 via-cream-deep to-navy/20 p-4"
          >
            <span className="font-display text-xl text-navy/70">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((photo, i) => (
          <figure
            key={photo.id}
            className={`relative aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden bg-cream-deep transition duration-500 sm:w-[52%] md:w-[38%] lg:w-[30%] ${
              i === index ? "opacity-100 shadow-[0_18px_40px_rgba(27,42,74,0.14)]" : "opacity-70"
            }`}
          >
            <Image
              src={photo.public_url}
              alt={photo.caption || "Bruno e Juliana"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 35vw"
              draggable={false}
            />
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {items.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Ir para foto ${i + 1}`}
              onClick={() => {
                setPaused(true);
                setIndex(i);
                window.setTimeout(() => setPaused(false), 1500);
              }}
              className={`h-1.5 transition-all ${
                i === index ? "w-8 bg-navy" : "w-1.5 bg-navy/25 hover:bg-navy/45"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => go(-1)}
            className="border border-navy/20 px-3 py-2 text-xs tracking-[0.14em] text-navy uppercase transition hover:border-navy/40"
          >
            Anterior
          </button>
          <button
            type="button"
            aria-label="Próxima foto"
            onClick={() => go(1)}
            className="bg-navy px-3 py-2 text-xs tracking-[0.14em] text-cream uppercase transition hover:bg-navy-soft"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
