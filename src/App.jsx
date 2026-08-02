import { useState } from "react";
import { seedState } from "./data/seed.js";
import Landing from "./screens/Landing.jsx";
import SignUp from "./screens/SignUp.jsx";
import "./styles/app.css";

/* The demo is one fixed 402×874 screen — the size the portfolio's phone
   frame renders it at — so there is no router and no responsive layout.
   Navigation is a stack of screen ids; the model below is seeded fresh on
   every load and never persisted, so the iframe always opens on the same
   starting state. */
export default function App() {
  const [stack, setStack] = useState(["landing"]);
  const [model] = useState(seedState);

  const push = (id) => setStack((s) => [...s, id]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const current = stack[stack.length - 1];

  return (
    <div className="screen" data-cards={model.cards.length}>
      {current === "landing" && (
        <Landing onSignUp={() => push("signup")} onLogin={() => push("login")} />
      )}
      {current !== "landing" && (
        /* the onboarding group lands first; the screens after it fall back
           here until their own group is built */
        <SignUp onBack={back} onNext={back} onLogin={back} />
      )}
    </div>
  );
}
