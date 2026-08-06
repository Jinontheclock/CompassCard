import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { seedState, loginState, digitalCard, registeredCard, bookingRef, FARES, PASSES, TODAY, passPrice, replacementFee, monthName } from "./data/seed.js";
import { reply } from "./data/assistant.js";
import Landing from "./screens/Landing.jsx";
import SignUp from "./screens/SignUp.jsx";
import CardRegister from "./screens/CardRegister.jsx";
import Login from "./screens/Login.jsx";
import Forgot from "./screens/Forgot.jsx";
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
import ReserveFerries from "./screens/ReserveFerries.jsx";
import PurchaseTickets from "./screens/PurchaseTickets.jsx";
import Checkout from "./screens/Checkout.jsx";
import AccountEdit from "./screens/AccountEdit.jsx";
import Contact from "./screens/Contact.jsx";
import CancelConfirm from "./screens/CancelConfirm.jsx";
import Wallet from "./screens/Wallet.jsx";
import WalletCard from "./screens/WalletCard.jsx";
import { StatusBar } from "./components/Chrome.jsx";
import ApplePaySheet from "./components/ApplePaySheet.jsx";
import compassMark from "./assets/compass-mark.svg";
import "./styles/app.css";

/* The demo is one fixed 402×874 screen — the size the portfolio's phone
   frame renders it at — so there is no router and no responsive layout.
   Navigation is a stack of screen ids; the model below is seeded fresh on
   every load and never persisted, so the iframe always opens on the same
   starting state. */

/* What each screen is called when another one points back at it. A back
   control names where it goes, so the name belongs to the stack rather than
   to whichever screen happens to be drawing the control — Replace Card is
   reached from the card and from Lost Card, and only one of those is a card.
   Two entries are the name the frames write rather than the screen's own
   heading: the card list is "Cards" on every control that returns to it, and
   Log In is written as two words there. */
const TITLES = {
  signup: "Sign Up",
  login: "Log In",
  forgot: "Forgot Password",
  cardregister: "Register Your Card",
  home: "Cards",
  tickets: "Tickets",
  account: "Account",
  acctedit: "Account",
  reload: "Reload",
  autoload: "Autoload",
  payment: "Payment Method",
  history: "History",
  lost: "Lost Card",
  replace: "Replace Card",
  refund: "Refund",
  purchase: "Purchase New Card",
  passes: "Purchase Passes",
  upass: "U-Pass BC",
  upassconnect: "Connect U-Pass BC",
  help: "Help",
  contact: "Contact Info",
  ferryreserve: "Reserve Ferries",
  buytickets: "Purchase Tickets",
  checkout: "Payment",
};

/* What has been typed. It is held here rather than in the screens so a value
   survives leaving a screen and coming back to it — the screens unmount as
   the stack moves. Memory only, like the rest of the state: a reload starts
   the demo over. */
const emptyForm = () => ({
  signup: { email: "", password: "", confirm: "" },
  login: { email: "", password: "" },
  card: { number: ["", "", "", "", ""], cvn: "" },
  upass: { studentId: "" },
  purchase: { name: "", fee: "" },
});

