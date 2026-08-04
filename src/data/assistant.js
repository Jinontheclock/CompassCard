import { FARES, money } from "./seed.js";

/* What the assistant knows. It is a lookup, not a model: a message is
   matched against the topics below and the first one that matches answers.
   Every figure in an answer comes from the fare table rather than being
   written into the sentence, so the assistant cannot drift from the rest of
   the app, and most answers end by opening the screen that does the thing.

   The lines are broken by hand to the width of the bubble the frame draws —
   see the check in the harness, which fails if any of them overruns. */
export const TOPICS = [
  {
    id: "concession",
    match: /concession|child|children|kid|senior|youth|discount/i,
    lines: [
      `Concession trips are ${money(FARES.concession.storedValue[1])}, ${money(FARES.concession.storedValue[2])} and`,
      `${money(FARES.concession.storedValue[3])} by zone. A monthly is ${money(FARES.concession.monthly)}`,
      `and a DayPass ${money(FARES.concession.dayPass)}, all zones.`,
    ],
  },
  {
    id: "offpeak",
    match: /evening|weekend|after 6|night|holiday|off-?peak/i,
    lines: [
      "After 6:30 PM on weekdays — and all day",
      "on weekends and holidays — every trip",
      `charges the 1-Zone ${money(FARES.storedValue[1])}.`,
    ],
  },
  {
    id: "fare",
    match: /\bfare|charge|charged|cost|price|zone|how much.*(trip|ride)/i,
    lines: [
      `A trip costs ${money(FARES.storedValue[1])} in one zone,`,
      `${money(FARES.storedValue[2])} in two and ${money(FARES.storedValue[3])} in three.`,
      "Zones only count on weekdays before 6:30 PM.",
    ],
  },
  {
    id: "upass",
    match: /u-?pass|student|school|semester/i,
    lines: [
      `U-Pass BC is ${money(FARES.upassMonthly)} a month and is`,
      "billed with your student fees, not here.",
      "Connect it once and it renews itself.",
    ],
    action: { label: "U-Pass BC", sub: "Connect or check it", to: "upass" },
  },
  {
    id: "pass",
    match: /\bpass(es)?\b|monthly|daypass|day pass/i,
    lines: [
      `A monthly pass is ${money(FARES.monthly[1])} for one zone,`,
      `${money(FARES.monthly[2])} for two and ${money(FARES.monthly[3])} for three.`,
      `A DayPass covers every zone for ${money(FARES.dayPass)}.`,
    ],
    action: { label: "Buy a pass", sub: "Purchase Passes", to: "passes" },
  },
  {
    id: "balance",
    match: /balance|how much.*(left|have)|remaining/i,
    lines: ["Your balance is on the card's own screen,", "under STORED VALUE."],
    action: { label: "Stored value", sub: "Open the card", to: "carddetail" },
  },
  {
    id: "reload",
    match: /reload|top ?up|add money|load/i,
    lines: [
      `You can add ${money(FARES.reloadPresets[0])}, ${money(FARES.reloadPresets[1])} or`,
      `${money(FARES.reloadPresets[2])} at a time, or set Autoload to do it.`,
    ],
    action: { label: "Add stored value", sub: "Open Reload", to: "reload" },
  },
  {
    id: "autoload",
    match: /auto ?load/i,
    lines: [
      "Autoload tops the card up on its own",
      "when the balance runs low. Nothing is",
      "charged until you turn it on.",
    ],
    action: { label: "Autoload", sub: "Set it up", to: "autoload" },
  },
  {
    id: "lost",
    match: /lost|stolen|missing|freeze|frozen/i,
    lines: [
      "Freeze it and nothing is lost. The balance",
      "sits on your account, not the plastic.",
    ],
    action: { label: "Freeze this card", sub: "Open Lost Card", to: "lost" },
  },
  {
    id: "replace",
    match: /replace|broken|damaged|new card/i,
    lines: [
      `A replacement card is ${money(FARES.cardFee)}, or`,
      `${money(FARES.programCardFee)} if it carries a Program pass.`,
      "Your balance and passes move across.",
    ],
    action: { label: "Order a replacement", sub: "Open Replace Card", to: "replace" },
  },
  {
    id: "refund",
    match: /refund|money back|cancel/i,
    lines: [
      "A refund returns the stored value to your",
      "payment method and closes the card.",
    ],
    action: { label: "Request a refund", sub: "Open Refund", to: "refund" },
  },
  {
    id: "ferry",
    match: /ferry|ferries|sailing|swartz|tsawwassen/i,
    lines: [
      `A walk-on to Victoria is ${money(FARES.ferryWalkOn)}.`,
      "It comes off the same balance.",
      "Sailings are on the Tickets tab.",
    ],
  },
  {
    id: "wallet",
    match: /wallet|apple pay|phone|tap with/i,
    lines: [
      "Add the card to Apple Wallet and you can",
      "tap with the phone. Both share one",
      "balance.",
    ],
    action: { label: "Apple Wallet", sub: "Open the pass", to: "wallet" },
  },
  {
    id: "history",
    match: /history|trip|journey|statement|receipt/i,
    lines: ["Every tap and reload is listed, newest", "first, with what each one came to."],
    action: { label: "All activity", sub: "View in History", to: "history" },
  },
];

/* Nothing matched. The assistant says so plainly rather than guessing, and
   points at the button that reaches somebody who can answer. */
export const FALLBACK = {
  lines: [
    "I can help with fares, passes, reloads,",
    "a lost card, refunds and U-Pass BC.",
    "For anything else, Talk to a Person below.",
  ],
};

/* The topic that the message points at hardest wins, not the first one it
   brushes against: "what does a monthly pass cost" names two things the
   passes topic knows and one the fares topic does, so it is answered about
   passes. A tie goes to whichever is listed first, which is why the U-Pass
   sits above passes — every u-pass is also a pass. */
export const reply = (text) => {
  const score = (topic) => (text.match(new RegExp(topic.match.source, "gi")) ?? []).length;
  const best = TOPICS.map((t) => [t, score(t)])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])[0];
  const topic = best?.[0] ?? FALLBACK;
  return { from: "bot", lines: topic.lines, action: topic.action };
};
