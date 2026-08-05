import { StatusBar, HomeIndicator, NavAccount } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import CardTile from "../components/CardTile.jsx";
import NotePanel from "../components/NotePanel.jsx";
import TabBar from "../components/TabBar.jsx";
import plusIcon from "../assets/icon-plus.svg";
import plusLight from "../assets/icon-plus-light.svg";
import emptyIcon from "../assets/icon-empty.svg";

/* Home: the screen the app rests on once the onboarding is done. It carries
   no back control — there is nothing behind it — so the stack is reset when
   it is reached rather than pushed onto.

   Two states, both drawn: cardlist-01 once there is a card, cardlist-02
   before there is one. Carrying on past Card Register without registering
   is what lands you on the second. */
export default function CardList({ cards, avatar, onAccount, onPurchase, onRegister, onCard, onSelectTab }) {
  const empty = cards.length === 0;

  return (
    <div className="scr">
      <StatusBar />

      <div className="nav-header nav-header--float">
        <h1 className="home-title">Compass Card</h1>
        <NavAccount avatar={avatar} onClick={onAccount} />
      </div>

      <div className="home-body home-body--undernav">
        {empty ? (
          <div className="empty-stack">
            <div className="empty-card empty-card--tall">
              <div className="empty-lead">
                <img src={emptyIcon} alt="" width="32" height="32" />
                <p className="empty-title empty-title--quiet">No card yet</p>
                <p className="empty-note empty-note--narrow">
                  Buy a digital card here, or register a plastic one you already have.
                </p>
              </div>
              <div className="empty-actions">
                <Button onClick={onPurchase}>
                  <img src={plusLight} alt="" width="16" height="16" />
                  Purchase New Card
                </Button>
                <Button tone="plain" onClick={onRegister}>
                  Register a plastic card
                </Button>
              </div>
            </div>
            <NotePanel>Just here for tickets? The Tickets tab works without a card.</NotePanel>
          </div>
        ) : (
          <div className="home-stack">
            <div className="home-cards">
              <div className="card-stack">
                {cards.map((card) => (
                  <CardTile
                    key={card.id}
                    card={card}
                    compact={!card.pass}
                    onClick={() => onCard?.(card.id)}
                  />
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
        )}
      </div>

      <TabBar active="card" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
