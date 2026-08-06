import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { money, whenLabel } from "../data/seed.js";

/* Giving a ticket back. Nothing is undone on the tab itself — the quiet
   cancel link only leads here, where the rows state the whole of it and
   the button below is the one that actually lets go, the way the card's
   own Refund screen asks before it acts. */
export default function CancelConfirm({ ticket, onBack, backLabel, onConfirm }) {
  if (!ticket) return null;
  const ferry = ticket.kind === "ferry";
  const rows = ferry
    ? [
        { label: "From", value: ticket.from.replace(/ -$/, "") },
        { label: "To", value: ticket.to },
        { label: "Sailing", value: whenLabel(ticket.time, ticket.days) },
        { label: "Fare", value: money(ticket.fare) },
        { label: "Refund to", value: ticket.paidVia },
      ]
    : [
        { label: "Event", value: ticket.name },
        { label: "Venue", value: ticket.venue.split(" \u00b7 ")[0] },
        { label: "Date", value: whenLabel(ticket.time, ticket.days) },
        { label: "Fare", value: money(ticket.fare) },
        { label: "Refund to", value: ticket.paidVia },
      ];
  rows.push({
    label: "Processing",
    value: ticket.paidVia === "Stored value" ? "right away" : "in 3 days",
  });

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title">{ferry ? "Cancel Reservation" : "Refund Ticket"}</h1>
        <p className="scr-sub">
          {ferry
            ? "Give this sailing back and take the fare with you."
            : "Give this pass back and take the fare with you."}
        </p>

        <div className="replace-stack">
          <div className="panel panel--flat">
            {rows.map((row, i) => (
              <div key={row.label}>
                {i > 0 && <div className="panel-rule panel-rule--inset" />}
                <SettingsRow label={row.label} value={row.value} strong chevron={false} />
              </div>
            ))}
          </div>

          <NotePanel tone="warning">
            <span className="note-lead">Heads up</span> —{" "}
            {ferry
              ? "the seat is released the moment you confirm."
              : "the pass stops scanning the moment you confirm."}
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button onClick={onConfirm}>Confirm Refund</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
