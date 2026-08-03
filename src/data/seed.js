/* The demo's starting state. It lives in memory only — the iframe is meant
   to open on a clean slate every time, so nothing is persisted.
   Every figure here is fixed by the case study: fares, dates and copy are
   not invented at runtime. */

export const FARES = {
  oneZone: 2.85,
  ferryWalkOn: 19.1,
  reloadPresets: [10, 20, 50],
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
          { label: "1-Zone trip", sub: "Stored value · Jul 28", amount: -2.85 },
          { label: "Reload", sub: "Apple Pay · Jul 26", amount: 20.0 },
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
    upass: { school: "BCIT", month: "August", renewed: true, autoRenew: true },
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
export const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2);
