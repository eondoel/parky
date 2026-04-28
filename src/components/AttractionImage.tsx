"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface AttractionImageProps {
  attractionName: string;
  parkName: string;
  className?: string;
}

const cache = new Map<string, string | null>();

export default function AttractionImage({ attractionName, parkName, className }: AttractionImageProps) {
  const key = `${attractionName}__${parkName}`;
  const [url, setUrl] = useState<string | null | undefined>(cache.has(key) ? cache.get(key) : undefined);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Only fetch when scrolled into view
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

  return (
    <div ref={ref} className={className}>
      {url && !error ? (
        <Image
          src={url}
          alt={attractionName}
          fill
          className="object-cover"
          onError={() => setError(true)}
          sizes="80px"
          unoptimized
        />
      ) : url === null || error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <ImageOff className="w-4 h-4 text-gray-300" />
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
