/* The demo's starting state. It lives in memory only — the iframe is meant
   to open on a clean slate every time, so nothing is persisted.
   Every figure here is TransLink's own rather than a number picked to fill
   a frame, and every screen reads it from here rather than restating it. */

/* The day the demo lives on is the day it is opened. Every date a screen
   writes — the ledger line a reload adds, the month a pass covers, the day
   it expires, the sailings on the board — derives from this one clock
   rather than being written where it is shown. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const now = new Date();
const monthEndDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
export const TODAY = {
  /* the ledger writes its dates the way the seeded history does: Mar-1-2026 */
  ledger: `${MONTHS[now.getMonth()]}-${now.getDate()}-${now.getFullYear()}`,
  month: MONTH_NAMES[now.getMonth()],
  monthEnd: `${MONTHS[now.getMonth()]} ${monthEndDay}`,
};

/* the sailings board writes its dates zero-padded: Aug-02-2026 */
const sailingDate = (daysAhead) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead);
  return `${MONTHS[d.getMonth()]}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;
};

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
    time: `07:30 PM ${sailingDate(4)}`,
  },
  {
    id: "ev2",
    name: "Playland at the PNE",
    venue: "Hastings Park · R5 Hastings St",
    time: `11:00 AM ${sailingDate(9)}`,
  },
];

/* the eight digits BC Ferries stamps on a booking */
export const bookingRef = () => String(Math.floor(10000000 + Math.random() * 90000000));

/* Tsawwassen–Swartz Bay, dock to dock — BC Ferries' own figure */
export const CROSSING = "1 h 35 min";

/* BC Ferries' own map, the demo's slice: the Metro Vancouver – Island runs.
   Every terminal is real, every partner is a route that exists, and each
   run keeps its schedule's own departures and crossing time. The adult
   walk-on fare is the same on all three runs, which is why one figure
   serves them all. A run is named by its island end. */
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
/* a day written the sailing board's way, and the short way a control shows it */
export const boardDate = (d) =>
  `${MONTHS[d.getMonth()]}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;
export const dayLabel = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
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

