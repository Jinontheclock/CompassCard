import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { FARES, EVENTS, money , whenLabel } from "../data/seed.js";
import onTimeIcon from "../assets/icon-ontime.svg";

/* Buying event passes, on its own screen: the events the network serves,
   each opening onto the pass it sells. An event pass is a DayPass in event
   clothes — all zones, the day of the event — and it charges the payment
   method the way any purchase does, so Apple Pay presents its sheet on the
   way through. */
export default function PurchaseTickets({ tickets, onBack, backLabel, onBuyEvent }) {
  const [open, setOpen] = useState(null);
  const ticketed = (ev) => tickets.some((t) => t.eventId === ev.id);

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title">Purchase Tickets</h1>
        <p className="scr-sub">Event passes on the network</p>

        <section className="section section--gap8">
          <h2 className="section-label">UPCOMING EVENTS</h2>
          <div className="panel">
            {EVENTS.map((ev, i) => (
              <Fragment key={ev.id}>
                {i > 0 && <div className="panel-rule panel-rule--inset" />}
                <div className={"sailing-card" + (open === i ? " sailing-card--open" : "")}>
                  <button
                    type="button"
                    className="sailing-head"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <div className="panel-row">
                      <div className="sailing">
                        <span className="sailing-leg">{ev.name}</span>
                        <span className="sailing-time">{ev.venue}</span>
                        <span className="sailing-time">{whenLabel(ev.time, ev.days)}</span>
                      </div>
                      {ticketed(ev) ? (
                        <span className="status-ok">
                          <img src={onTimeIcon} alt="" width="17" height="17" />
                          Ticketed
                        </span>
                      ) : (
                        <span className="event-price tnum">{money(FARES.dayPass)}</span>
                      )}
                    </div>
                  </button>
                  <div className="sailing-more-wrap" aria-hidden={open !== i}>
                    <div className="sailing-inner">
                      <div className="sailing-more">
                        <span>Event pass · all zones on the day</span>
                        <span className="tnum">{money(FARES.dayPass)}</span>
                      </div>
                      <div className="sailing-act">
                        {ticketed(ev) ? (
                          <p className="sailing-done">Ticketed — it&rsquo;s in Your Tickets.</p>
                        ) : (
                          <button
                            type="button"
                            className="sailing-reserve event-buy"
                            onClick={() => onBuyEvent?.(ev)}
                          >
                            Buy Event Pass · {money(FARES.dayPass)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
            <div className="panel-rule" />
            <div className="panel-foot">An event pass covers all zones on the event day</div>
          </div>
        </section>
      </div>

      <HomeIndicator />
    </div>
  );
}
