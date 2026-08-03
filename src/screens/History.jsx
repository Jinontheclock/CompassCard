import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import TabBar from "../components/TabBar.jsx";
import { byDate, money, signed } from "../data/seed.js";

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
        {signed(entry.amount)}
      </span>
    </div>
  );
}

export default function History({ card, onBack, onSelectTab }) {
  /* An entry opens to show the taps behind it. Only a trip has any, so only
     a trip opens. The list arrives closed, as the History frame draws it,
     and opening one gives the frame drawn with details. */
  const [open, setOpen] = useState(null);
  const keyOf = (entry) => `${entry.date}/${entry.label}`;

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">History</h1>
        <p className="scr-sub">{card.name} · trips and reloads</p>

        <div className="history-groups">
          {byDate(card.history).map((day) => (
            <section className="section section--gap4" key={day.date}>
              <h2 className="section-label">{day.date}</h2>
              {day.entries.map((entry, i) => (
                <Fragment key={i}>
                  {/* the frame builds the first of a day from the row
                      component and the rest as plain rows, which leaves the
                      first two pixels taller */}
                  {i === 0 ? (
                    <div className="panel">
                      <Entry entry={entry} />
                    </div>
                  ) : entry.taps && open === keyOf(entry) ? (
                    <div className="history-card history-card--open">
                      <div className="history-open-head">
                        <Entry entry={entry} />
                      </div>
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
                  ) : (
                    <button
                      type="button"
                      className="history-card"
                      onClick={() => entry.taps && setOpen(open === keyOf(entry) ? null : keyOf(entry))}
                    >
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
