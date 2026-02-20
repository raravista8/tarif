"use client";

import { useState, useEffect, useCallback } from "react";
import type { Region } from "@/types";

export function useRegion() {
  const [region, setRegionState] = useState<Region | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [regionsRes, detectRes] = await Promise.all([
          fetch("/api/v1/regions").then((r) => r.json()),
          fetch("/api/v1/regions/detect").then((r) => r.json()),
        ]);
        setRegions(regionsRes);

        const stored = localStorage.getItem("region_slug");
        if (stored) {
          const found = regionsRes.find((r: Region) => r.slug === stored);
          if (found) {
            setRegionState(found);
          } else {
            setRegionState(detectRes);
          }
        } else {
          setRegionState(detectRes);
        }
      } catch {
        // fallback
        setRegionState({ id: 1, slug: "moscow", name: "Москва и МО" });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const setRegion = useCallback((r: Region) => {
    setRegionState(r);
    localStorage.setItem("region_slug", r.slug);
  }, []);

  return { region, regions, loading, setRegion };
}