export default function App() {
  const [stack, setStack] = useState(["landing"]);
  /* the launch: the mark on the onboarding blue, held for a breath and let
     go — it swallows taps while it is up, as a launch screen does */
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1150);
    return () => clearTimeout(t);
  }, []);
  const [model, setModel] = useState(seedState);
  const [form, setForm] = useState(emptyForm);
  const [openCard, setOpenCard] = useState("c1");
  /* which Account row the editor is open on */
  const [editField, setEditField] = useState("name");
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
  const [autoRenew, setAutoRenew] = useState(model.upass.autoRenew);
  /* the assistant — the conversation starts empty and the first word is the
     rider's — and whichever of the two tap frames was opened */
  /* which History row stands open — held here so coming back to History
     finds it as it was left */
  const [historyOpen, setHistoryOpen] = useState(null);
  const [chat, setChat] = useState([]);
  /* what tags each pending bubble, so its own reply finds it */
  const chatCount = useRef(0);
  const [draft, setDraft] = useState("");
  /* the ledger entry whose gate screen is being looked back at */
  const [shot, setShot] = useState(null);
  /* what the Tickets tab is in the middle of buying: a sailing or an event
     pass, waiting on the payment step */
  const [order, setOrder] = useState(null);
  /* the Apple Pay sheet standing between asking and having: what it is
     for, how much, and what happens once it is paid */
  const [paySheet, setPaySheet] = useState(null);
  /* the ticket standing on the cancel confirmation page, waiting to be
     let go — held as the object itself so the leaving screen can still
     draw it while the cancellation settles */
  const [cancelTicket, setCancelTicket] = useState(null);

  /* Screens that exist. A tile pointing at one still being built is a
     no-op rather than a drop back to the Landing screen. */
  const BUILT = new Set(["signup", "login", "forgot", "cardregister", "home", "tickets", "account", "carddetail", "reload", "autoload", "reloaddone", "payment", "history", "lost", "replace", "refund", "purchase", "passes", "upass", "upassconnect", "help", "shot", "wallet", "walletcard", "acctedit", "contact", "cancelconfirm", "ferryreserve", "buytickets", "checkout"]);
  /* How one screen leaves and the next arrives. Going deeper slides in from
     the right, going back slides out to it, a tab change crosses over in
     place — the three moves a stack navigation has. The leaving screen is
     kept just long enough to play its half, then dropped. */
  const [anim, setAnim] = useState(null);
  const animCount = useRef(0);
  /* Which screen is leaving, and how. The node captured alongside it is a
     fallback, not the plan: normally the leaving stage renders the screen
     itself, keyed by that screen's id, so React moves the instance it
     already had rather than building a second one — a row left open stays
     open all the way out. The fallback answers the one case that cannot be
     re-rendered: refunding the last card empties the model on the very
     frame the slide begins, and a screen about a card has none to draw. */
  /* How far each screen was scrolled when it was last left. React moves a
     stage's DOM node rather than rebuilding it, but a move is a removal and
     an insert and the browser lets go of the offset in between — and a
     screen that has been popped off is built again from nothing. Both are
     answered by writing the offset down on the way out and putting it back
     on the way in. */
  const scrollMem = useRef({});
  const bodyOf = (stage) => stage?.querySelector(".scr-body, .home-body");
  const animate = (dir) => {
    const leaving = bodyOf(document.querySelector(".stage"));
    if (leaving) scrollMem.current[current] = leaving.scrollTop;
    /* the label goes with it: the stack is about to move, and the screen
       sliding out must keep naming where it would have gone back to */
    setAnim({ from: current, back: backLabel, node: screen(current, backLabel), dir, n: ++animCount.current });
  };
  useEffect(() => {
    if (!anim) return undefined;
    const t = setTimeout(() => setAnim(null), anim.dir === "fade" ? 200 : 300);
    return () => clearTimeout(t);
  }, [anim]);
  /* the screens that are about one card, which an account with no cards
     cannot open — the assistant offers some of them, and an empty account
     may be sitting in that chat */
  const NEEDS_CARD = new Set(["carddetail", "reload", "autoload", "reloaddone", "history", "lost", "replace", "refund", "passes", "upass", "upassconnect", "walletcard"]);
  const push = (id) => {
    if (!BUILT.has(id) || (NEEDS_CARD.has(id) && model.cards.length === 0)) return;
    animate("push");
    setStack((s) => [...s, id]);
  };
  const back = () => {
    animate("pop");
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  };
  /* one screen standing in for another it leads to, so what is behind them
     both stays behind: connecting the U-Pass replaces the connect screen
     rather than stacking the U-Pass on top of it */
  const swap = (id) => {
    animate("push");
    setStack((s) => [...s.slice(0, -1), id]);
  };
  /* Home is where the onboarding ends, and it carries no back control, so it
     replaces the stack instead of adding to it — there is nothing behind it
     to return to. */
  const home = () => {
    animate("push");
    setStack(["home"]);
  };
  /* the two tabs are roots, so switching replaces the stack rather than
     burying one tab under the other */
  const selectTab = (id) => {
    const root = id === "tickets" ? "tickets" : "home";
    if (root === current) return;
    animate("fade");
    setStack([root]);
  };
  const current = stack[stack.length - 1];
  /* put each stage back where it was scrolled to: the one leaving, whose
     DOM node the browser reset as React moved it, and the one arriving,
     which may have been built again from nothing. */
  useLayoutEffect(() => {
    const stages = document.querySelectorAll(".stage");
    const out = bodyOf(document.querySelector('[class*="stage--out-"]'));
    if (out && anim) out.scrollTop = scrollMem.current[anim.from] ?? 0;
    const inbound = bodyOf(stages[stages.length - 1]);
    if (inbound) inbound.scrollTop = scrollMem.current[current] ?? 0;
  }, [anim, current]);

  /* Whichever card is open. Every screen under a card is handed this one
     rather than looking it up again. */
  const card = model.cards.find((c) => c.id === openCard) ?? model.cards[0];
  /* what the back control says: the name of the screen under this one. A
     card's own screen is called by its card's name, which is the one title
     the map cannot hold. */
  const backLabel = (() => {
    const under = stack[stack.length - 2];
    if (under === "carddetail") return card?.name ?? "Card";
    return TITLES[under] ?? "Back";
  })();
  /* a stored-value charge: the fare comes off, and if the balance lands
     under the Autoload line, the reload it stands for runs in the same
     breath — written down above the fare it answered */
  const chargeStoredValue = (m, c, fare, entry) => {
    let balance = c.balance - fare;
    let history = [entry, ...c.history];
    if (m.autoload.on && balance < m.autoload.threshold) {
      balance += m.autoload.amount;
      history = [
        { label: "Autoload", sub: m.payment.primary, amount: m.autoload.amount, daysAgo: 0 },
        ...history,
      ];
    }
    return { ...c, balance, history };
  };

  /* what the acting screen changes about that card */
  const patchCard = (patch) =>
    setModel((m) => ({
      ...m,
      cards: m.cards.map((c) => (c.id === card.id ? { ...c, ...patch } : c)),
    }));

  const change = (section) => (key, value) =>
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  const patchAccount = (patch) => setModel((m) => ({ ...m, account: { ...m.account, ...patch } }));
  /* the one method everything charges to */
  const method = model.payment.primary;
  /* Anything that costs money passes through here: Apple Pay presents its
     sheet and hands the flow back once paid; any other method — or a free
     purchase — goes straight through. */
  const charge = (label, amount, then) => {
    if (method === "Apple Pay" && amount > 0) setPaySheet({ label, amount, then });
    else then();
  };
  /* buying a pass puts it on the card, and the ledger gains the line that
     says what was paid for it. The pass is paid for on its own — Apple Pay,
     or whatever else is on file — so the line records a payment the stored
     value never made, and says so. */
  const applyPass = (pass) => {
    patchCard({
      pass: {
        type: pass.zones ? `${pass.short} · ${passZone}-Zone` : pass.short,
        expires: TODAY.monthEnd,
      },
      history: [
        { label: pass.name, sub: method, amount: -passPrice(pass, passZone), daysAgo: 0, movesBalance: false },
        ...card.history,
      ],
    });
    back();
  };

  /* a new card's default name: the very first introduces itself, and the
     ones after take the next ordinal — the second card is simply
     "Second Card" — numbered past the list when the ordinals run out */
  const defaultName = () => {
    if (model.cards.length === 0) return "My First Compass Card";
    const taken = new Set(model.cards.map((c) => c.name));
    const ordinals = ["Second Card", "Third Card", "Fourth Card", "Fifth Card", "Sixth Card"];
    const free = ordinals.find((n) => !taken.has(n));
    if (free) return free;
    let name = "My Compass Card";
    for (let i = 2; taken.has(name); i++) name = `My Compass Card ${i}`;
    return name;
  };

  /* No form validates — the demo takes whatever is typed, including nothing,
     and moves on. Signing up leads through registering a card; logging in
     goes straight to the cards, since a returning account already has them.
     Both ways out of Card Register — registering one and carrying on without
     one — end at the same place. */
  const screen = (id, backLabel) => {
    /* A screen about one card cannot draw without one. push() turns those
       away, but the stack may still hold one from before the last card left,
       so the renderer checks too rather than trusting the way in. */
    if (NEEDS_CARD.has(id) && !card) return null;
    switch (id) {
      case "signup":
        return (
          <SignUp
            backLabel={backLabel}
            values={form.signup}
            onChange={change("signup")}
            onBack={back}
            /* a new account starts with no cards at all */
            onNext={() => {
              setModel((m) => ({ ...m, cards: [] }));
              push("cardregister");
            }}
            onLogin={() => push("login")}
          />
        );
      case "cardregister":
        return (
          <CardRegister
            backLabel={backLabel}
            values={form.card}
            onChange={change("card")}
            onBack={back}
            /* registering the plastic brings the card's own past with it —
               balance, pass and history arrive rather than starting over */
            onNext={() => {
              const imported = registeredCard(form.card.number.join(""));
              setModel((m) => ({ ...m, cards: [...m.cards, imported] }));
              setOpenCard(imported.id);
              home();
            }}
            onSkip={home}
          />
        );
      case "login":
        return (
          <Login
            backLabel={backLabel}
            values={form.login}
            onChange={change("login")}
            onBack={back}
            /* a returning account arrives mid-life: cards, tickets, a
               filled account and the portrait in the corner */
            onNext={() => {
              setModel(loginState());
              home();
            }}
            onSignUp={() => push("signup")}
            onForgot={() => push("forgot")}
          />
        );
      case "forgot":
        return (
          <Forgot
            backLabel={backLabel}
            email={form.login.email}
            onBack={back}
            onSent={back}
          />
        );
      case "home":
        return (
          <CardList
            cards={model.cards}
            avatar={model.avatar}
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
            tickets={model.tickets}
            avatar={model.avatar}
            onSelectTab={selectTab}
            onAccount={() => push("account")}
            onOpen={push}
            passenger={model.account.name || "Guest"}
            onCancel={(t) => { setCancelTicket(t); push("cancelconfirm"); }}
            onAddToWallet={(t) => {
              setModel((m) => ({
                ...m,
                tickets: m.tickets.map((x) => (x.ref === t.ref ? { ...x, inWallet: true } : x)),
              }));
              push("wallet");
            }}
          />
        );
      case "cancelconfirm":
        return (
          <CancelConfirm
            backLabel={backLabel}
            ticket={cancelTicket}
            onBack={back}
            /* confirming undoes exactly what issuing did: only stored value
               has a balance to hand back — a card method is refunded on its
               own side of the counter */
            onConfirm={() => {
              const t = cancelTicket;
              setModel((m) => ({
                ...m,
                cards:
                  t.paidVia === "Stored value"
                    ? m.cards.map((c, idx) =>
                        idx === 0
                          ? {
                              ...c,
                              balance: c.balance + t.fare,
                              history: [
                                {
                                  label: t.kind === "ferry" ? "BC Ferries · Refund" : `${t.name} · Refund`,
                                  sub: "Stored value",
                                  amount: t.fare,
                                  daysAgo: 0,
                                },
                                ...c.history,
                              ],
                            }
                          : c
                      )
                    : m.cards,
                tickets: m.tickets.filter((x) => x.ref !== t.ref),
              }));
              back();
            }}
          />
        );
      case "ferryreserve":
        return (
          <ReserveFerries
            backLabel={backLabel}
            onBack={back}
            /* choosing is this screen's whole job — paying is the next one's */
            onNext={(sail) => {
              setOrder({ kind: "ferry", ...sail });
              push("checkout");
            }}
          />
        );
      case "buytickets":
        return (
          <PurchaseTickets
            backLabel={backLabel}
            tickets={model.tickets}
            onBack={back}
            onBuyEvent={(ev) => {
              setOrder({ kind: "event", ev, fare: FARES.dayPass });
              push("checkout");
            }}
          />
        );
      case "checkout":
        return (
          order && (
            <Checkout
            backLabel={backLabel}
              order={order}
              card={model.cards[0]}
              onBack={back}
              /* Paying settles the order: stored value deducts and writes
                 its ledger line, a card method just pays — and Apple Pay
                 presents its sheet first, the way a reload does. Either
                 way the ticket is issued and the tab is where it lands. */
              onPay={(payWith) => {
                const settle = () => {
                  const o = order;
                  const viaSV = payWith === "Compass Card";
                  const paidVia = viaSV ? "Stored value" : payWith;
                  setModel((m) => ({
                    ...m,
                    cards: viaSV
                      ? m.cards.map((c, idx) =>
                          idx === 0
                            ? chargeStoredValue(
                                m,
                                c,
                                o.fare,
                                o.kind === "ferry"
                                  ? { label: "BC Ferries · Walk-on", sub: o.fareSub, amount: -o.fare, daysAgo: 0 }
                                  : { label: o.ev.name, sub: "Event pass", amount: -o.fare, daysAgo: 0 },
                              )
                            : c
                        )
                      : m.cards,
                    tickets: [
                      ...m.tickets,
                      o.kind === "ferry"
                        ? { ref: bookingRef(), kind: "ferry", from: `${o.from} -`, to: o.to, time: o.time, days: o.days, crossing: o.crossing, fare: o.fare, fareSub: o.fareSub, paidVia }
                        : { ref: bookingRef(), kind: "event", eventId: o.ev.id, name: o.ev.name, venue: o.ev.venue, time: o.ev.time, days: o.ev.days, fare: o.fare, paidVia },
                    ],
                  }));
                  animate("pop");
                  setStack(["tickets"]);
                };
                if (payWith === "Apple Pay")
                  setPaySheet({
                    label: order.kind === "ferry" ? "BC Ferries · Walk-on" : order.ev.name,
                    amount: order.fare,
                    then: settle,
                  });
                else settle();
              }}
            />
          )
        );
      case "carddetail":
        return (
          <CardDetail
            backLabel={backLabel}
            card={card}
            avatar={model.avatar}
            onBack={back}
            onAccount={() => push("account")}
            onOpen={(id) => push(id === "upass" && !card.upassOn ? "upassconnect" : id)}
            onSelectTab={selectTab}
          />
        );
      case "upass":
        return (
          <UPass
            backLabel={backLabel}
            upass={{ ...model.upass, autoRenew }}
            nextMonth={monthName((model.upass.offset ?? 0) + 1)}
            onBack={back}
            onAutoRenew={setAutoRenew}
            /* the month turns: auto-renew answers it with a new month and a
               ledger line; without it the pass simply stands unrenewed */
            onRoll={() =>
              setModel((m) => {
                const offset = (m.upass.offset ?? 0) + 1;
                const month = monthName(offset);
                return {
                  ...m,
                  upass: { ...m.upass, offset, month, renewed: autoRenew },
                  cards: autoRenew
                    ? m.cards.map((c) =>
                        c.id === card.id
                          ? {
                              ...c,
                              history: [
                                { label: `U-Pass BC · ${month}`, sub: "Auto-renewed", amountText: "Included", daysAgo: 0 },
                                ...c.history,
                              ],
                            }
                          : c
                      )
                    : m.cards,
                };
              })
            }
            onSelectTab={selectTab}
          />
        );
      case "upassconnect":
        return (
          <UPassConnect
            backLabel={backLabel}
            upass={model.upass}
            studentId={form.upass.studentId}
            onStudentId={(v) => change("upass")("studentId", v)}
            onSchool={(school) =>
              setModel((m) => ({
                ...m,
                upass: { ...m.upass, school: school.short, schoolName: school.name },
              }))
            }
            onBack={back}
            /* connecting writes the U-Pass into the card's pass slot, so the
               tile and the card's own screen both say the card carries it */
            onConnect={() => {
              patchCard({ upassOn: true, pass: { type: "U-Pass BC", expires: TODAY.monthEnd } });
              swap("upass");
            }}
          />
        );
      case "reload":
        return (
          <Reload
            backLabel={backLabel}
            card={card}
            amount={reloadAmount}
            method={method}
            onAmount={setReloadAmount}
            onBack={back}
            onNext={() => charge(`Reload · ${card.name}`, reloadAmount, () => push("reloaddone"))}
            onOpen={push}
          />
        );
      case "reloaddone":
        return (
          <ReloadDone
            card={card}
            amount={reloadAmount}
            method={method}
            /* the reload is only real when it is done: the balance goes up
               and the ledger gains the line that says why */
            onDone={() => {
              patchCard({
                balance: card.balance + reloadAmount,
                history: [
                  { label: "Reload", sub: method, amount: reloadAmount, daysAgo: 0 },
                  ...card.history,
                ],
              });
              animate("pop");
              setStack(["home", "carddetail"]);
            }}
          />
        );
      case "refund":
        return (
          <Refund
            backLabel={backLabel}
            card={card}
            method={method}
            onBack={back}
            /* the warning is the behaviour: requesting the refund closes
               the card, and home is what is left */
            onRequest={() => {
              setModel((m) => ({ ...m, cards: m.cards.filter((c) => c.id !== card.id) }));
              home();
            }}
          />
        );
      case "replace":
        return (
          <Replace
            backLabel={backLabel}
            card={card}
            /* a card carrying a U-Pass is a Program pass card, and costs the
               Program pass fee to replace */
            programPass={!!card.upassOn}
            onBack={back}
            /* ordering builds the successor on the spot: same balance less
               the fee, same pass and history, the freeze left behind on a
               card that no longer exists */
            onOrder={() => {
              const fee = replacementFee(!!card.upassOn);
              const fresh = {
                ...card,
                id: "c" + Math.random().toString(36).slice(2, 8),
                frozen: false,
                replaced: true,
                twin: `Plastic ···· ${String(Math.floor(1000 + Math.random() * 9000))} · one balance`,
                balance: Math.max(0, card.balance - fee),
                history: [
                  { label: "Card replaced", sub: "Balance, pass and history moved", amount: -fee, daysAgo: 0 },
                  ...card.history,
                ],
              };
              setModel((m) => ({ ...m, cards: m.cards.map((c) => (c.id === card.id ? fresh : c)) }));
              setOpenCard(fresh.id);
            }}
          />
        );
      case "lost":
        return (
          <LostCard
            backLabel={backLabel}
            card={card}
            onBack={back}
            onFreeze={(frozen) => patchCard({ frozen })}
            onMove={() => push("replace")}
          />
        );
      case "history":
        return (
          <History
            backLabel={backLabel}
            card={card}
            open={historyOpen}
            onOpen={setHistoryOpen}
            onBack={back}
            onSelectTab={selectTab}
            onShot={(entry) => { setShot(entry); push("shot"); }}
          />
        );
      case "help":
        return (
          <Help
            backLabel={backLabel}
            messages={chat}
            draft={draft}
            onDraft={setDraft}
            onSend={() => {
              const text = draft.trim();
              if (!text) return;
              /* The assistant reads before it answers: the typing dots hold
                 its place, and the reply takes that place over a beat later.
                 The dots are tagged, because a second question sent inside
                 the beat would otherwise have its own dots taken instead. */
              const pending = ++chatCount.current;
              setChat((c) => [...c, { from: "user", lines: [text] }, { from: "bot", typing: true, pending }]);
              setDraft("");
              setTimeout(
                () => setChat((c) => c.map((m) => (m.pending === pending ? reply(text) : m))),
                900
              );
            }}
            onBack={back}
            /* The assistant opens screens the way the rest of the app does:
               a tab root is crossed to rather than stacked on, and a U-Pass
               nobody has connected is connected first. */
            onAction={(id) => {
              if (id === "tickets" || id === "home") return selectTab(id);
              push(id === "upass" && !card?.upassOn ? "upassconnect" : id);
            }}
            /* asking for a person does not leave the conversation — the
               assistant hands over, and the person arrives a beat later */
            onPerson={() => {
              setChat((c) => [
                ...c,
                { from: "bot", lines: ["Putting you through. An agent joins this", "chat in a moment."] },
              ]);
              setTimeout(
                () =>
                  setChat((c) => [
                    ...c,
                    { from: "bot", who: "Riley · Agent", lines: ["Hi, this is Riley. I can see your", "conversation — how can I help?"] },
                  ]),
                1600
              );
            }}
          />
        );
      case "shot":
        return shot && <TapResult entry={shot} declined={!!card?.frozen} onDismiss={back} />;
      case "wallet":
        return (
          <Wallet
            hasCard={model.cards.length > 0}
            passes={model.tickets.filter((t) => t.inWallet)}
            onOpenCard={() => push("walletcard")}
            onDismiss={back}
          />
        );
      case "walletcard":
        return (
          <WalletCard
            card={card}
            onClose={back}
            /* Wallet cannot take money itself, so both of these hand back to
               the app — one to where it came from, one to the reload screen */
            onAddMoney={() => {
              animate("push");
              setStack((s) => [...s.slice(0, -2), "reload"]);
            }}
            onOpenApp={() => {
              animate("pop");
              setStack((s) => s.slice(0, -2));
            }}
          />
        );
      case "purchase":
        return (
          <PurchaseNewCard
            backLabel={backLabel}
            defaultName={defaultName()}
            name={form.purchase.name}
            fee={form.purchase.fee}
            onName={(v) => change("purchase")("name", v)}
            onFee={(v) => change("purchase")("fee", v)}
            onBack={back}
            /* the card described above is the card that arrives: the typed
               name, holding whatever was loaded at purchase */
            onPurchase={(name, amount) =>
              charge("New Compass Card", amount, () => {
                const bought = digitalCard(name, amount);
                setModel((m) => ({ ...m, cards: [...m.cards, bought] }));
                setOpenCard(bought.id);
                setForm((f) => ({ ...f, purchase: { name: "", fee: "" } }));
                home();
              })
            }
          />
        );
      case "passes":
        return (
          <PurchasePasses
            backLabel={backLabel}
            passId={passId}
            zone={passZone}
            onPass={setPassId}
            onZone={setPassZone}
            onBack={back}
            /* buying one puts it on the card, which is what the card's own
               screen then says it holds */
            onPurchase={() => {
              const pass = PASSES.find((p) => p.id === passId) ?? PASSES[0];
              charge(`${pass.name} · ${card.name}`, passPrice(pass, passZone), () => applyPass(pass));
            }}
          />
        );
      case "payment":
        return (
          <PaymentMethod
            backLabel={backLabel}
            methods={model.payment.methods}
            primary={method}
            onSelect={(m) => setModel((mm) => ({ ...mm, payment: { ...mm.payment, primary: m } }))}
            onAdd={() =>
              setModel((mm) =>
                mm.payment.methods.includes("Credit Card")
                  ? mm
                  : { ...mm, payment: { ...mm.payment, methods: [...mm.payment.methods, "Credit Card"] } }
              )
            }
            onBack={back}
          />
        );
      case "autoload":
        return (
          <Autoload
            backLabel={backLabel}
            autoload={model.autoload}
            method={method}
            onBack={back}
            onSet={(key, value) =>
              setModel((m) => ({ ...m, autoload: { ...m.autoload, [key]: value } }))
            }
            onToggle={(on) => setModel((m) => ({ ...m, autoload: { ...m.autoload, on } }))}
            onOpen={push}
          />
        );
      case "account":
        return (
          <Account
            backLabel={backLabel}
            account={model.account}
            onBack={back}
            onOpen={(id) => push(id)}
            onEdit={(field) => { setEditField(field); push("acctedit"); }}
            onNotifications={(on) => patchAccount({ notifications: on })}
            onRefund={() => push("refund")}
          />
        );
      case "acctedit":
        return (
          <AccountEdit
            backLabel={backLabel}
            field={editField}
            value={model.account[editField] ?? ""}
            onBack={back}
            onSave={(text) => { patchAccount({ [editField]: text }); back(); }}
          />
        );
      case "contact":
        return <Contact onBack={back} backLabel={backLabel} />;
      default:
        return <Landing onSignUp={() => push("signup")} onLogin={() => push("login")} />;
    }
  };

  return (
    <div className="screen" data-cards={model.cards.length}>
      {anim && (
        <div key={`scr-${anim.from}`} className={`stage stage--out-${anim.dir}`} aria-hidden="true">
          {screen(anim.from, anim.back) ?? anim.node}
        </div>
      )}
      <div key={`scr-${current}`} className={"stage" + (anim ? ` stage--in-${anim.dir}` : "")}>
        {screen(current, backLabel)}
      </div>
      {/* The status bar is the phone's, not the app's: one fixed bar rides
          above the sliding stages, going light on the dark landing and
          stepping aside for the gate screen, which draws its own. The bars
          inside each screen stay as invisible spacers so nothing reflows. */}
      <div
        className={"status-fixed" + (current === "shot" ? " status-fixed--off" : "")}
        aria-hidden="true"
      >
        <StatusBar light={current === "landing" && !splash} />
      </div>
      {paySheet && (
        <ApplePaySheet
          amount={paySheet.amount}
          label={paySheet.label}
          onDone={() => {
            const then = paySheet.then;
            setPaySheet(null);
            then();
          }}
          onCancel={() => setPaySheet(null)}
        />
      )}
      {splash && (
        <div className="splash" aria-hidden="true">
          <img src={compassMark} alt="" />
        </div>
      )}
    </div>
  );
}
