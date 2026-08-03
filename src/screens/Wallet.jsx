import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import walletActions from "../assets/wallet-actions.png";
import walletStack from "../assets/wallet-stack.webp";
import walletCard from "../assets/wallet-card.webp";

/* The card as Wallet holds it. This is Apple's screen, not the app's, so
   none of the app's chrome or type scale applies to it: the title is SF
   Pro's 34, the two round controls are the frame's own export, and the
   cards themselves are renders.

   The frames give Wallet no way back to the app. The surface behind the
   card dismisses, and since that is not something you can see, the way out
   is written down as well — in the empty half of the frame, below where
   anything is drawn. */
export default function Wallet({ onOpenCard, onDismiss }) {
  return (
    <div className="wallet-scr">
      <button type="button" className="wallet-dismiss" aria-label="Close Wallet" onClick={onDismiss} />

      <StatusBar />

      <div className="wallet-title">
        <span className="wallet-name">Wallet</span>
        <img src={walletActions} alt="" width="79" height="34" />
      </div>

      <img className="wallet-stack" src={walletStack} alt="" width="370" height="335" />

      <button type="button" className="wallet-card" onClick={onOpenCard}>
        <img src={walletCard} alt="Compass Card" width="370" height="232" />
      </button>

      <button type="button" className="escape" onClick={onDismiss}>
        Back to Compass
      </button>

      <HomeIndicator />
    </div>
  );
}
