import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Dropdown from "../components/Dropdown.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import { FARES, FERRY, FERRY_DATES, ferryRun, money } from "../data/seed.js";
import chevron from "../assets/icon-chevron.svg";

/* Reserving a sailing, the way BC Ferries' own booking asks it: where from,
   where to, which day, which departure. The terminals are the real Metro
   Vancouver – Island ones and the partner list follows the route map, so a
   harbour only offers the crossings that exist; the schedule and crossing
   time follow the chosen run. The fare is the walk-on fare and it comes off
   stored value, so a card short of it is told to reload rather than
   charged — the same rule everywhere money moves in this app. */
export default function ReserveFerries({ card, onBack, onReserve }) {
  const [from, setFrom] = useState("Vancouver (Tsawwassen)");
  const [to, setTo] = useState("Victoria (Swartz Bay)");
  const [date, setDate] = useState(FERRY_DATES[0].date);
  const [time, setTime] = useState(FERRY.times[ferryRun("Vancouver (Tsawwassen)", "Victoria (Swartz Bay)")][0]);
  const [openMenu, setOpenMenu] = useState(null);
  const [warn, setWarn] = useState(false);

  const run = ferryRun(from, to);
  const times = FERRY.times[run];
  const short = !card || card.balance < FARES.ferryWalkOn;

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

  const picker = (label, value, options, onPick, key) => (
    <div className="pick-group">
      <span className="pick-label">{label}</span>
      <div className="menu-anchor">
        <button
          type="button"
          className="pick-box pick-box--tap"
          onClick={() => setOpenMenu(openMenu === key ? null : key)}
        >
          <span className="pick-value">{value}</span>
          <img className="pick-chevron" src={chevron} alt="" width="8" height="14" />
        </button>
        <Dropdown
          open={openMenu === key}
          wide
          options={options.map((t) => ({ label: t, value: t }))}
          value={value}
          onPick={onPick}
          onClose={() => setOpenMenu(null)}
        />
      </div>
    </div>
  );

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Tickets" />

      <div className="scr-body">
        <h1 className="scr-title">Reserve Ferries</h1>
        <p className="scr-sub">Adult walk-on · Metro Vancouver – Vancouver Island</p>

        <div className="reserve-stack">
          {picker("From", from, Object.keys(FERRY.links), pickFrom, "from")}
          {picker("To", to, FERRY.links[from], pickTo, "to")}

          <section className="section section--gap8">
            <h2 className="section-label">DATE</h2>
            <div className="ferry-dates">
              {FERRY_DATES.map((d) => (
                <button
                  type="button"
                  key={d.date}
                  className={"preset" + (d.date === date ? " preset--on" : "")}
                  aria-pressed={d.date === date}
                  onClick={() => setDate(d.date)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

          <section className="section section--gap8">
            <h2 className="section-label">DEPARTURE</h2>
            <div className="ferry-times">
              {times.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={"preset" + (t === time ? " preset--on" : "")}
                  aria-pressed={t === time}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <NotePanel>
            Crossing {FERRY.crossings[run]}, dock to dock. Ticket sales for foot
            passengers end 10 minutes before the sailing.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button
          onClick={() => {
            if (short) { setWarn(true); return; }
            onReserve?.({ from, to, when: `${time} ${date}`, crossing: FERRY.crossings[run] });
          }}
        >
          Reserve walk-on · {money(FARES.ferryWalkOn)}
        </Button>
        <p className={"scr-footnote" + (warn ? " reserve-warn" : "")}>
          {warn
            ? `Not enough stored value on ${card ? card.name : "your card"} — reload first.`
            : `Pays from stored value${card ? ` · balance ${money(card.balance)}` : ""}.`}
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
