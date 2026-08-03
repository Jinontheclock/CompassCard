import { useState } from "react";
import { seedState, FARES, PASSES, CHAT } from "./data/seed.js";
import Landing from "./screens/Landing.jsx";
import SignUp from "./screens/SignUp.jsx";
import CardRegister from "./screens/CardRegister.jsx";
import Login from "./screens/Login.jsx";
import CardList from "./screens/CardList.jsx";
import Tickets from "./screens/Tickets.jsx";
import Account from "./screens/Account.jsx";
import CardDetail from "./screens/CardDetail.jsx";
import Reload from "./screens/Reload.jsx";
import Autoload from "./screens/Autoload.jsx";
import ReloadDone from "./screens/ReloadDone.jsx";
import PaymentMethod from "./screens/PaymentMethod.jsx";
import History from "./screens/History.jsx";
import LostCard from "./screens/LostCard.jsx";
import Replace from "./screens/Replace.jsx";
import Refund from "./screens/Refund.jsx";
import PurchaseNewCard from "./screens/PurchaseNewCard.jsx";
import PurchasePasses from "./screens/PurchasePasses.jsx";
import UPass from "./screens/UPass.jsx";
import UPassConnect from "./screens/UPassConnect.jsx";
import Help from "./screens/Help.jsx";
import TapResult from "./screens/TapResult.jsx";
import Wallet from "./screens/Wallet.jsx";
import WalletCard from "./screens/WalletCard.jsx";
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
  upass: { studentId: "" },
});

export default function App() {
  const [stack, setStack] = useState(["landing"]);
  const [model] = useState(seedState);
  const [form, setForm] = useState(emptyForm);
  /* Whether the account has a card yet. Carrying on past Card Register
     without registering one is what leaves it false, and home draws its
     other state accordingly. */
  const [hasCard, setHasCard] = useState(true);
  const [openCard, setOpenCard] = useState("c1");
  /* the frame opens the reload screen with the middle preset chosen */
  const [reloadAmount, setReloadAmount] = useState(FARES.reloadPresets[1]);
  /* and the passes screen on the monthly, in two zones — the pass the card
     already carries */
  const [passId, setPassId] = useState(PASSES[0].id);
  const [passZone, setPassZone] = useState(2);
  /* The U-Pass is not connected until it is: the tile opens the connect
     screen first and the U-Pass itself afterwards, which is the order the
     two frames are drawn in. Auto-renew is the one thing on that screen
     that can be changed, so it is held apart from the seed. */
  const [upassOn, setUpassOn] = useState(false);
  const [autoRenew, setAutoRenew] = useState(model.upass.autoRenew);
  /* the assistant, and whichever of the two tap frames was opened */
  const [chat, setChat] = useState(CHAT);
  const [draft, setDraft] = useState("");
  const [shot, setShot] = useState("tap");

  /* Screens that exist. A tile pointing at one still being built is a
     no-op rather than a drop back to the Landing screen. */
  const BUILT = new Set(["signup", "login", "cardregister", "home", "tickets", "account", "carddetail", "reload", "autoload", "reloaddone", "payment", "history", "lost", "replace", "refund", "purchase", "passes", "upass", "upassconnect", "help", "shot", "wallet", "walletcard"]);
  const push = (id) => setStack((s) => (BUILT.has(id) ? [...s, id] : s));
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  /* one screen standing in for another it leads to, so what is behind them
     both stays behind: connecting the U-Pass replaces the connect screen
     rather than stacking the U-Pass on top of it */
  const swap = (id) => setStack((s) => [...s.slice(0, -1), id]);
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
            onNext={() => { setHasCard(true); home(); }}
            onSkip={() => { setHasCard(false); home(); }}
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
            cards={hasCard ? model.cards : []}
            onSelectTab={selectTab}
            onAccount={() => push("account")}
            onPurchase={() => push("purchase")}
            onRegister={() => push("cardregister")}
            onCard={(id) => { setOpenCard(id); push("carddetail"); }}
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
      case "carddetail":
        return (
          <CardDetail
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            onBack={back}
            onAccount={() => push("account")}
            onOpen={(id) => push(id === "upass" && !upassOn ? "upassconnect" : id)}
            onSelectTab={selectTab}
          />
        );
      case "upass":
        return (
          <UPass
            upass={{ ...model.upass, autoRenew }}
            onBack={back}
            onAutoRenew={setAutoRenew}
            onSelectTab={selectTab}
          />
        );
      case "upassconnect":
        return (
          <UPassConnect
            upass={model.upass}
            studentId={form.upass.studentId}
            onStudentId={(v) => change("upass")("studentId", v)}
            onBack={back}
            onConnect={() => { setUpassOn(true); swap("upass"); }}
          />
        );
      case "reload":
        return (
          <Reload
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            amount={reloadAmount}
            onAmount={setReloadAmount}
            onBack={back}
            onNext={() => push("reloaddone")}
            onOpen={push}
          />
        );
      case "reloaddone":
        return (
          <ReloadDone
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            amount={reloadAmount}
            onDone={() => setStack(["home", "carddetail"])}
          />
        );
      case "refund":
        return (
          <Refund
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            onBack={back}
            onRequest={back}
          />
        );
      case "replace":
        return (
          <Replace
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            onBack={back}
            onOrder={back}
          />
        );
      case "lost":
        return (
          <LostCard
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            onBack={back}
            onFreeze={back}
            onMove={() => push("replace")}
          />
        );
      case "history":
        return (
          <History
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            onBack={back}
            onSelectTab={selectTab}
            onShot={(id) => { setShot(id); push("shot"); }}
          />
        );
      case "help":
        return (
          <Help
            messages={chat}
            draft={draft}
            onDraft={setDraft}
            /* nothing answers, so a message only joins the ones above it */
            onSend={() => {
              const text = draft.trim();
              if (!text) return;
              setChat((c) => [...c, { from: "user", lines: [text] }]);
              setDraft("");
            }}
            onBack={back}
            onAction={push}
            onPerson={back}
          />
        );
      case "shot":
        return <TapResult shot={shot} onDismiss={back} />;
      case "wallet":
        return <Wallet onOpenCard={() => push("walletcard")} onDismiss={back} />;
      case "walletcard":
        return (
          <WalletCard
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            onClose={back}
            /* leaving Wallet the way it came, which is back into the app */
            onOpenApp={() => setStack((s) => s.slice(0, -2))}
          />
        );
      case "purchase":
        return (
          <PurchaseNewCard
            onBack={back}
            /* buying one is the other way onto a card, so it ends where
               registering one does */
            onPurchase={() => { setHasCard(true); home(); }}
          />
        );
      case "passes":
        return (
          <PurchasePasses
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            passId={passId}
            zone={passZone}
            onPass={setPassId}
            onZone={setPassZone}
            onBack={back}
            onPurchase={back}
          />
        );
      case "payment":
        return <PaymentMethod onBack={back} />;
      case "autoload":
        return (
          <Autoload
            card={model.cards.find((c) => c.id === openCard) ?? model.cards[0]}
            autoload={model.autoload}
            onBack={back}
            onNext={back}
            onOpen={push}
          />
        );
      case "account":
        return <Account onBack={back} onOpen={(id) => push(id)} onRefund={() => push("refund")} />;
      default:
        return <Landing onSignUp={() => push("signup")} onLogin={() => push("login")} />;
    }
  };

  return (
    <div className="screen" data-cards={hasCard ? model.cards.length : 0}>
      {screen()}
    </div>
  );
}
