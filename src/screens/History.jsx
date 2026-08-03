import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import TabBar from "../components/TabBar.jsx";
import { byDate, signed } from "../data/seed.js";

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
                  ) : (
                    <div className="history-card">
                      <Entry entry={entry} />
                    </div>
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
