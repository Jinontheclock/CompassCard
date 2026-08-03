import { useEffect, useRef, useState } from "react";
import cardOn from "../assets/icon-tab-card-on.svg";
import cardOff from "../assets/icon-tab-card-off.svg";
import ticketsOn from "../assets/icon-tab-tickets-on.svg";
import ticketsOff from "../assets/icon-tab-tickets-off.svg";

/* The floating bar the app rests on: two tabs, no more. The glyphs are Figma
   exports and each carries its own colour, so a tab swaps its file rather
   than recolouring one.

   The grey box marking the chosen tab is one element that travels. A tab
   change swaps the whole screen, so the bar remembers where the box last
   stood across screens and slides it from there on arrival — the two bars
   crossfading play one continuous move. */
const TABS = [
  { id: "card", label: "Compass Card", on: cardOn, off: cardOff },
  { id: "tickets", label: "Tickets", on: ticketsOn, off: ticketsOff },
];
/* x of each tab inside the bar: 4 of padding, then a 140 tab and 16 of gap */
const AT = { card: 4, tickets: 160 };
let lastActive = "card";

export default function TabBar({ active = "card", onSelect }) {
  const cameFrom = useRef(lastActive);
  const [settled, setSettled] = useState(cameFrom.current === active);

  useEffect(() => {
    lastActive = active;
    if (settled) return undefined;
    /* one painted frame at the old position, then the slide */
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)));
    return () => cancelAnimationFrame(raf);
  }, [active, settled]);

  const x = AT[settled ? active : cameFrom.current] ?? AT.card;

  return (
    <div className="tab-bar">
      <span className="tab-indicator" style={{ transform: `translateX(${x}px)` }} />
      {TABS.map((tab) => {
        const on = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            className={"tab" + (on ? " tab--active" : "")}
            aria-current={on ? "page" : undefined}
            onClick={() => onSelect?.(tab.id)}
          >
            <img src={on ? tab.on : tab.off} alt="" width="24" height="24" />
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
