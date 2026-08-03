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
  const current = stack[stack.length - 1];

  const change = (section) => (key, value) =>
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));

  /* No form validates — the demo takes whatever is typed, including nothing,
     and moves on. Signing up and logging in both land on Card Register: it is
     the next screen the frames give either route, and the one it stands in
     for after logging in — the card list — is not built yet. The exits past
     Card Register still come back here for the same reason. */
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
            onNext={back}
            onSkip={back}
          />
        );
      case "login":
        return (
          <Login
            values={form.login}
            onChange={change("login")}
            onBack={back}
            onNext={() => push("cardregister")}
            onSignUp={() => push("signup")}
            onForgot={back}
          />
        );
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
