import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import TabBar from "../components/TabBar.jsx";
import { signed, agoName } from "../data/seed.js";
import reloadIcon from "../assets/icon-reload.svg";
import autoloadIcon from "../assets/icon-autoload.svg";
import passesIcon from "../assets/icon-passes.svg";
import upassIcon from "../assets/icon-upass.svg";
import lostIcon from "../assets/icon-lost.svg";
import replaceIcon from "../assets/icon-replace.svg";
import refundIcon from "../assets/icon-refund.svg";
import walletIcon from "../assets/icon-wallet.png";

/* The hub for one card: what is on it, what it has just done, and every way
   of managing it. The tiles run two to a row in the order the frame lays
   them out. */
const TILES = [
  { id: "reload", label: "Reload", icon: reloadIcon },
  { id: "autoload", label: "Autoload", icon: autoloadIcon },
  { id: "passes", label: "Purchase passes", icon: passesIcon },
  { id: "upass", label: "U-Pass BC", icon: upassIcon, gold: [0, 7] },
  { id: "lost", label: "Lost card", icon: lostIcon },
  { id: "replace", label: "Replace card", icon: replaceIcon },
  { id: "refund", label: "Refund", icon: refundIcon },
  { id: "wallet", label: "Add to Apple Wallet", apple: true },
];

/* U-Pass BC sets its two initials in the programme's gold */
function TileLabel({ tile }) {
  if (!tile.gold) return tile.label;
  return (
    <>
      <span className="tile-gold">U</span>-Pass <span className="tile-gold">BC</span>
    </>
  );
}

export default function CardDetail({ card, avatar, onBack, onAccount, onOpen, onSelectTab }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Cards" account avatar={avatar} onAccount={onAccount} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">{card.name}</h1>

        <div className="detail-stack">
          <div className="balance-hero">
            <span className="hero-label">STORED VALUE</span>
            <span className="hero-amount tnum">
              <span className="hero-unit">$</span>
              <span className="hero-figure">{card.balance.toFixed(2)}</span>
            </span>
            {/* the rule and the pass line belong to a card that holds a pass;
                a card without one closes on its balance */}
            <div className="hero-foot">
              {card.frozen && (
                <span className="hero-frozen">Frozen — this card stops at the gate.</span>
              )}
              {card.twin && <span className="hero-twin">{card.twin}</span>}
              {card.pass && (
                <>
                  <div className="hero-rule" />
                  <div className="hero-pass">
                    <span className="hero-pass-label">Current pass</span>
                    <span className="hero-pass-value">
                      {card.pass.type} · expires {card.pass.expires}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* a card that has done nothing yet has nothing to preview */}
          {card.history.length > 0 && (
            <section className="section">
              <h2 className="section-label section-label--split">
                HISTORY
                <button type="button" className="linkish" onClick={() => onOpen?.("history")}>
                  See all
                </button>
              </h2>
              <div className="panel panel--flat">
                {card.history.slice(0, 2).map((entry, i) => (
                  <Fragment key={i}>
                    {i > 0 && <div className="panel-rule panel-rule--inset" />}
                    <div className="history-row">
                      <div className="history-what">
                        <span className="history-label">{entry.label}</span>
                        <span className="history-sub">
                          {entry.sub} · {agoName(entry.daysAgo)}
                        </span>
                      </div>
                      <span className={"history-amount tnum" + (entry.amount > 0 ? " history-amount--credit" : "")}>
                        {entry.amountText ?? signed(entry.amount)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
          )}

          <section className="section">
            <h2 className="section-label">MANAGE</h2>
            <div className="tile-grid">
              {TILES.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className={"tile" + (tile.apple ? " tile--apple" : "")}
                  onClick={() => onOpen?.(tile.id)}
                >
                  {tile.apple ? (
                    <img src={walletIcon} alt="" width="20" height="20" />
                  ) : (
                    <img src={tile.icon} alt="" width="20" height="20" />
                  )}
                  <span className="tile-label">
                    <TileLabel tile={tile} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <TabBar active="card" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
