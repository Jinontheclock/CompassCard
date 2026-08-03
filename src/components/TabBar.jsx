import cardOn from "../assets/icon-tab-card-on.svg";
import cardOff from "../assets/icon-tab-card-off.svg";
import ticketsOn from "../assets/icon-tab-tickets-on.svg";
import ticketsOff from "../assets/icon-tab-tickets-off.svg";

/* The floating bar the app rests on: two tabs, no more. The glyphs are Figma
   exports and each carries its own colour, so a tab swaps its file rather
   than recolouring one. */
const TABS = [
  { id: "card", label: "Compass Card", on: cardOn, off: cardOff },
  { id: "tickets", label: "Tickets", on: ticketsOn, off: ticketsOff },
];

export default function TabBar({ active = "card", onSelect }) {
  return (
    <div className="tab-bar">
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
