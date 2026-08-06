import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import walletCard from "../assets/wallet-card.webp";
import walletClose from "../assets/wallet-close.png";
import walletMore from "../assets/wallet-more.png";
import chevron from "../assets/icon-chevron.svg";

/* The card opened inside Wallet: what is on it, the way to top it up, and
   the way back into the app. Still Apple's screen, so the type is Wallet's
   rather than the app's — set at the sizes the frame gives them, since a
   scale built for the app has no place standing in for Apple's. */
export default function WalletCard({ card, onClose, onAddMoney, onOpenApp }) {
  return (
    <div className="wallet-scr">
      <StatusBar />

      <div className="wallet-bar">
        <button type="button" className="wallet-round" aria-label="Close" onClick={onClose}>
          <img src={walletClose} alt="" width="34" height="34" />
        </button>
        <button type="button" className="wallet-round" aria-label="More">
          <img src={walletMore} alt="" width="34" height="34" />
        </button>
      </div>

      <div className="wallet-stack-open">
        <img src={walletCard} alt="Compass Card" width="370" height="232" />

        <div className="wallet-panel wallet-panel--balance">
          <div className="wallet-balance">
            <span className="wallet-balance-label">Balance</span>
            <span className="wallet-balance-amount tnum">${card.balance.toFixed(2)}</span>
          </div>
          {/* Wallet has no way to take money itself — adding to the card is
              the app's job, so the pill hands back to it */}
          <button type="button" className="wallet-pill" onClick={onAddMoney}>
            Add Money
          </button>
        </div>

        <button type="button" className="wallet-panel wallet-panel--open" onClick={onOpenApp}>
          <span className="wallet-open-label">Open the Compass App</span>
          <img src={chevron} alt="" width="8" height="14" />
        </button>
      </div>

      <HomeIndicator />
    </div>
  );
}
