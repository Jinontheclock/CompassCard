import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import walletActions from "../assets/wallet-actions.png";
import walletStack from "../assets/wallet-stack.webp";
import walletCard from "../assets/wallet-card.webp";
import { CODES } from "../data/seed.js";
import bcfLogo from "../assets/bcferries-logo.png";
import starLogo from "../assets/star-logo.png";
import triangleLogo from "../assets/triangle-logo.png";

/* a boarding pass or ticket the app handed over, drawn the slim way
   Wallet stacks its passes — each in the colour its full pass wears */
function PassTile({ t }) {
  if (t.kind === "ferry") {
    const from = CODES[t.from.replace(/ -$/, "")]?.code ?? "···";
    const to = CODES[t.to]?.code ?? "···";
    return (
      <div className="wallet-pass wallet-pass--ferry">
        <img src={bcfLogo} alt="BC Ferries" style={{ height: 14 }} />
        <span className="wallet-pass-note">
          {from} → {to} · {t.time}
        </span>
      </div>
    );
  }
  const skin = Number(t.ref) % 3;
  return (
    <div
      className={"wallet-pass" + (skin === 2 ? " wallet-pass--dark-on-light" : "")}
      style={{ background: ["#f26d5f", "#6f352f", "#fcad00"][skin] }}
    >
      <img src={skin === 2 ? triangleLogo : starLogo} alt="" style={{ height: 13 }} />
      <span className="wallet-pass-note">{t.name}</span>
    </div>
  );
}

/* The card as Wallet holds it. This is Apple's screen, not the app's, so
   none of the app's chrome or type scale applies to it: the title is SF
   Pro's 34, the two round controls are the frame's own export, and the
   cards themselves are renders.

   The frames give Wallet no way back to the app. The surface behind the
   card dismisses, and since that is not something you can see, the way out
   is written down as well — in the empty half of the frame, below where
   anything is drawn. */
export default function Wallet({ hasCard = true, passes = [], onOpenCard, onDismiss }) {
  return (
    <div className="wallet-scr">
      <button type="button" className="wallet-dismiss" aria-label="Close Wallet" onClick={onDismiss} />

      <StatusBar />

      <div className="wallet-title">
        <span className="wallet-name">Wallet</span>
        <img src={walletActions} alt="" width="79" height="34" />
      </div>

      {hasCard && (
        <>
          <img className="wallet-stack" src={walletStack} alt="" width="370" height="335" />

          <button type="button" className="wallet-card" onClick={onOpenCard}>
            <img src={walletCard} alt="Compass Card" width="370" height="232" />
          </button>
        </>
      )}

      {passes.length > 0 && (
        <div className={"wallet-passes" + (hasCard ? "" : " wallet-passes--alone")}>
          {passes.map((t) => (
            <PassTile key={t.ref} t={t} />
          ))}
        </div>
      )}

      <button type="button" className="escape" onClick={onDismiss}>
        Back to Compass
      </button>

      <HomeIndicator />
    </div>
  );
}
