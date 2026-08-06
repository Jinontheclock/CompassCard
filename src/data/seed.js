/* The demo's starting state. It lives in memory only — the iframe is meant
   to open on a clean slate every time, so nothing is persisted.
   Every figure here is TransLink's own rather than a number picked to fill
   a frame, and every screen reads it from here rather than restating it. */

/* The day the demo lives on is the day it is opened. Every date a screen
   writes — the ledger line a reload adds, the month a pass covers, the day
   it expires, the sailings offered to reserve — derives from this one clock
   rather than being written where it is shown. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const now = new Date();
const monthEndDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
export const TODAY = {
  month: MONTH_NAMES[now.getMonth()],
  monthEnd: `${MONTHS[now.getMonth()]} ${monthEndDay}`,
};

/* Nothing here stores a date. A day is kept as its distance from today —
   negative behind, positive ahead — so the demo's past stays the same
   distance behind whenever it is opened, and the two are turned into words
   in one place. Vancouver keeps daylight saving, so a day is not always
   86,400,000ms; rounding is what carries the two nights it isn't. */
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const dateFromOffset = (n) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);
export const offsetOf = (d) => Math.round((startOfDay(d) - startOfDay(now)) / 86400000);
export const fmtDate = (d) => {
  const n = offsetOf(d);
  if (n === 0) return "Today";
  if (n === -1) return "Yesterday";
  if (n === 1) return "Tomorrow";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
/* the same, said from an offset — which is how everything here stores one.
   A ticket counts forward to the day it is for; the ledger counts back to
   the day it happened, so each has its own way in and the sign is written
   down once rather than at every call. */
export const dayName = (n) => fmtDate(dateFromOffset(n));
export const agoName = (daysAgo) => fmtDate(dateFromOffset(-daysAgo));
/* a clock time and the day it falls on, as a row writes them together */
export const whenLabel = (time, days) => `${time} · ${dayName(days)}`;

/* TransLink's fares, effective July 1 2026. Adult rates carry the app;
   the concession table is here for what quotes it — the assistant. */
export const FARES = {
  /* stored value, by zone */
  storedValue: { 1: 2.85, 2: 4.2, 3: 5.4 },
  /* a monthly pass, by zone */
  monthly: { 1: 117.2, 2: 156.7, 3: 211.65 },
  /* a DayPass covers every zone, so it has one price */
  dayPass: 12.55,
  /* U-Pass BC for Sep 1 2025 – Aug 31 2026, the year the demo sits in.
     It is collected with student fees rather than paid in the app. */
  upassMonthly: 46.9,
  /* replacing the plastic: a plain card, and one carrying a Program pass */
  cardFee: 6.0,
  programCardFee: 25.0,
  /* a digital card is issued in the app for nothing */
  digitalCardFee: 0,
  /* BC Ferries, Metro Vancouver – Island, adult foot passenger — and the
     child (5–11) fare, which is half the adult's */
  ferryWalkOn: 19.1,
  ferryWalkOnChild: 9.55,
  /* the concession rates: stored value by zone, one DayPass, one monthly */
  concession: { storedValue: { 1: 2.3, 2: 3.4, 3: 4.6 }, dayPass: 9.75, monthly: 66.95 },
  /* what the reload screen offers, and what Autoload can be set to */
  reloadPresets: [10, 20, 50],
  autoloadAmounts: [5, 10, 20, 50, 100],
  autoloadThresholds: [5, 10, 20],
};

/* Replacing a card costs what the card carries: a Program pass card is the
   expensive one, which is what the note beside it says. */
export const replacementFee = (hasProgramPass) =>
  hasProgramPass ? FARES.programCardFee : FARES.cardFee;

/* What the Tickets tab can put a pass to: real venues on the network, the
   station or route that serves them, and dates that follow the calendar the
   way the sailings do. An event pass is a DayPass in event clothes — all
   zones, the day of the event — priced from the same table. */
export const EVENTS = [
  {
    id: "ev1",
    name: "Whitecaps FC Match",
    venue: "BC Place · Stadium–Chinatown Stn",
    time: "07:30 PM",
    days: 4,
  },
  {
    id: "ev2",
    name: "Playland at the PNE",
    venue: "Hastings Park · R5 Hastings St",
    time: "11:00 AM",
    days: 9,
  },
];

/* Controls that exist only to drive the demo — turning the calendar forward
   to watch a pass renew, and anything else that skips ahead — are not part
   of the app being shown, and a capture should not contain one. They are
   kept behind `?demo=1`, read once here so every such control asks the same
   question. The app has no router, so this is the whole of its query
   handling. */
export const DEMO =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo");

/* the eight digits BC Ferries stamps on a booking */
export const bookingRef = () => String(Math.floor(10000000 + Math.random() * 90000000));

/* Tsawwassen–Swartz Bay, dock to dock — BC Ferries' own figure */
export const CROSSING = "1 h 35 min";

/* BC Ferries' own map, the demo's slice: the Metro Vancouver – Island runs.
   Every terminal is real, every partner is a route that exists, and each
   run keeps its schedule's own departures and crossing time. The adult
   walk-on fare is the same on all three runs, which is why one figure
   serves them all. A run is named by its island end. */
/* the terminals as BC Ferries shortens them — the boarding pass sets these
   where an airline sets airport codes, and the Wallet stack reads the same
   table, so a tile and the pass it belongs to name one route */
export const CODES = {
  "Vancouver (Tsawwassen)": { city: "VANCOUVER", code: "TSA" },
  "West Vancouver (Horseshoe Bay)": { city: "WEST VANCOUVER", code: "HSB" },
  "Victoria (Swartz Bay)": { city: "VICTORIA", code: "SWB" },
  "Nanaimo (Duke Point)": { city: "NANAIMO", code: "DUK" },
  "Nanaimo (Departure Bay)": { city: "NANAIMO", code: "DEP" },
};

export const FERRY = {
  links: {
    "Vancouver (Tsawwassen)": ["Victoria (Swartz Bay)", "Nanaimo (Duke Point)"],
    "West Vancouver (Horseshoe Bay)": ["Nanaimo (Departure Bay)"],
    "Victoria (Swartz Bay)": ["Vancouver (Tsawwassen)"],
    "Nanaimo (Duke Point)": ["Vancouver (Tsawwassen)"],
    "Nanaimo (Departure Bay)": ["West Vancouver (Horseshoe Bay)"],
  },
  times: {
    "Victoria (Swartz Bay)": ["07:00 AM", "09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "06:00 PM"],
    "Nanaimo (Duke Point)": ["05:15 AM", "07:45 AM", "10:15 AM", "12:45 PM", "03:15 PM", "05:45 PM"],
    "Nanaimo (Departure Bay)": ["06:15 AM", "08:25 AM", "10:40 AM", "12:50 PM", "03:10 PM", "05:20 PM"],
  },
  crossings: {
    "Victoria (Swartz Bay)": "1 h 35 min",
    "Nanaimo (Duke Point)": "2 h 0 min",
    "Nanaimo (Departure Bay)": "1 h 40 min",
  },
};
/* the run a pair of terminals rides, named by whichever end is the island's */
export const ferryRun = (from, to) =>
  Object.keys(FERRY.times).find((t) => t === from || t === to);
export const MONTH_NAMES_FULL = MONTH_NAMES;

/* The schools in the U-Pass BC programme the connect screen can pick from —
   the real participating institutions, written the way each writes itself.
   `short` is what fits on the card. */
export const SCHOOLS = [
  { short: "BCIT", name: "British Columbia Institute of Technology" },
  { short: "UBC", name: "University of British Columbia" },
  { short: "SFU", name: "Simon Fraser University" },
  { short: "Langara", name: "Langara College" },
  { short: "Douglas", name: "Douglas College" },
  { short: "KPU", name: "Kwantlen Polytechnic University" },
  { short: "VCC", name: "Vancouver Community College" },
];

/* A card the account has just gained. Buying a digital card starts it empty
   at whatever was loaded on purchase; registering the plastic brings the
   card's own past with it, which for this demo is the seeded card — the one
   the frames draw. */
export const digitalCard = (name, balance = 0) => ({
  id: "c" + Math.random().toString(36).slice(2, 8),
  name,
  balance,
  twin: null,
  frozen: false,
  pass: null,
  history: [],
});
/* A fresh id every time: registering, refunding and registering again must
   never hand two cards the same one. */
export const registeredCard = (digits = "") => ({
  ...seedState().cards[0],
  id: "c" + Math.random().toString(36).slice(2, 8),
  twin: digits ? `Plastic ···· ${digits.slice(-4)} · one balance` : seedState().cards[0].twin,
});

/* What the card held before the oldest line below. It is the only balance
   written down anywhere: every other figure — each entry's running total,
   and the card's own balance — is this one plus the lines that followed. */
const OPENING_BALANCE = 7.4;

/* The card's life so far, newest first, the way History reads it. Not one
   line carries a balance: a balance is what the lines before it add up to,
   not a number kept beside them. */
const LEDGER = [
  /* the two entries the tap frames are the confirmation of: the figures on
     those screens are these, read back */
  {
    label: "1-Zone trip",
    sub: "Stored value",
    amount: -FARES.storedValue[1],
    daysAgo: 0,
    taps: [
      { time: "09:12 AM", place: "Tap in at Main St–Science World Stn", amount: money(0) },
      { time: "09:26 AM", place: "Tap out at Waterfront Stn", amount: money(-FARES.storedValue[1]) },
    ],
    shot: "tap",
  },
  { label: "Reload", sub: "Apple Pay", amount: 10.0, daysAgo: 0 },
  {
    label: "BC Ferries · Walk-on",
    sub: "Adult foot passenger",
    amount: -FARES.ferryWalkOn,
    daysAgo: 4,
    /* a ferry pays the whole fare at the gangway — one tap */
    taps: [{ time: "04:45 PM", place: "Tap in at Tsawwassen terminal", amount: money(-FARES.ferryWalkOn) }],
    shot: "ferry",
  },
  {
    label: "3-Zone trip",
    sub: "Stored value",
    amount: -FARES.storedValue[3],
    daysAgo: 4,
    /* the only entry the frames open up: a trip is two taps, and the fare is
       only known at the second */
    taps: [
      { time: "07:31 AM", place: "Tap in at Burrard Stn", amount: money(0) },
      { time: "08:24 AM", place: "Tap out at Bridgeport Stn", amount: money(-FARES.storedValue[3]) },
    ],
  },
  { label: "Reload", sub: "Apple Pay", amount: 10.0, daysAgo: 4 },
  /* the weeks before the frames: ordinary riding, written the way a real
     ledger falls — clumped some days, quiet others. The reload sits above
     the trip that took the card down to single figures, being the answer
     to it. */
  { label: "Reload", sub: "Apple Pay", amount: 10.0, daysAgo: 8 },
  {
    label: "2-Zone trip",
    sub: "Stored value",
    amount: -FARES.storedValue[2],
    daysAgo: 8,
    taps: [
      { time: "05:12 PM", place: "Tap in at Waterfront Stn", amount: money(0) },
      { time: "05:46 PM", place: "Tap out at Lougheed Tn Ctr Stn", amount: money(-FARES.storedValue[2]) },
    ],
  },
  { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], daysAgo: 13 },
  { label: "SeaBus trip", sub: "Stored value", amount: -FARES.storedValue[2], daysAgo: 16 },
  { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], daysAgo: 16 },
  /* the top-up that carried the card through the quiet weeks after Victoria */
  { label: "Reload", sub: "Apple Pay", amount: 20.0, daysAgo: 20 },
  { label: "2-Zone trip", sub: "Stored value", amount: -FARES.storedValue[2], daysAgo: 27 },
  { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], daysAgo: 32 },
  { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], daysAgo: 32 },
  /* two days on the Island: over six and a half weeks back, home two days
     later, with a top-up first and the 620 out to the terminal — a bus trip
     is one tap, there being no tap out on a bus */
  { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -FARES.ferryWalkOn, daysAgo: 43 },
  { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -FARES.ferryWalkOn, daysAgo: 45 },
  {
    label: "1-Zone trip",
    sub: "Stored value",
    amount: -FARES.storedValue[1],
    daysAgo: 45,
    taps: [{ time: "07:05 AM", place: "Tap in on Bus 620", amount: money(-FARES.storedValue[1]) }],
  },
  { label: "Reload", sub: "Apple Pay", amount: 50.0, daysAgo: 45 },
  { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], daysAgo: 61 },
];