export function seedState() {
  return {
    cards: [
      {
        id: "c1",
        name: "My Compass Card",
        balance: 15.0,
        twin: "Plastic + Wallet pass · one balance",
        frozen: false,
        /* the pass on the card is this month's — a monthly bought now is
           valid to the month's end, whichever month the demo is opened in */
        pass: { type: "Monthly · 2-Zone", expires: TODAY.monthEnd },
        history: [
          /* the two entries the tap frames are the confirmation of: the
             figures on those screens are these, read back */
          { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], date: "Mar-1-2026", shot: "tap" },
          { label: "Reload", sub: "Apple Pay", amount: 20.0, date: "Mar-1-2026" },
          { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -FARES.ferryWalkOn, date: "Feb-25-2026", shot: "ferry" },
          {
            label: "3-Zone trip",
            sub: "Stored value",
            amount: -FARES.storedValue[3],
            date: "Feb-25-2026",
            /* the only entry the frames open up: a trip is two taps, and the
               fare is only known at the second */
            taps: [
              { time: "07:31 AM", place: "Tap in at Burrard Stn", amount: money(0) },
              { time: "08:24 AM", place: "Tap out at Bridgeport Stn", amount: money(-FARES.storedValue[3]) },
            ],
            balanceAfter: 24.6,
          },
          { label: "Reload", sub: "Apple Pay", amount: 10.0, date: "Feb-25-2026" },
          /* the weeks before the frames: ordinary riding, written the way a
             real ledger falls — clumped some days, quiet others. The reload
             sits above the trip that all but emptied the card, being the
             answer to it. */
          { label: "Reload", sub: "Apple Pay", amount: 20.0, date: "Feb-21-2026" },
          {
            label: "2-Zone trip",
            sub: "Stored value",
            amount: -FARES.storedValue[2],
            date: "Feb-21-2026",
            taps: [
              { time: "05:12 PM", place: "Tap in at Waterfront Stn", amount: money(0) },
              { time: "05:46 PM", place: "Tap out at Lougheed Tn Ctr Stn", amount: money(-FARES.storedValue[2]) },
            ],
            balanceAfter: 0.4,
          },
          { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], date: "Feb-16-2026" },
          { label: "SeaBus trip", sub: "Stored value", amount: -FARES.storedValue[2], date: "Feb-13-2026" },
          { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], date: "Feb-13-2026" },
          { label: "2-Zone trip", sub: "Stored value", amount: -FARES.storedValue[2], date: "Feb-2-2026" },
          { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], date: "Jan-28-2026" },
          { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], date: "Jan-28-2026" },
          /* two days in Victoria: over on the 15th, back on the 17th, with a
             top-up first and the 620 out to the terminal — a bus trip is one
             tap, there being no tap out on a bus */
          { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -FARES.ferryWalkOn, date: "Jan-17-2026" },
          { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -FARES.ferryWalkOn, date: "Jan-15-2026" },
          {
            label: "1-Zone trip",
            sub: "Stored value",
            amount: -FARES.storedValue[1],
            date: "Jan-15-2026",
            taps: [{ time: "07:05 AM", place: "Tap in on Bus 620", amount: money(-FARES.storedValue[1]) }],
            balanceAfter: 62.15,
          },
          { label: "Reload", sub: "Apple Pay", amount: 50.0, date: "Jan-15-2026" },
          { label: "1-Zone trip", sub: "Stored value", amount: -FARES.storedValue[1], date: "Dec-30-2025" },
        ],
      },
    ],
    /* the card writes the school short and the connect screen writes it out */
    upass: {
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
    account: { name: "", address: "", phone: "", password: "", notifications: true },
    /* Written the way the Tickets frame writes them: the leg broken over two
       lines, the trailing dash included, and the sailing time spelled out in
       full rather than shortened. */
    /* out today, back in two days — the board follows the calendar */
    sailings: [
      {
        from: "Vancouver (Tsawwassen) -",
        to: "Victoria (Swartz Bay)",
        time: `06:00 PM ${sailingDate(0)}`,
        status: "On time",
      },
      {
        from: "Victoria (Swartz Bay) -",
        to: "Vancouver (Tsawwassen)",
        time: `01:00 PM ${sailingDate(2)}`,
        status: "On time",
      },
    ],
  };
}

/* $2.85, never $2.9 — every amount on screen carries both decimals. */
export function money(n) {
  return (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2);
}

/* The two shots of a tap going through — the gate's own screen rather than
   the app's, which is why nothing on them is drawn from the app's chrome.
   Both read back an entry the card already holds, down to what was left. */
const START_BALANCE = 15.0;
export const SHOTS = {
  tap: {
    amount: `${money(FARES.storedValue[1])} Deducted · ${money(START_BALANCE - FARES.storedValue[1])} Remaining`,
    sub: "1-Zone · Stored value",
    centred: false,
  },
  ferry: {
    eyebrow: "BC FERRIES · WALK-ON",
    amount: `${money(FARES.ferryWalkOn)} Deducted`,
    sub: "BC Ferries · Adult foot passenger",
    centred: true,
  },
};

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
export const signed = (n) =>
  (n < 0 ? "−$" : "+$") + Math.abs(n).toFixed(2);

/* History writes its date twice over: in full as the heading of a day's
   entries, and shortened beside the entry itself where the card detail
   shows only the last two. "Mar-1-2026" reads "Mar 1" there. */
export const shortDate = (date) => {
  const [month, day] = date.split("-");
  return `${month} ${day}`;
};

/* the entries of one card, grouped into the days the History screen lists */
export const byDate = (history) => {
  const days = [];
  for (const entry of history) {
    const last = days[days.length - 1];
    if (last && last.date === entry.date) last.entries.push(entry);
    else days.push({ date: entry.date, entries: [entry] });
  }
  return days;
};
