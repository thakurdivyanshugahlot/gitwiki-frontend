"use client";
import { useEffect, useRef, useState } from "react";

export function usePoll(url, { enabled = true, interval = 1500 } = {}) {
  const [data, setData] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (!enabled || !url) return;
    let cancelled = false;

    async function tick() {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (cancelled) return;
      setData(json);
      if (json.status === "pending") timer.current = setTimeout(tick, interval);
    }

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [url, enabled, interval]);

  return { data };
}