/* The ledger's own arithmetic. A balance only makes sense forwards, so the
   running total is walked from the oldest line up, and each line that moved
   the stored value keeps what the card held once it had settled — the
   card's balance being simply the last of those.
   Not every line moves it. A pass is bought with Apple Pay, so its ledger
   line records a payment the card never made; a U-Pass month costs nothing
   at all and carries words where an amount would be. Both are stepped over,
   and neither is given a balance to show. */
export const settle = (history, opening = OPENING_BALANCE) => {
  let balance = opening;
  const settled = new Array(history.length);
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    const moves = entry.movesBalance !== false && typeof entry.amount === "number";
    if (moves) balance = Math.round((balance + entry.amount) * 100) / 100;
    settled[i] = moves ? { ...entry, balanceAfter: balance } : entry;
  }
  return { history: settled, balance };
};

export function seedState() {
  return {
    cards: [
      {
        id: "c1",
        name: "My Compass Card",
        twin: "Plastic + Wallet pass · one balance",
        frozen: false,
        /* no pass on it: every fare below was paid out of stored value,
           which is what a card without a monthly does */
        pass: null,
        /* the balance and every figure in the history are settled from the
           opening balance rather than written here */
        ...settle(LEDGER),
      },
    ],
    /* the card writes the school short and the connect screen writes it out */
    upass: {
      offset: 0,
      school: "BCIT",
      schoolName: "British Columbia Institute of Technology",
      month: TODAY.month,
      renewed: true,
      autoRenew: true,
    },
    /* what the Tickets tab has issued: reservations and event passes */
    tickets: [],
    autoload: { on: false, threshold: 5.0, amount: 10.0 },
    /* what pays: the methods on file, and the one everything charges to */
    payment: { methods: ["Apple Pay"], primary: "Apple Pay" },
    /* what the Account rows hold. Empty until typed — the frames draw the
       rows without values, which is exactly an account nothing has been
       written into yet. */
    account: { name: "", email: "", address: "", phone: "", password: "", notifications: true },
    /* the portrait only a returning rider carries */
    avatar: false,
  };
}

