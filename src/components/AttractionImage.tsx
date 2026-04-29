"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface AttractionImageProps {
  attractionName: string;
  parkName: string;
  parkImage: string;
  className?: string;
}

const CACHE_VERSION = "v3";
const cache = new Map<string, string | null>();

export default function AttractionImage({ attractionName, parkName, parkImage, className }: AttractionImageProps) {
  const key = `${CACHE_VERSION}__${attractionName}__${parkName}`;
  const [url, setUrl] = useState<string | null | undefined>(cache.has(key) ? cache.get(key) : undefined);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || cache.has(key)) return;
    fetch(`/api/attraction-image?name=${encodeURIComponent(attractionName)}&park=${encodeURIComponent(parkName)}`)
      .then(r => r.json())
      .then(d => { cache.set(key, d.url ?? null); setUrl(d.url ?? null); })
      .catch(() => { cache.set(key, null); setUrl(null); });
  }, [visible, key, attractionName, parkName]);

  // Determine what src to show — attraction-specific or park fallback
  const displayUrl = (url && !imgError) ? url : (url === null || imgError) ? parkImage : null;

  return (
    <div ref={ref} className={className}>
      {displayUrl ? (
        <Image
          src={displayUrl}
          alt={attractionName}
          fill
          className="object-cover"
          onError={() => {
            if (displayUrl !== parkImage) setImgError(true);
          }}
          sizes="80px"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
