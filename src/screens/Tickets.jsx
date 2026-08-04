import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import TabBar from "../components/TabBar.jsx";
import { FARES, EVENTS, money } from "../data/seed.js";
import accountIcon from "../assets/icon-account.svg";
import onTimeIcon from "../assets/icon-ontime.svg";
import emptyIcon from "../assets/icon-empty.svg";

/* The other tab. The sailings are read from the seed, and each one opens
   onto what a walk-on costs — and, since a walk-on pays from stored value,
   onto reserving it there and then. Beneath them, what has been issued:
   every reservation and event pass becomes a ticket that opens onto its
   own boarding screen. The frame draws the ticket half empty because
   nothing has been booked yet. Last, the events the network serves — an
   event pass is a DayPass in event clothes, and it charges the payment
   method the way a pass purchase does. */
export default function Tickets({ sailings, card, tickets, onReserve, onBuyEvent, onOpenTicket, onAccount, onSelectTab }) {
  const [open, setOpen] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);
  /* which sailing was refused for want of balance */
  const [warn, setWarn] = useState(null);

  const short = card && card.balance < FARES.ferryWalkOn;
  const ticketed = (ev) => tickets.some((t) => t.eventId === ev.id);

  return (
    <div className="scr">
      <StatusBar />

      <div className="nav-header">
        <h1 className="home-title">Tickets</h1>
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <img src={accountIcon} alt="" width="18" height="18" />
        </button>
      </div>

      <div className="scr-body">
        <section className="section">
          <h2 className="section-label">SAILING STATUS · BC FERRIES</h2>
          <div className="panel">
            {sailings.map((sailing, i) => (
              <Fragment key={i}>
                {i > 0 && <div className="panel-rule panel-rule--inset" />}
                <div className={"sailing-card" + (open === i ? " sailing-card--open" : "")}>
                  <button
                    type="button"
                    className="sailing-head"
                    aria-expanded={open === i}
                    onClick={() => { setOpen(open === i ? null : i); setWarn(null); }}
                  >
                    <div className="panel-row">
                      <div className="sailing">
                        <span className="sailing-leg">{sailing.from}</span>
                        <span className="sailing-leg">{sailing.to}</span>
                        <span className="sailing-time">{sailing.time}</span>
                      </div>
                      <span className="status-ok">
                        <img src={onTimeIcon} alt="" width="17" height="17" />
                        {sailing.reserved ? "Reserved" : sailing.status}
                      </span>
                    </div>
                  </button>
                  <div className="sailing-more-wrap" aria-hidden={open !== i}>
                    <div className="sailing-inner">
                      <div className="sailing-more">
                        <span>Adult walk-on · pays from stored value</span>
                        <span className="tnum">{money(FARES.ferryWalkOn)}</span>
                      </div>
                      {/* what the fare line leads to: reserving it — or the
                          reason it cannot be reserved yet */}
                      <div className="sailing-act">
                        {sailing.reserved ? (
                          <p className="sailing-done">Reserved — your ticket is below.</p>
                        ) : card ? (
                          <button
                            type="button"
                            className="sailing-reserve"
                            onClick={() => {
                              if (short) { setWarn(i); return; }
                              setWarn(null);
                              onReserve?.(i);
                            }}
                          >
                            Reserve walk-on · {money(FARES.ferryWalkOn)}
                          </button>
                        ) : (
                          <p className="sailing-done">Register a card to reserve a walk-on.</p>
                        )}
                        {warn === i && (
                          <p className="sailing-warn">
                            Not enough stored value on {card.name} — reload first.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
            <div className="panel-rule" />
            <div className="panel-foot">Walk-on fares come off your stored value</div>
          </div>
        </section>

        <section className="section section--tickets">
          <h2 className="section-label">YOUR TICKETS</h2>
          {tickets.length ? (
            <div className="panel">
              {tickets.map((t, i) => (
                <Fragment key={t.ref}>
                  {i > 0 && <div className="panel-rule panel-rule--inset" />}
                  <button type="button" className="ticket-card" onClick={() => onOpenTicket?.(t)}>
                    <div className="sailing">
                      {t.kind === "ferry" ? (
                        <>
                          <span className="sailing-leg">{t.from}</span>
                          <span className="sailing-leg">{t.to}</span>
                        </>
                      ) : (
                        <>
                          <span className="sailing-leg">{t.name}</span>
                          <span className="sailing-time">{t.venue}</span>
                        </>
                      )}
                      <span className="sailing-time">{t.time}</span>
                    </div>
                    <div className="ticket-side">
                      <span className="ticket-chip">{t.kind === "ferry" ? "RESERVED" : "PURCHASED"}</span>
                      <span className="ticket-fare tnum">{money(t.fare)}</span>
                    </div>
                  </button>
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <img src={emptyIcon} alt="" width="32" height="32" />
              <p className="empty-title">No tickets yet</p>
              <p className="empty-note">
                Reserve a sailing above — reservations and event tickets show up here.
              </p>
            </div>
          )}
        </section>

        <section className="section section--tickets">
          <h2 className="section-label">UPCOMING EVENTS</h2>
          <div className="panel">
            {EVENTS.map((ev, i) => (
              <Fragment key={ev.id}>
                {i > 0 && <div className="panel-rule panel-rule--inset" />}
                <div className={"sailing-card" + (openEvent === i ? " sailing-card--open" : "")}>
                  <button
                    type="button"
                    className="sailing-head"
                    aria-expanded={openEvent === i}
                    onClick={() => setOpenEvent(openEvent === i ? null : i)}
                  >
                    <div className="panel-row">
                      <div className="sailing">
                        <span className="sailing-leg">{ev.name}</span>
                        <span className="sailing-time">{ev.venue}</span>
                        <span className="sailing-time">{ev.time}</span>
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
                  <div className="sailing-more-wrap" aria-hidden={openEvent !== i}>
                    <div className="sailing-inner">
                      <div className="sailing-more">
                        <span>Event pass · all zones on the day</span>
                        <span className="tnum">{money(FARES.dayPass)}</span>
                      </div>
                      <div className="sailing-act">
                        {ticketed(ev) ? (
                          <p className="sailing-done">Ticketed — your pass is above.</p>
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

      <TabBar active="tickets" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