/* $2.85, never $2.9 — every amount on screen carries both decimals. */
export function money(n) {
  return (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2);
}

/* The two shots of a tap going through — the gate's own screen rather than
   the app's, which is why nothing on them is drawn from the app's chrome.
   How a kind of tap presents itself is fixed here; what it says was taken
   is not. That comes from the entry the screen was opened from, so the
   gate reads back the trip it belongs to rather than one figure for all. */
export const SHOTS = {
  tap: {
    sub: "1-Zone · Stored value",
    centred: false,
  },
  ferry: {
    eyebrow: "BC FERRIES · WALK-ON",
    sub: "BC Ferries · Adult foot passenger",
    centred: true,
  },
};

/* what the gate took, and what it left. The ledger keeps a fare as the debit
   it is; the gate states it plainly, so the sign comes off on the way. */
export const gateAmount = (entry) =>
  `${money(Math.abs(entry.amount))} Deducted` +
  (entry.balanceAfter != null ? ` · ${money(entry.balanceAfter)} Remaining` : "");

/* The two passes the purchase frame offers, in the order it lists them.
   `short` is how the button names the product — "Monthly", not "Monthly
   Pass". The Monthly is priced by zone, so it carries the whole table and
   the screen shows whichever zone is chosen; a DayPass covers every zone,
   so it has one price and no zones to pick. */
