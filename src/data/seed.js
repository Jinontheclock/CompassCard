/* The demo's starting state. It lives in memory only — the iframe is meant
   to open on a clean slate every time, so nothing is persisted.
   Every figure here is TransLink's own rather than a number picked to fill
   a frame, and every screen reads it from here rather than restating it. */

/* TransLink's fares, effective July 1 2026. Adult rates: the app has no
   concession anywhere, so the concession table is not carried. */
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
  /* BC Ferries, Tsawwassen–Swartz Bay, adult foot passenger */
  ferryWalkOn: 19.1,
  /* what the reload screen offers, and what Autoload can be set to */
  reloadPresets: [10, 20, 50],
  autoloadAmounts: [5, 10, 20, 50, 100],
  autoloadThresholds: [5, 10, 20],
};

/* Replacing a card costs what the card carries: a Program pass card is the
   expensive one, which is what the note beside it says. */
export const replacementFee = (hasProgramPass) =>
  hasProgramPass ? FARES.programCardFee : FARES.cardFee;

export function seedState() {
  return {
    cards: [
      {
        id: "c1",
        name: "My Compass Card",
        balance: 15.0,
        twin: "Plastic + Wallet pass · one balance",
        frozen: false,
        /* the demo sits in August 2026, so the pass on the card is August's
           — the purchase frame says a monthly bought now is valid Aug 31 */
        pass: { type: "Monthly · 2-Zone", expires: "Aug 31" },
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
        ],
      },
      {
        id: "c2",
        name: "Second Card",
        balance: 5.0,
        twin: null,
        frozen: false,
        pass: null,
        history: [],
      },
    ],
    /* the card writes the school short and the connect screen writes it out */
    upass: {
      school: "BCIT",
      schoolName: "British Columbia Institute of Technology",
      month: "August",
      renewed: true,
      autoRenew: true,
    },
    autoload: { on: false, threshold: 5.0, amount: 10.0 },
    /* Written the way the Tickets frame writes them: the leg broken over two
       lines, the trailing dash included, and the sailing time spelled out in
       full rather than shortened. */
    sailings: [
      {
        from: "Vancouver (Tsawwassen) -",
        to: "Victoria (Swartz Bay)",
        time: "06:00 PM Aug-02-2026",
        status: "On time",
      },
      {
        from: "Victoria (Swartz Bay) -",
        to: "Vancouver (Tsawwassen)",
        time: "01:00 PM Aug-04-2026",
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
    valid: "August · valid Aug 31",
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
