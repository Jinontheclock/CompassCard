import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { money } from "../data/seed.js";

/* Giving the stored value back. The rows state the whole of it before the
   button — what is going back, where to, and when — and the panel says what
   the button costs, which is the card itself. */
export default function Refund({ card, onBack, onRequest }) {
  const rows = [
    { label: "Card", value: card.name },
    { label: "Balance to refund", value: money(card.balance) },
    { label: "Refund to", value: "Apple Pay" },
    { label: "Processing", value: "in 3 days" },
  ];

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">Refund</h1>
        <p className="scr-sub">
          Return this card&rsquo;s remaining stored value to your payment method.
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
            <span className="note-lead">Heads up</span> — the card is closed once the refund is
            requested.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button onClick={onRequest}>Request Refund</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
