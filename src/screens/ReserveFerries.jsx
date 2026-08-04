import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Dropdown from "../components/Dropdown.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import { FARES, FERRY, FERRY_DATES, ferryRun, money } from "../data/seed.js";
import chevron from "../assets/icon-chevron.svg";

/* Reserving a sailing, the way BC Ferries' own booking asks it: where from,
   where to, which day, which departure — each picked from the list it
   belongs to. The terminals are the real Metro Vancouver – Island ones and
   the partner list follows the route map, so a harbour only offers the
   crossings that exist; the schedule and crossing time follow the chosen
   run. Paying is the next screen's business. */
export default function ReserveFerries({ onBack, onNext }) {
  const [from, setFrom] = useState("Vancouver (Tsawwassen)");
  const [to, setTo] = useState("Victoria (Swartz Bay)");
  const [date, setDate] = useState(FERRY_DATES[0]);
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

  const picker = (label, value, shown, options, onPick, key) => (
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
        <Dropdown
          open={openMenu === key}
          wide
          options={options}
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
          {picker("From", from, from, Object.keys(FERRY.links).map((t) => ({ label: t, value: t })), pickFrom, "from")}
          {picker("To", to, to, FERRY.links[from].map((t) => ({ label: t, value: t })), pickTo, "to")}
          {picker("Date", date, date.label, FERRY_DATES.map((d) => ({ label: d.label, value: d })), setDate, "date")}
          {picker("Departure", time, time, FERRY.times[run].map((t) => ({ label: t, value: t })), setTime, "time")}

          <NotePanel>
            Crossing {FERRY.crossings[run]}, dock to dock. Ticket sales for foot
            passengers end 10 minutes before the sailing.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button
          onClick={() =>
            onNext?.({ from, to, when: `${time} ${date.date}`, crossing: FERRY.crossings[run] })
          }
        >
          Next · {money(FARES.ferryWalkOn)}
        </Button>
        <p className="scr-footnote">Choose how to pay on the next step.</p>
      </div>

      <HomeIndicator />
    </div>
  );
}
