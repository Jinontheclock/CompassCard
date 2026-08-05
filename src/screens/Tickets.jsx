import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import TabBar from "../components/TabBar.jsx";
import WalletPass from "../components/WalletPass.jsx";
import { money } from "../data/seed.js";
import accountIcon from "../assets/icon-account.svg";
import walletIcon from "../assets/icon-wallet.svg";
import emptyIcon from "../assets/icon-empty.svg";

/* The other tab. Nothing on it is seeded: a fresh account opens onto an
   empty shelf, and only reserving or buying writes onto it. A reserved
   crossing files under BC Ferries' own heading, an event pass under the
   tickets, and each section appears only once it has something to show.
   Folded, a ticket keeps to its essentials; unfolded, it is the wallet
   pass at full size with Wallet and the way out beneath it. */
export default function Tickets({ tickets, passenger, onCancel, onOpen, onAccount, onSelectTab }) {
  /* which ticket stands unfolded, and which have taken the Wallet press */
  const [openTicket, setOpenTicket] = useState(null);
  const [walleted, setWalleted] = useState([]);
  const ferries = tickets.filter((t) => t.kind === "ferry");
  const events = tickets.filter((t) => t.kind !== "ferry");

  const row = (t, i) => (
    <Fragment key={t.ref}>
      {i > 0 && <div className="panel-rule panel-rule--inset" />}
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
                <img src={walletIcon} alt="" width="20" height="20" />
                {walleted.includes(t.ref) ? "Added to Apple Wallet" : "Add to Apple Wallet"}
              </button>
              {/* the way out speaks quietly, and only leads to the page
                  that asks properly before anything is undone */}
              <button type="button" className="ticket-cancel" onClick={() => onCancel?.(t)}>
                {t.kind === "ferry" ? "Cancel Reservation" : "Refund Ticket"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );

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
        {ferries.length > 0 && (
          <section className="section">
            <h2 className="section-label">RESERVED SAILINGS · BC FERRIES</h2>
            <div className="panel">{ferries.map(row)}</div>
          </section>
        )}

        <section className="section section--tickets">
          {events.length > 0 ? (
            <>
              <h2 className="section-label">YOUR TICKETS</h2>
              <div className="panel">{events.map(row)}</div>
            </>
          ) : tickets.length === 0 ? (
            <>
              <h2 className="section-label">YOUR TICKETS</h2>
              <div className="empty-card">
                <img src={emptyIcon} alt="" width="32" height="32" />
                <p className="empty-title">No tickets yet</p>
                <p className="empty-note">
                  Reserve a sailing or buy an event pass — your tickets show up here.
                </p>
              </div>
            </>
          ) : null}
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
