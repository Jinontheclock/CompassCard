import { Fragment } from "react";
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

export default function History({ card, open, onOpen, onBack, onSelectTab, onShot }) {
  /* An entry opens to show the taps behind it. Only a trip has any, so only
     a trip opens. The list arrives closed, as the History frame draws it,
     and opening one gives the frame drawn with details. Which row stands
     open is the app's to remember, so leaving and coming back finds it. */
  const setOpen = onOpen;
  const keyOf = (entry) => `${entry.daysAgo}/${entry.label}`;

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">History</h1>
        <p className="scr-sub">{card.name} · trips and reloads</p>

        <div className="history-groups">
          {byDate(card.history).map((day) => (
            <section className="section section--gap4" key={day.daysAgo}>
              <h2 className="section-label">{agoName(day.daysAgo)}</h2>
              {day.entries.map((entry, i) => (
                <Fragment key={i}>
                  {/* the frame builds the first of a day from the row
                      component and the rest as plain rows, which leaves the
                      first two pixels taller */}
                  {i === 0 ? (
                    /* the first of a day sits in the taller panel row. One
                       with taps unfolds them in place — and the gate screen
                       its figures came from waits inside the fold, a quiet
                       line rather than a page the row jumps to. */
                    entry.taps ? (
                      <div className={"panel panel--tap" + (open === keyOf(entry) ? " panel--tap-open" : "")}>
                        <button
                          type="button"
                          className="history-head"
                          aria-expanded={open === keyOf(entry)}
                          onClick={() => setOpen(open === keyOf(entry) ? null : keyOf(entry))}
                        >
                          <Entry entry={entry} />
                        </button>
                        <div className="history-taps-wrap" aria-hidden={open !== keyOf(entry)}>
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
                              <button
                                type="button"
                                className="history-gate"
                                onClick={() => onShot?.(entry.shot)}
                              >
                                View gate screen
                              </button>
                            )}
                          </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="panel panel--tap panel--tap-still">
                        <Entry entry={entry} />
                      </div>
                    )
                  ) : entry.taps ? (
                    /* a trip opens and closes in place — the taps unfold
                       beneath the row rather than swapping the card out */
                    <button
                      type="button"
                      className={"history-card" + (open === keyOf(entry) ? " history-card--open" : "")}
                      aria-expanded={open === keyOf(entry)}
                      onClick={() => setOpen(open === keyOf(entry) ? null : keyOf(entry))}
                    >
                      <Entry entry={entry} />
                      <div className="history-taps-wrap" aria-hidden={open !== keyOf(entry)}>
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
                          <span className="history-balance">
                            <span>Balance</span>
                            <span className="tnum">{money(entry.balanceAfter)}</span>
                          </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button type="button" className="history-card history-card--still">
                      <Entry entry={entry} />
                    </button>
                  )}
                </Fragment>
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
