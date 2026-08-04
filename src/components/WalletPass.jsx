import { dayLabel } from "../data/seed.js";

/* The pass, drawn Apple Wallet's way — matched to the Hi-Fi board's
   templates rather than the app's own kit, because a pass is Wallet's
   surface, not the app's. The ferry boarding pass takes the airline
   template with ferry words: terminal codes where airport codes go,
   berth for gate, sailing for flight, crossing for group. The event
   ticket takes the concert template, each event in its own accent.

   Every code drawn is deterministic in the booking reference, so a
   ticket always shows its own pattern. */

/* the terminals, coded the way BC Ferries shortens them */
const CODES = {
  "Vancouver (Tsawwassen)": { city: "VANCOUVER", code: "TSA" },
  "West Vancouver (Horseshoe Bay)": { city: "WEST VANCOUVER", code: "HSB" },
  "Victoria (Swartz Bay)": { city: "VICTORIA", code: "SWB" },
  "Nanaimo (Duke Point)": { city: "NANAIMO", code: "DUK" },
  "Nanaimo (Departure Bay)": { city: "NANAIMO", code: "DEP" },
};
/* each event wears its venue's accent */
const EVENT_LOOKS = {
  ev1: { accent: "#e2735f", brand: "★ BC PLACE", location: "BC Place" },
  ev2: { accent: "#e9a83a", brand: "▲ PNE", location: "Hastings Park" },
};

const seededRand = (seed) => {
  let s = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    s ^= seed.charCodeAt(i);
    s = Math.imul(s, 16777619) >>> 0;
  }
  return () => {
    s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0;
    return s / 4294967296;
  };
};

/* the scannable square, as before — a QR the gate could read */
function QRArt({ seed, size = 118 }) {
  const N = 21;
  const rnd = seededRand(seed);
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const cells = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) if (!inFinder(r, c) && rnd() < 0.46) cells.push([r, c]);
  const m = size / N;
  return (
    <svg className="wpass-qr" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect width={size} height={size} fill="#fff" />
      {cells.map(([r, c]) => (
        <rect key={r + "-" + c} x={c * m} y={r * m} width={m} height={m} fill="#1c1c1e" />
      ))}
      {[[0, 0], [N - 7, 0], [0, N - 7]].map(([c, r]) => (
        <g key={c + "/" + r}>
          <rect x={c * m} y={r * m} width={7 * m} height={7 * m} fill="#1c1c1e" />
          <rect x={(c + 1) * m} y={(r + 1) * m} width={5 * m} height={5 * m} fill="#fff" />
          <rect x={(c + 2) * m} y={(r + 2) * m} width={3 * m} height={3 * m} fill="#1c1c1e" />
        </g>
      ))}
    </svg>
  );
}

/* the one-dimensional cousin, for the event tickets */
function BarsArt({ seed, width = 220, height = 44 }) {
  const rnd = seededRand(seed);
  const bars = [];
  let x = 0;
  while (x < width - 3) {
    const w = 1 + Math.floor(rnd() * 3);
    if (rnd() < 0.58) bars.push([x, w]);
    x += w + 1;
  }
  return (
    <svg className="wpass-bars" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <rect width={width} height={height} fill="#fff" />
      {bars.map(([bx, bw], i) => (
        <rect key={i} x={bx} y={0} width={bw} height={height} fill="#1c1c1e" />
      ))}
    </svg>
  );
}

const kv = (k, v, right) => (
  <span className={"wpass-kv" + (right ? " wpass-kv--right" : "")}>
    <span className="wpass-k">{k}</span>
    <span className="wpass-v">{v}</span>
  </span>
);

export default function WalletPass({ ticket, passenger = "Guest" }) {
  if (ticket.kind === "ferry") {
    const [time, date] = [ticket.time.slice(0, 8), ticket.time.slice(9)];
    const from = CODES[ticket.from.replace(/ -$/, "")] ?? { city: "", code: "···" };
    const to = CODES[ticket.to] ?? { city: "", code: "···" };
    const d = new Date(date.replace(/-/g, " "));
    return (
      <div className="wpass wpass--ferry">
        <div className="wpass-top">
          <span className="wpass-brand">BC Ferries</span>
          {kv("BERTH", String(3 + (Number(ticket.ref) % 3)), true)}
        </div>
        <div className="wpass-route">
          <span className="wpass-end">
            <span className="wpass-city">{from.city}</span>
            <span className="wpass-code">{from.code}</span>
          </span>
          <svg className="wpass-vessel" width="26" height="18" viewBox="0 0 26 18" aria-hidden="true">
            <path d="M3 12h20l-2.5 4h-15L3 12z" fill="#fff" />
            <rect x="8" y="7" width="10" height="4" rx="1" fill="#fff" />
            <rect x="11" y="3" width="4" height="3" rx="1" fill="#fff" />
          </svg>
          <span className="wpass-end wpass-end--right">
            <span className="wpass-city">{to.city}</span>
            <span className="wpass-code">{to.code}</span>
          </span>
        </div>
        <div className="wpass-fields">
          {kv("SCHEDULED", time)}
          {kv("SAILING", isNaN(d) ? date : dayLabel(d))}
          {kv("FARE", ticket.fareSub?.startsWith("Child") ? "Child" : "Adult")}
          {kv("CROSSING", ticket.crossing ?? "1 h 35 min")}
        </div>
        <div className="wpass-fields wpass-fields--one">
          {kv("PASSENGER", passenger.toUpperCase())}
        </div>
        <div className="wpass-code-panel">
          <QRArt seed={ticket.ref} />
          <span className="wpass-ref tnum">{ticket.ref}</span>
        </div>
      </div>
    );
  }

  const look = EVENT_LOOKS[ticket.eventId] ?? EVENT_LOOKS.ev1;
  const [evTime, evDate] = [ticket.time.slice(0, 8), ticket.time.slice(9)];
  const ed = new Date(evDate.replace(/-/g, " "));
  return (
    <div className="wpass wpass--event" style={{ background: look.accent }}>
      <div className="wpass-top">
        <span className="wpass-brand">{look.brand}</span>
        <span className="wpass-toprow">
          {kv("DATE", isNaN(ed) ? evDate : dayLabel(ed), true)}
          {kv("TIME", evTime, true)}
        </span>
      </div>
      <div className="wpass-fields wpass-fields--one">
        {kv("EVENT", ticket.name)}
      </div>
      <div className="wpass-fields">
        {kv("LOCATION", look.location)}
        {kv("CHECK-IN", evTime)}
        {kv("VALID", "All zones")}
        {kv("FARE", "Day Pass")}
      </div>
      <div className="wpass-code-panel">
        <BarsArt seed={ticket.ref} />
        <span className="wpass-ref tnum">{ticket.ref}</span>
      </div>
    </div>
  );
}
