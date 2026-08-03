import { useState } from "react";
import { seedState } from "./data/seed.js";
import Landing from "./screens/Landing.jsx";
import SignUp from "./screens/SignUp.jsx";
import CardRegister from "./screens/CardRegister.jsx";
import Login from "./screens/Login.jsx";
import CardList from "./screens/CardList.jsx";
import Tickets from "./screens/Tickets.jsx";
import Account from "./screens/Account.jsx";
import "./styles/app.css";

/* The demo is one fixed 402×874 screen — the size the portfolio's phone
   frame renders it at — so there is no router and no responsive layout.
   Navigation is a stack of screen ids; the model below is seeded fresh on
   every load and never persisted, so the iframe always opens on the same
   starting state. */

/* What has been typed. It is held here rather than in the screens so a value
   survives leaving a screen and coming back to it — the screens unmount as
   the stack moves. Memory only, like the rest of the state: a reload starts
   the demo over. */
const emptyForm = () => ({
  signup: { email: "", password: "", confirm: "" },
  login: { email: "", password: "" },
  card: { number: ["", "", "", "", ""], cvn: "" },
});

export default function App() {
  const [stack, setStack] = useState(["landing"]);
  const [model] = useState(seedState);
  const [form, setForm] = useState(emptyForm);

  const push = (id) => setStack((s) => [...s, id]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  /* Home is where the onboarding ends, and it carries no back control, so it
     replaces the stack instead of adding to it — there is nothing behind it
     to return to. */
  const home = () => setStack(["home"]);
  /* the two tabs are roots, so switching replaces the stack rather than
     burying one tab under the other */
  const selectTab = (id) => setStack([id === "tickets" ? "tickets" : "home"]);
  const current = stack[stack.length - 1];

  const change = (section) => (key, value) =>
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));

  /* No form validates — the demo takes whatever is typed, including nothing,
     and moves on. Signing up leads through registering a card; logging in
     goes straight to the cards, since a returning account already has them.
     Both ways out of Card Register — registering one and carrying on without
     one — end at the same place. */
  const screen = () => {
    switch (current) {
      case "signup":
        return (
          <SignUp
            values={form.signup}
            onChange={change("signup")}
            onBack={back}
            onNext={() => push("cardregister")}
            onLogin={() => push("login")}
          />
        );
      case "cardregister":
        return (
          <CardRegister
            values={form.card}
            onChange={change("card")}
            onBack={back}
            onNext={home}
            onSkip={home}
          />
        );
      case "login":
        return (
          <Login
            values={form.login}
            onChange={change("login")}
            onBack={back}
            onNext={home}
            onSignUp={() => push("signup")}
            onForgot={back}
          />
        );
      case "home":
        return (
          <CardList
            cards={model.cards}
            onSelectTab={selectTab}
            onAccount={() => push("account")}
          />
        );
      case "tickets":
        return (
          <Tickets
            sailings={model.sailings}
            onSelectTab={selectTab}
            onAccount={() => push("account")}
          />
        );
      case "account":
        return <Account onBack={back} onOpen={(id) => push(id)} />;
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
