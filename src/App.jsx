import { useState } from "react";
import { seedState } from "./data/seed.js";
import Landing from "./screens/Landing.jsx";
import SignUp from "./screens/SignUp.jsx";
import CardRegister from "./screens/CardRegister.jsx";
import Login from "./screens/Login.jsx";
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

  /* The onboarding group is built. The exits that would carry on into the
     card list — registering a card, skipping it, logging in — come back
     here until that group exists. */
  const screen = () => {
    switch (current) {
      case "signup":
        return <SignUp onBack={back} onNext={() => push("cardregister")} onLogin={() => push("login")} />;
      case "cardregister":
        return <CardRegister onBack={back} onNext={back} onSkip={back} />;
      case "login":
        return <Login onBack={back} onNext={back} onSignUp={() => push("signup")} onForgot={back} />;
      default:
        return <Landing onSignUp={() => push("signup")} onLogin={() => push("login")} />;
    }
  };

  return (
    <div className="screen" data-cards={model.cards.length}>
      {screen()}
    </div>
  );
}
