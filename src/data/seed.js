/* The demo's starting state. It lives in memory only — the iframe is meant
   to open on a clean slate every time, so nothing is persisted.
   Every figure here is fixed by the case study: fares, dates and copy are
   not invented at runtime. */

export const FARES = {
  oneZone: 2.85,
  ferryWalkOn: 19.1,
  reloadPresets: [10, 20, 50],
  replacementFee: 25.0,
};

export function seedState() {
  return {
    cards: [
      {
        id: "c1",
        name: "My Compass Card",
        balance: 15.0,
        twin: "Plastic + Wallet pass · one balance",
        frozen: false,
        pass: { type: "Monthly · 2-Zone", expires: "Jul 31" },
        history: [
          { label: "1-Zone trip", sub: "Stored value", amount: -2.85, date: "Mar-1-2026" },
          { label: "Reload", sub: "Apple Pay", amount: 20.0, date: "Mar-1-2026" },
          { label: "BC Ferries · Walk-on", sub: "Adult foot passenger", amount: -19.1, date: "Feb-25-2026" },
          {
            label: "3-Zone trip",
            sub: "Stored value",
            amount: -5.4,
            date: "Feb-25-2026",
            /* the only entry the frames open up: a trip is two taps, and the
               fare is only known at the second */
            taps: [
              { time: "07:31 AM", place: "Tap in at Burrard Stn", amount: "$0.00" },
              { time: "08:24 AM", place: "Tap out at Bridgeport Stn", amount: "-$5.40" },
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

/* The two passes the purchase frame offers, in the order it lists them.
   `short` is how the button names the product — "Monthly", not "Monthly
   Pass". The Monthly is zone-priced in life, but the frame states one
   figure and only one, so the price stands whichever zone is chosen. */
export const PASSES = [
  {
    id: "monthly",
    name: "Monthly Pass",
    short: "Monthly",
    desc: "Unlimited travel in your zones for a calendar month",
    zones: [1, 2, 3],
    valid: "August · valid Aug 31",
    price: 156.7,
  },
  {
    id: "daypass",
    name: "Daypass",
    short: "Daypass",
    desc: "Unlimited travel in your zones for a calendar month",
    valid: "August · valid Aug 31",
    price: 12.55,
  },
];

/* $2.85, never $2.9 — every amount on screen carries both decimals. */
export const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2);

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
