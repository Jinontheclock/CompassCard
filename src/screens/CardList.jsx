import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import CardTile from "../components/CardTile.jsx";
import TabBar from "../components/TabBar.jsx";
import accountIcon from "../assets/icon-account.svg";
import plusIcon from "../assets/icon-plus.svg";

/* Home: the screen the app rests on once the onboarding is done. It carries
   no back control — there is nothing behind it — so the stack is reset when
   it is reached rather than pushed onto. */
export default function CardList({ cards, onAccount, onPurchase }) {
  return (
    <div className="scr">
      <StatusBar />

      <div className="nav-header">
        <h1 className="home-title">Compass Card</h1>
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <img src={accountIcon} alt="" width="18" height="18" />
        </button>
      </div>

      <div className="home-body">
        <div className="home-stack">
          <div className="home-cards">
            <div className="card-stack">
              {cards.map((card) => (
                <CardTile key={card.id} card={card} compact={!card.pass} />
              ))}
            </div>
            <Button tone="ghost" onClick={onPurchase}>
              <img src={plusIcon} alt="" width="16" height="16" />
              Purchase New Card
            </Button>
          </div>
          <p className="home-note">
            Each card keeps its own balance. A card&rsquo;s plastic and Wallet pass share one.
          </p>
        </div>
      </div>

      <TabBar active="card" />
      <HomeIndicator />
    </div>
  );
}