export const PASSES = [
  {
    id: "monthly",
    name: "Monthly Pass",
    short: "Monthly",
    desc: "Unlimited travel in your zones for a calendar month",
    zones: [1, 2, 3],
    prices: FARES.monthly,
    valid: `${TODAY.month} · valid ${TODAY.monthEnd}`,
  },
  {
    id: "daypass",
    name: "DayPass",
    short: "DayPass",
    desc: "Unlimited travel in all zones for one day",
    price: FARES.dayPass,
    valid: "Valid the day you first tap",
  },
];

/* What a pass costs as chosen: the Monthly by zone, the DayPass flat. */
export const passPrice = (pass, zone) => (pass.zones ? pass.prices[zone] : pass.price);

/* History reads as a ledger, so a credit carries its plus and a debit the
   true minus sign rather than a hyphen. */
/* the name of the month `offset` months from now — the U-Pass rolls on it */
export const monthName = (offset = 0) =>
  MONTHS[(new Date().getMonth() + offset) % 12];

export const signed = (n) =>
  (n < 0 ? "−$" : "+$") + Math.abs(n).toFixed(2);



/* the entries of one card, grouped into the days the History screen lists */
export const byDate = (history) => {
  const days = [];
  for (const entry of history) {
    const last = days[days.length - 1];
    if (last && last.daysAgo === entry.daysAgo) last.entries.push(entry);
    else days.push({ daysAgo: entry.daysAgo, entries: [entry] });
  }
  return days;
};

/* The rider who logs in rather than signs up: the same card, but a life
   already lived on it — a name and contacts on the account, the portrait
   in the corner, and a shelf holding a return crossing and an event.
   Signing up starts from nothing; logging in starts from here. */
export function loginState() {
  const m = seedState();
  m.avatar = true;
  m.account = {
    /* A stand-in rider. The demo is public, so nobody real lives here:
       example.com is reserved by RFC 2606 and 555-01xx is the number range
       kept aside for fiction. */
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    address: "1234 Main St, Vancouver, BC",
    phone: "(604) 555-0132",
    password: "compass",
    notifications: true,
  };
  const ev = EVENTS[0];
  m.tickets = [
    {
      ref: "31459268",
      kind: "ferry",
      from: "Vancouver (Tsawwassen) -",
      to: "Victoria (Swartz Bay)",
      time: "06:00 PM",
      days: 0,
      crossing: CROSSING,
      fare: FARES.ferryWalkOn,
      fareSub: "Adult foot passenger",
      paidVia: "Apple Pay",
    },
    {
      ref: "31459269",
      kind: "ferry",
      from: "Victoria (Swartz Bay) -",
      to: "Vancouver (Tsawwassen)",
      time: "01:00 PM",
      days: 2,
      crossing: CROSSING,
      fare: FARES.ferryWalkOn,
      fareSub: "Adult foot passenger",
      paidVia: "Apple Pay",
    },
    {
      ref: "48271935",
      kind: "event",
      eventId: ev.id,
      name: ev.name,
      venue: ev.venue,
      time: ev.time,
      days: ev.days,
      fare: FARES.dayPass,
      paidVia: "Apple Pay",
    },
  ];
  return m;
}
