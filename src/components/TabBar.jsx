import cardIcon from "../assets/icon-tab-card.svg";
import ticketsIcon from "../assets/icon-tab-tickets.svg";

/* The floating bar the app sits on: two tabs, no more. Only the Compass Card
   side has screens so far, so Tickets is drawn but does not lead anywhere
   yet. Both glyphs are Figma exports and carry their own colour, which is
   why the bar renders one state rather than switching between them. */
export default function TabBar({ active = "card" }) {
  return (
    <div className="tab-bar">
      <span className={"tab" + (active === "card" ? " tab--active" : "")}>
        <img src={cardIcon} alt="" width="24" height="24" />
        <span className="tab-label">Compass Card</span>
      </span>
      <span className={"tab" + (active === "tickets" ? " tab--active" : "")}>
        <img src={ticketsIcon} alt="" width="24" height="24" />
        <span className="tab-label">Tickets</span>
      </span>
    </div>
  );
}
