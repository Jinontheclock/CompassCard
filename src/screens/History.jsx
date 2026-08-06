import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import TabBar from "../components/TabBar.jsx";
import { agoName, byDate, money, signed } from "../data/seed.js";

/* Everything the card has done, gathered into days. The entry itself drops
   the date here — the heading above it carries that — which is the one
   difference from the two the card detail previews. */
function Entry({ entry }) {
  return (
    <div className="history-row">
      <div className="history-what">
        <span className="history-label">{entry.label}</span>
        <span className="history-sub">{entry.sub}</span>
      </div>
      <span className={"history-amount tnum" + (entry.amount > 0 ? " history-amount--credit" : "")}>
        {entry.amountText ?? signed(entry.amount)}
      </span>
    </div>
  );
}

/* What a row opens onto: the taps behind it, what the card was left holding,
   and the gate's own screen for the trips that kept theirs. One component,
   so an entry unfolds the same wherever it falls in its day — a reload
   arriving this morning pushes a trip down the group, and nothing about
   that trip should change because of it. */
function Fold({ entry, open, onShot }) {
  return (
    <div className="history-taps-wrap" aria-hidden={!open}>
      <div className="history-fold">
        <div className="history-taps">
          <div className="history-tap-list">
            {entry.taps.map((tap) => (
              <div className="history-tap" key={tap.time}>
                <span className="history-tap-when">
                  <span className="history-tap-time">{tap.time}</span>
                  <span>{tap.place}</span>
                </span>
                <span className="tnum">{tap.amount}</span>
              </div>
            ))}
          </div>
          {entry.balanceAfter != null && (
            <span className="history-balance">
              <span>Balance</span>
              <span className="tnum">{money(entry.balanceAfter)}</span>
            </span>
          )}
          {entry.shot && (
            <button type="button" className="history-gate" onClick={() => onShot?.(entry)}>
              View gate screen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* One line of the ledger. A day's first entry sits in the taller panel row
   and the rest in the plain bordered card — the frames draw them both ways,
   and that is the whole of what position decides. Whether a row opens, and
   what it opens onto, is the entry's own business.
   The box is a div either way: the fold holds a button of its own, and a
   button inside a button is not something a browser will keep. Only the
   header is pressable, so a row with nothing to open is pressable nowhere. */
function Row({ entry, first, open, onToggle, onShot }) {
  const box = first ? "panel panel--tap" : "history-card";
  if (!entry.taps)
    return (
      <div className={`${box} ${first ? "panel--tap-still" : "history-card--still"}`}>
        <Entry entry={entry} />
      </div>
    );
  return (
    <div className={box + (open ? (first ? " panel--tap-open" : " history-card--open") : "")}>
      <button type="button" className="history-head" aria-expanded={open} onClick={onToggle}>
        <Entry entry={entry} />
      </button>
      <Fold entry={entry} open={open} onShot={onShot} />
    </div>
  );
}

export default function History({ card, open, onOpen, onBack, backLabel, onSelectTab, onShot }) {
  /* An entry opens to show the taps behind it. Only a trip has any, so only
     a trip opens. The list arrives closed, as the History frame draws it,
     and opening one gives the frame drawn with details. Which row stands
     open is the app's to remember, so leaving and coming back finds it. */
  const setOpen = onOpen;
  const keyOf = (entry) => `${entry.daysAgo}/${entry.label}`;

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title">History</h1>
        <p className="scr-sub">{card.name} · trips and reloads</p>

        <div className="history-groups">
          {byDate(card.history).map((day) => (
            <section className="section section--gap4" key={day.daysAgo}>
              <h2 className="section-label">{agoName(day.daysAgo)}</h2>
              {day.entries.map((entry, i) => (
                <Row
                  key={i}
                  entry={entry}
                  first={i === 0}
                  open={open === keyOf(entry)}
                  onToggle={() => setOpen(open === keyOf(entry) ? null : keyOf(entry))}
                  onShot={onShot}
                />
              ))}
            </section>
          ))}
        </div>
      </div>

      <TabBar active="card" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
