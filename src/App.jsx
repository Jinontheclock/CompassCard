import { useEffect, useRef, useState } from "react";
import { seedState, digitalCard, registeredCard, bookingRef, FARES, PASSES, TODAY, passPrice } from "./data/seed.js";
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
import TicketDetail from "./screens/TicketDetail.jsx";
import ReserveFerries from "./screens/ReserveFerries.jsx";
import PurchaseTickets from "./screens/PurchaseTickets.jsx";
import AccountEdit from "./screens/AccountEdit.jsx";
import Contact from "./screens/Contact.jsx";
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
  const [chat, setChat] = useState([]);
  const [draft, setDraft] = useState("");
  const [shot, setShot] = useState("tap");
  /* the ticket standing open — held as the object itself, so the leaving
     screen can still draw it while a cancellation slides away */
  const [openTicket, setOpenTicket] = useState(null);
  /* the Apple Pay sheet standing between asking and having: what it is
     for, how much, and what happens once it is paid */
  const [paySheet, setPaySheet] = useState(null);

  /* Screens that exist. A tile pointing at one still being built is a
     no-op rather than a drop back to the Landing screen. */
  const BUILT = new Set(["signup", "login", "forgot", "cardregister", "home", "tickets", "account", "carddetail", "reload", "autoload", "reloaddone", "payment", "history", "lost", "replace", "refund", "purchase", "passes", "upass", "upassconnect", "help", "shot", "wallet", "walletcard", "acctedit", "contact", "ticket", "ferryreserve", "buytickets"]);
  /* How one screen leaves and the next arrives. Going deeper slides in from
     the right, going back slides out to it, a tab change crosses over in
     place — the three moves a stack navigation has. The leaving screen is
     kept just long enough to play its half, then dropped. */
  const [anim, setAnim] = useState(null);
  const animCount = useRef(0);
  const animate = (dir) => setAnim({ from: current, dir, n: ++animCount.current });
  useEffect(() => {
    if (!anim) return undefined;
    const t = setTimeout(() => setAnim(null), anim.dir === "fade" ? 200 : 300);
    return () => clearTimeout(t);
  }, [anim]);
  /* the screens that are about one card, which an account with no cards
     cannot open — the assistant offers some of them, and an empty account
     may be sitting in that chat */
  const NEEDS_CARD = new Set(["carddetail", "reload", "autoload", "reloaddone", "history", "lost", "replace", "refund", "passes", "upass", "upassconnect", "wallet", "walletcard", "ferryreserve"]);
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

  /* Whichever card is open. Every screen under a card is handed this one
     rather than looking it up again. */
  const card = model.cards.find((c) => c.id === openCard) ?? model.cards[0];
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
     says what was paid for it */
  const applyPass = (pass) => {
    patchCard({
      pass: {
        type: pass.zones ? `${pass.short} · ${passZone}-Zone` : pass.short,
        expires: TODAY.monthEnd,
      },
      history: [
        { label: pass.name, sub: method, amount: -passPrice(pass, passZone), date: TODAY.ledger },
        ...card.history,
      ],
    });
    back();
  };

  /* a new card's default name: the frame's, unless the account already
     holds a card by that name, and numbered from there */
  const defaultName = () => {
    const taken = new Set(model.cards.map((c) => c.name));
    let name = "My Compass Card";
    for (let i = 2; taken.has(name); i++) name = `My Compass Card ${i}`;
    return name;
  };

  /* No form validates — the demo takes whatever is typed, including nothing,
     and moves on. Signing up leads through registering a card; logging in
     goes straight to the cards, since a returning account already has them.
     Both ways out of Card Register — registering one and carrying on without
     one — end at the same place. */
  const screen = (id) => {
    switch (id) {
      case "signup":
        return (
          <SignUp
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
            values={form.login}
            onChange={change("login")}
            onBack={back}
            /* a returning account has its cards already */
            onNext={() => {
              setModel((m) => ({ ...m, cards: seedState().cards }));
              home();
            }}
            onSignUp={() => push("signup")}
            onForgot={() => push("forgot")}
          />
        );
      case "forgot":
        return (
          <Forgot
            email={form.login.email}
            onBack={back}
            onSent={back}
          />
        );
      case "home":
        return (
          <CardList
            cards={model.cards}
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
            tickets={model.tickets}
            onSelectTab={selectTab}
            onAccount={() => push("account")}
            onOpen={push}
            onOpenTicket={(t) => { setOpenTicket(t); push("ticket"); }}
          />
        );
      case "ferryreserve":
        return (
          <ReserveFerries
            /* reserving acts on the primary card — the first one */
            card={model.cards[0]}
            onBack={back}
            /* a walk-on pays from stored value, so reserving is a deduction
               and a ledger line, not a charge — the same shape the seeded
               ferry entries have. The reservation becomes a ticket with a
               booking reference of its own, and if it is one of the board's
               sailings, the board says so. */
            onReserve={(route, time) => {
              const when = `${time} ${route.date}`;
              setModel((m) => ({
                ...m,
                cards: m.cards.map((c, idx) =>
                  idx === 0
                    ? {
                        ...c,
                        balance: c.balance - FARES.ferryWalkOn,
                        history: [
                          { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -FARES.ferryWalkOn, date: TODAY.ledger },
                          ...c.history,
                        ],
                      }
                    : c
                ),
                sailings: m.sailings.map((s) => (s.time === when ? { ...s, reserved: true } : s)),
                tickets: [
                  ...m.tickets,
                  { ref: bookingRef(), kind: "ferry", from: route.from, to: route.to, time: when, fare: FARES.ferryWalkOn, paidVia: "Stored value" },
                ],
              }));
              back();
            }}
          />
        );
      case "buytickets":
        return (
          <PurchaseTickets
            tickets={model.tickets}
            onBack={back}
            /* an event pass charges the payment method like any purchase —
               Apple Pay presents its sheet on the way through */
            onBuyEvent={(ev) =>
              charge(ev.name, FARES.dayPass, () =>
                setModel((m) => ({
                  ...m,
                  tickets: [
                    ...m.tickets,
                    { ref: bookingRef(), kind: "event", eventId: ev.id, name: ev.name, venue: ev.venue, time: ev.time, fare: FARES.dayPass, paidVia: method },
                  ],
                }))
              )
            }
          />
        );
      case "ticket":
        return (
          openTicket && (
            <TicketDetail
              ticket={openTicket}
              onBack={back}
              /* cancelling undoes exactly what issuing did: a reservation
                 hands its fare back to stored value and frees the sailing;
                 an event pass simply leaves, refunded to its method */
              onCancel={(t) => {
                setModel((m) => ({
                  ...m,
                  cards:
                    t.kind === "ferry"
                      ? m.cards.map((c, idx) =>
                          idx === 0
                            ? {
                                ...c,
                                balance: c.balance + t.fare,
                                history: [
                                  { label: "BC Ferries · Refund", sub: "Stored value", amount: t.fare, date: TODAY.ledger },
                                  ...c.history,
                                ],
                              }
                            : c
                        )
                      : m.cards,
                  sailings:
                    t.kind === "ferry"
                      ? m.sailings.map((s) => (s.time === t.time ? { ...s, reserved: false } : s))
                      : m.sailings,
                  tickets: m.tickets.filter((x) => x.ref !== t.ref),
                }));
                back();
              }}
            />
          )
        );
      case "carddetail":
        return (
          <CardDetail
            card={card}
            onBack={back}
            onAccount={() => push("account")}
            onOpen={(id) => push(id === "upass" && !card.upassOn ? "upassconnect" : id)}
            onSelectTab={selectTab}
          />
        );
      case "upass":
        return (
          <UPass
            card={card}
            upass={{ ...model.upass, autoRenew }}
            onBack={back}
            onAutoRenew={setAutoRenew}
            onSelectTab={selectTab}
          />
        );
      case "upassconnect":
        return (
          <UPassConnect
            card={card}
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
                  { label: "Reload", sub: method, amount: reloadAmount, date: TODAY.ledger },
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
            card={card}
            /* a card carrying a U-Pass is a Program pass card, and costs the
               Program pass fee to replace */
            programPass={!!card.upassOn}
            onBack={back}
            onOrder={() => patchCard({ replaced: true })}
          />
        );
      case "lost":
        return (
          <LostCard
            card={card}
            onBack={back}
            onFreeze={(frozen) => patchCard({ frozen })}
            onMove={() => push("replace")}
          />
        );
      case "history":
        return (
          <History
            card={card}
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
            onSend={() => {
              const text = draft.trim();
              if (!text) return;
              /* the assistant reads before it answers: the typing dots hold
                 its place, and the reply takes it over a beat later */
              setChat((c) => [...c, { from: "user", lines: [text] }, { from: "bot", typing: true }]);
              setDraft("");
              setTimeout(() => setChat((c) => [...c.slice(0, -1), reply(text)]), 900);
            }}
            onBack={back}
            onAction={push}
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
        return <TapResult shot={shot} declined={card.frozen} onDismiss={back} />;
      case "wallet":
        return <Wallet onOpenCard={() => push("walletcard")} onDismiss={back} />;
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
            card={card}
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
            card={card}
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
            field={editField}
            value={model.account[editField] ?? ""}
            onBack={back}
            onSave={(text) => { patchAccount({ [editField]: text }); back(); }}
          />
        );
      case "contact":
        return <Contact onBack={back} />;
      default:
        return <Landing onSignUp={() => push("signup")} onLogin={() => push("login")} />;
    }
  };

  return (
    <div className="screen" data-cards={model.cards.length}>
      {anim && (
        <div key={`out-${anim.n}`} className={`stage stage--out-${anim.dir}`} aria-hidden="true">
          {screen(anim.from)}
        </div>
      )}
      <div key={anim ? `in-${anim.n}` : "steady"} className={"stage" + (anim ? ` stage--in-${anim.dir}` : "")}>
        {screen(current)}
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
