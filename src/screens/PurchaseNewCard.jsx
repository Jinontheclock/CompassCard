import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { money } from "../data/seed.js";
import contactless from "../assets/icon-contactless.svg";

/* Buying a card rather than registering one. Two of the three rows are
   yours to fill: the name the card will carry, and what to load onto it as
   it arrives. Both are drawn straight onto the preview above as they are
   typed — the preview is the card being described, not a picture beside the
   form. The type is the one thing already settled: this screen issues
   digital cards.

   The big figure counts money the way every other figure in the app does,
   so an empty card reads $0.00 rather than a doubled zero. */

export default function PurchaseNewCard({ defaultName, name, fee, onName, onFee, onBack, onPurchase }) {
  const shownName = name || defaultName;
  const amount = parseFloat(fee) || 0;
  /* digits and one dot, nothing else — this is money being typed */
  const typeFee = (raw) => {
    const clean = raw.replace(/[^\d.]/g, "");
    const dot = clean.indexOf(".");
    onFee?.(dot === -1 ? clean : clean.slice(0, dot + 1) + clean.slice(dot + 1).replace(/\./g, "").slice(0, 2));
  };

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Cards" />

      <div className="scr-body">
        <h1 className="scr-title">Purchase New Card</h1>
        <p className="scr-sub">A digital Compass Card, issued to this account instantly.</p>

        <div className="purchase-stack">
          {/* the card as it would arrive, redrawn as the form is typed */}
          <div className="card-tile card-tile--preview">
            <div className="card-tile-head">
              <div className="card-tile-name">
                <span className="card-tile-title">{shownName}</span>
              </div>
              <img src={contactless} alt="" width="22" height="22" />
            </div>
            <div className="card-tile-foot">
              <div className="card-tile-value">
                <span className="card-tile-label">CARD · DIGITAL</span>
                <span className="card-tile-amount tnum">{money(amount)}</span>
              </div>
            </div>
          </div>

          <div className="panel panel--flat">
            <SettingsRow label="Card type" value="Digital" pad ink chevron={false} />
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--value">
              <span className="settings-label">Card name</span>
              <span className="settings-trail">
                <input
                  className="settings-input"
                  type="text"
                  placeholder={defaultName}
                  value={name}
                  onChange={(e) => onName?.(e.target.value)}
                />
              </span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--tall">
              <span className="settings-label">Card fee</span>
              <span className="settings-trail">
                <span className="settings-value settings-value--strong tnum settings-money">
                  <input
                    className="settings-input settings-input--amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="$0.00"
                    value={fee ? "$" + fee : ""}
                    onChange={(e) => typeFee(e.target.value)}
                  />
                </span>
              </span>
            </div>
          </div>

          <NotePanel>
            After purchase, add it to Apple Wallet from the card&rsquo;s Manage list.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button onClick={() => onPurchase?.(shownName, amount)}>Purchase</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
