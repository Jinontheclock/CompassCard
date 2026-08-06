import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Dropdown from "../components/Dropdown.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import { FARES, FERRY, ferryRun, fmtDate, offsetOf, MONTH_NAMES_FULL, money } from "../data/seed.js";
import chevron from "../assets/icon-chevron.svg";

/* The fares a walk-on can be: the adult fare the table carries, and the
   child fare BC Ferries halves it to. */
const FARE_TYPES = [
  { id: "adult", label: "Adult walk-on", sub: "Adult foot passenger", fare: FARES.ferryWalkOn },
  { id: "child", label: "Child (5–11) walk-on", sub: "Child foot passenger", fare: FARES.ferryWalkOnChild },
];

const DAY = 24 * 60 * 60 * 1000;
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* The month laid open: a calendar dropped under the date box the way a menu
   drops under its anchor. Days from today to sixty out can be picked; the
   rest are shown but asleep. */
function CalendarPop({ open, value, onPick, onClose }) {
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const [view, setView] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  if (!open) return null;

  const last = new Date(today.getTime() + 59 * DAY);
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = first.getDay();
  const atCurrent = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  return (
    <>
      <button type="button" className="menu-backdrop" aria-label="Close calendar" onClick={onClose} />
      <div className="menu menu--wide cal">
        <div className="cal-head">
          <button
            type="button"
            className="cal-nav"
            disabled={atCurrent}
            aria-label="Previous month"
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          >
            <img src={chevron} alt="" width="7" height="12" style={{ transform: "rotate(180deg)" }} />
          </button>
          <span className="cal-month">
            {MONTH_NAMES_FULL[view.getMonth()]} {view.getFullYear()}
          </span>
          <button
            type="button"
            className="cal-nav"
            aria-label="Next month"
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          >
            <img src={chevron} alt="" width="7" height="12" />
          </button>
        </div>
        <div className="cal-grid">
          {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => (
            <span key={w + i} className="cal-wday">{w}</span>
          ))}
          {Array.from({ length: lead }, (_, i) => (
            <span key={"blank" + i} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
            const dead = d < today || d > last;
            const on = sameDay(d, value);
            return (
              <button
                type="button"
                key={i}
                className={
                  "cal-day" +
                  (on ? " cal-day--on" : "") +
                  (sameDay(d, today) ? " cal-day--today" : "")
                }
                disabled={dead}
                onClick={() => { onPick(d); onClose(); }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* Reserving a sailing, the way BC Ferries' own booking asks it: which fare,
   where from, where to, which day, which departure. The terminals are the
   real Metro Vancouver – Island ones and the partner list follows the route
   map, so a harbour only offers the crossings that exist; the schedule and
   crossing time follow the chosen run. Paying is the next screen's business. */
export default function ReserveFerries({ onBack, backLabel, onNext }) {
  const [fareType, setFareType] = useState(FARE_TYPES[0]);
  const [from, setFrom] = useState("Vancouver (Tsawwassen)");
  const [to, setTo] = useState("Victoria (Swartz Bay)");
  const [date, setDate] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  });
  const [time, setTime] = useState(FERRY.times[ferryRun("Vancouver (Tsawwassen)", "Victoria (Swartz Bay)")][0]);
  const [openMenu, setOpenMenu] = useState(null);

  const run = ferryRun(from, to);

  /* changing an end keeps the other if the route exists, else takes the
     first partner — and the schedule follows the run either way */
  const pickFrom = (t) => {
    const nextTo = FERRY.links[t].includes(to) ? to : FERRY.links[t][0];
    setFrom(t);
    setTo(nextTo);
    setTime(FERRY.times[ferryRun(t, nextTo)][0]);
  };
  const pickTo = (t) => {
    setTo(t);
    setTime(FERRY.times[ferryRun(from, t)][0]);
  };

  const box = (label, shown, key, pop) => (
    <div className="pick-group">
      <span className="pick-label">{label}</span>
      <div className="menu-anchor">
        <button
          type="button"
          className="pick-box pick-box--tap"
          onClick={() => setOpenMenu(openMenu === key ? null : key)}
        >
          <span className="pick-value">{shown}</span>
          <img className="pick-chevron" src={chevron} alt="" width="8" height="14" />
        </button>
        {pop}
      </div>
    </div>
  );
  const menu = (key, options, value, onPick) => (
    <Dropdown
      open={openMenu === key}
      wide
      options={options}
      value={value}
      onPick={onPick}
      onClose={() => setOpenMenu(null)}
    />
  );

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title">Reserve Ferries</h1>
        <p className="scr-sub">Metro Vancouver – Vancouver Island</p>

        <div className="reserve-stack">
          {box(
            "Fare",
            `${fareType.label} · ${money(fareType.fare)}`,
            "fare",
            menu(
              "fare",
              FARE_TYPES.map((f) => ({ label: `${f.label} · ${money(f.fare)}`, value: f })),
              fareType,
              setFareType
            )
          )}
          {box("From", from, "from", menu("from", Object.keys(FERRY.links).map((t) => ({ label: t, value: t })), from, pickFrom))}
          {box("To", to, "to", menu("to", FERRY.links[from].map((t) => ({ label: t, value: t })), to, pickTo))}

          <div className="reserve-row">
            {box(
              "Date",
              fmtDate(date),
              "date",
              <CalendarPop
                open={openMenu === "date"}
                value={date}
                onPick={setDate}
                onClose={() => setOpenMenu(null)}
              />
            )}
            {box("Departure", time, "time", menu("time", FERRY.times[run].map((t) => ({ label: t, value: t })), time, setTime))}
          </div>

          <NotePanel>
            Crossing {FERRY.crossings[run]}, dock to dock. Ticket sales for foot
            passengers end 10 minutes before the sailing.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button
          onClick={() =>
            onNext?.({
              from,
              to,
              time,
              days: offsetOf(date),
              crossing: FERRY.crossings[run],
              fare: fareType.fare,
              fareLabel: fareType.label,
              fareSub: fareType.sub,
            })
          }
        >
          Next · {money(fareType.fare)}
        </Button>
        <p className="scr-footnote">Choose how to pay on the next step.</p>
      </div>

      <HomeIndicator />
    </div>
  );
}
