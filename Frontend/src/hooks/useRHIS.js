import { useState, useEffect } from "react";
import { INIT_ACTIVITY, ROLLING_EVENTS } from "../data/constants";

// ─── Live clock + pulse ───────────────────────────────────────────────────
export function useClock() {
  const [time, setTime]   = useState(new Date());
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setTime(new Date()); setPulse(p => !p); }, 1000);
    return () => clearInterval(t);
  }, []);
  return { time, pulse };
}

// ─── Rolling activity feed ────────────────────────────────────────────────
export function useActivityFeed() {
  const [activity, setActivity] = useState(INIT_ACTIVITY);
  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      const ts = new Date().toTimeString().slice(0, 8);
      setActivity(prev => [{ time: ts, ...ROLLING_EVENTS[idx % ROLLING_EVENTS.length] }, ...prev.slice(0, 29)]);
      idx++;
    }, 7000);
    return () => clearInterval(t);
  }, []);
  return activity;
}