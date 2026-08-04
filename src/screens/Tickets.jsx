import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import TabBar from "../components/TabBar.jsx";
import { FARES, money } from "../data/seed.js";
import accountIcon from "../assets/icon-account.svg";
import onTimeIcon from "../assets/icon-ontime.svg";
import emptyIcon from "../assets/icon-empty.svg";

/* The other tab. The board watches the trip the rider already holds — a
   sailing opens onto its fare, and reserving is not done here — and every
   reservation and event pass becomes a ticket that opens onto its own
   boarding screen. The frame draws the ticket half empty because nothing
   has been booked yet; beneath it, the two doors that do the booking, the
   way the card list keeps its purchase button under the cards. */
export default function Tickets({ sailings, tickets, onOpenTicket, onOpen, onAccount, onSelectTab }) {
  const [open, setOpen] = useState(null);

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
                    onClick={() => setOpen(open === i ? null : i)}
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
                Reserve a sailing or buy an event pass — your tickets show up here.
              </p>
            </div>
          )}
          {/* the two doors that do the booking, kept under the collection
              the way the card list keeps its purchase button */}
          <div className="tickets-actions">
            <Button tone="ghost" onClick={() => onOpen?.("ferryreserve")}>
              Reserve Ferries
            </Button>
            <Button tone="ghost" onClick={() => onOpen?.("buytickets")}>
              Purchase Tickets
            </Button>
          </div>
        </section>
      </div>

      <TabBar active="tickets" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
