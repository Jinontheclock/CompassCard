import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import contactless from "../assets/icon-contactless.svg";

/* Buying a card rather than registering one. There is nothing to fill in —
   a digital card is issued at once and costs nothing — so the screen shows
   the card that would arrive and states the three things about it that are
   already settled. The name the frame gives the new card. */
const NEW_CARD = { name: "My Compass Card", type: "Digital", fee: "$ 0.00" };

export default function PurchaseNewCard({ onBack, onPurchase }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Cards" />

      <div className="scr-body">
        <h1 className="scr-title">Purchase New Card</h1>
        <p className="scr-sub">A digital Compass Card, issued to this account instantly.</p>

        <div className="purchase-stack">
          {/* the card as it would arrive: no balance on it yet, and no twin
              line, since a digital card has no plastic beside it */}
          <div className="card-tile card-tile--preview">
            <div className="card-tile-head">
              <div className="card-tile-name">
                <span className="card-tile-title">{NEW_CARD.name}</span>
              </div>
              <img src={contactless} alt="" width="22" height="22" />
            </div>
            <div className="card-tile-foot">
              <div className="card-tile-value">
                <span className="card-tile-label">CARD · DIGITAL</span>
                <span className="card-tile-amount tnum">$00.00</span>
              </div>
            </div>
          </div>

          <div className="panel panel--flat">
            <SettingsRow label="Card type" value={NEW_CARD.type} pad ink chevron={false} />
            <div className="panel-rule panel-rule--inset" />
            <SettingsRow label="Card name" value={NEW_CARD.name} pad />
            <div className="panel-rule panel-rule--inset" />
            <SettingsRow label="Card fee" value={NEW_CARD.fee} tall ink chevron={false} />
          </div>

          <NotePanel>
            After purchase, add it to Apple Wallet from the card&rsquo;s Manage list.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button onClick={onPurchase}>Purchase</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
