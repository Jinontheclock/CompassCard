import { useState } from "react";
import { seedState } from "./data/seed.js";
import "./styles/app.css";

/* The demo is one fixed 402×874 screen — the size the portfolio's phone
   frame renders it at — so there is no router and no responsive layout.
   Navigation is a stack of screen ids over the two tabs; the state below is
   the whole app's model, seeded fresh on every load. */
export default function App() {
  const [state] = useState(seedState);

  return (
    <div className="screen">
      <p className="scaffold-note">
        Compass — concept demo
        <br />
        <span>
          {state.cards.length} cards seeded · screens land once the Hi-Fi
          reference is available
        </span>
      </p>
    </div>
  );
}
