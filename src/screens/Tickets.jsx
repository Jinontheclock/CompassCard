import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import TabBar from "../components/TabBar.jsx";
import WalletPass from "../components/WalletPass.jsx";
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
export default function Tickets({ sailings, tickets, passenger, onCancel, onOpen, onAccount, onSelectTab }) {
  const [open, setOpen] = useState(null);
  /* which ticket stands unfolded, and which have taken the Wallet press */
  const [openTicket, setOpenTicket] = useState(null);
  const [walleted, setWalleted] = useState([]);

  return (
    <div className="scr">
      <StatusBar />

      <div className="nav-header nav-header--float">
        <h1 className="home-title">Tickets</h1>
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <img src={accountIcon} alt="" width="18" height="18" />
        </button>
      </div>

      <div className="scr-body scr-body--undernav">
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
                  {/* folded, the essentials; unfolded, the pass itself at
                      full size, with Wallet and the way out beneath it */}
                  <div className={"sailing-card" + (openTicket === t.ref ? " sailing-card--open" : "")}>
                    <button
                      type="button"
                      className="sailing-head ticket-card"
                      aria-expanded={openTicket === t.ref}
                      onClick={() => setOpenTicket(openTicket === t.ref ? null : t.ref)}
                    >
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
                    <div className="sailing-more-wrap" aria-hidden={openTicket !== t.ref}>
                      <div className="sailing-inner">
                        <div className="ticket-full">
                          <WalletPass ticket={t} passenger={passenger} />
                          <p className="ticket-paidline">
                            {money(t.fare)} · {t.paidVia}
                          </p>
                          <button
                            type="button"
                            className="tikd-wallet"
                            disabled={walleted.includes(t.ref)}
                            onClick={() => setWalleted([...walleted, t.ref])}
                          >
                            {walleted.includes(t.ref) ? "Added to Apple Wallet" : "Add to Apple Wallet"}
                          </button>
                          <Button tone="secondary" onClick={() => onCancel?.(t)}>
                            {t.kind === "ferry" ? `Cancel Reservation · refund ${money(t.fare)}` : "Refund Ticket"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
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
              the way the card list keeps its purchase button. The clearance
              below them exists only once tickets have made the page long
              enough to scroll — a page that fits should not. */}
          <div className={"tickets-actions" + (tickets.length ? " tickets-actions--clear" : "")}>
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
