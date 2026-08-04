import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import { CROSSING, money } from "../data/seed.js";
import appleLogo from "../assets/apple-logo.png";

/* The scannable square, drawn from the booking reference so every ticket
   carries its own pattern — the same reference always draws the same code.
   Three finder squares and a field of modules: enough to read as the thing
   a gate scans, which is all a demo's code has to do. */
function CodeArt({ seed, size = 132 }) {
  const N = 21;
  let s = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    s ^= seed.charCodeAt(i);
    s = Math.imul(s, 16777619) >>> 0;
  }
  const rnd = () => {
    s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0;
    return s / 4294967296;
  };
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const cells = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) if (!inFinder(r, c) && rnd() < 0.46) cells.push([r, c]);
  const m = size / N;
  return (
    <svg className="tikd-qr" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect width={size} height={size} fill="#fff" />
      {cells.map(([r, c]) => (
        <rect key={r + "-" + c} x={c * m} y={r * m} width={m} height={m} fill="#1c1c1e" />
      ))}
      {[[0, 0], [N - 7, 0], [0, N - 7]].map(([c, r]) => (
        <g key={c + "/" + r}>
          <rect x={c * m} y={r * m} width={7 * m} height={7 * m} fill="#1c1c1e" />
          <rect x={(c + 1) * m} y={(r + 1) * m} width={5 * m} height={5 * m} fill="#fff" />
          <rect x={(c + 2) * m} y={(r + 2) * m} width={3 * m} height={3 * m} fill="#1c1c1e" />
        </g>
      ))}
    </svg>
  );
}

/* A ticket, opened: the pass itself. What the board wrote stays at the top,
   the code and its reference sit in the middle where a gate would look, and
   the facts of the fare close the panel. Cancelling undoes exactly what
   issuing did — a reservation hands its fare back to stored value, an event
   pass goes back to the method that bought it. */
export default function TicketDetail({ ticket, onBack, onCancel }) {
  const ferry = ticket.kind === "ferry";
  /* Wallet cannot really take the pass in a demo, so the button keeps the
     press: added is added for as long as the screen is open */
  const [added, setAdded] = useState(false);

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Tickets" />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">{ferry ? "Boarding Pass" : "Event Ticket"}</h1>

        <div className="tikd-stack">
          <div className="panel tikd-pass">
            <div className="tikd-legs">
              {ferry ? (
                <>
                  <span className="sailing-leg">{ticket.from}</span>
                  <span className="sailing-leg">{ticket.to}</span>
                </>
              ) : (
                <>
                  <span className="sailing-leg">{ticket.name}</span>
                  <span className="sailing-time">{ticket.venue}</span>
                </>
              )}
              <span className="sailing-time">{ticket.time}</span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="tikd-code">
              <CodeArt seed={ticket.ref} />
              <span className="tikd-ref tnum">{ticket.ref}</span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--value">
              <span className="settings-label">Fare</span>
              <span className="settings-value settings-value--strong tnum">{money(ticket.fare)}</span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--value">
              <span className="settings-label">Paid via</span>
              <span className="settings-value">{ticket.paidVia}</span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--value">
              <span className="settings-label">{ferry ? "Crossing" : "Valid"}</span>
              <span className="settings-value">{ferry ? ticket.crossing ?? CROSSING : "All zones · event day"}</span>
            </div>
          </div>

          <button
            type="button"
            className="tikd-wallet"
            disabled={added}
            onClick={() => setAdded(true)}
          >
            <span className="tile-apple">
              <img src={appleLogo} alt="" />
            </span>
            {added ? "Added to Apple Wallet" : "Add to Apple Wallet"}
          </button>

          <NotePanel>
            {ferry
              ? "Ticket sales for foot passengers end 10 minutes before the sailing."
              : "Show the code at any fare gate — the pass covers all zones on the event day."}
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer">
        <Button tone="secondary" onClick={() => onCancel?.(ticket)}>
          {ferry ? `Cancel Reservation · refund ${money(ticket.fare)}` : "Refund Ticket"}
        </Button>
        <p className="scr-footnote">
          {ferry ? "The fare returns to your stored value." : `Refunded to ${ticket.paidVia}.`}
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
