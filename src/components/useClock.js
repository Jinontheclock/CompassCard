import { useEffect, useState } from "react";

/* The status bar keeps the phone's real time, written the iOS way — no
   leading zero, no AM or PM. It checks twice a minute, which is as often
   as a minute can change. */
const clockNow = () => {
  const d = new Date();
  return (d.getHours() % 12 || 12) + ":" + String(d.getMinutes()).padStart(2, "0");
};

export function useClock() {
  const [time, setTime] = useState(clockNow);
  useEffect(() => {
    const id = setInterval(() => setTime(clockNow()), 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}
