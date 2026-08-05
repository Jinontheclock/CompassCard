import { dayLabel, CODES } from "../data/seed.js";
import bcfLogo from "../assets/bcferries-logo.png";
import starLogo from "../assets/star-logo.png";
import triangleLogo from "../assets/triangle-logo.png";
import stripConcert from "../assets/pass-strip-concert.png";
import stripCinema from "../assets/pass-strip-cinema.png";
import stripCoupon from "../assets/pass-strip-coupon.png";
import passIcon from "../assets/pass-icon.png";
import contactlessIcon from "../assets/icon-contactless.svg";

/* The pass, drawn Apple Wallet's way — from the Hi-Fi board's own
   templates, assets and all. The ferry boarding pass takes the airline
   template with ferry words — terminal codes where airport codes go,
   berth for gate, sailing for flight — under the BC Ferries wordmark
   the board carries. An event ticket draws one of the board's three
   ticket examples: the concert, the cinema, or the coupon, each with
   its strip artwork and its maker's logo. Which one a ticket gets is
   the booking reference's choice — random at purchase, faithful to the
   ticket ever after, like every code drawn on these passes. */

const VENUES = { ev1: "BC Place", ev2: "Hastings Park" };

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

/* the scannable square — a QR the gate could read */
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

/* the one-dimensional cousin, for the tickets that scan sideways */
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
const kvBig = (k, v, right) => (
  <span className={"wpass-kv" + (right ? " wpass-kv--right" : "")}>
    <span className="wpass-k">{k}</span>
    <span className="wpass-v wpass-v--big">{v}</span>
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
          <img className="wpass-logo" src={bcfLogo} alt="BC Ferries" />
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

  /* an event ticket: one of the board's three examples, by the ref's roll */
  const n = Number(ticket.ref);
  const skin = ["concert", "cinema", "coupon"][n % 3];
  const [evTime, evDate] = [ticket.time.slice(0, 8), ticket.time.slice(9)];
  const ed = new Date(evDate.replace(/-/g, " "));
  const date = isNaN(ed) ? evDate : dayLabel(ed);
  const venue = VENUES[ticket.eventId] ?? ticket.venue;
  const seat = `${10 + (n % 20)}${"ABCDEF"[n % 6]}`;

  if (skin === "concert")
    return (
      <div className="wpass wpass--event wpass--concert">
        <div className="wpass-evtop">
          <img className="wpass-evlogo" src={starLogo} alt="STAR" />
          <span className="wpass-toprow">
            {kv("DATE", date, true)}
            {kv("TIME", evTime, true)}
          </span>
        </div>
        <img className="wpass-strip" src={stripConcert} alt="" />
        <div className="wpass-evbody">
          <div className="wpass-fields wpass-fields--one">{kvBig("EVENT", ticket.name)}</div>
          <div className="wpass-fields">
            {kv("LOCATION", venue)}
            {kv("CHECK-IN", evTime)}
            {kv("SECTION", String(1 + (n % 6)))}
            {kv("SEAT", seat, true)}
          </div>
        </div>
        <div className="wpass-code-panel">
          <BarsArt seed={ticket.ref} />
        </div>
        <img className="wpass-appicon" src={passIcon} alt="" />
      </div>
    );

  if (skin === "cinema")
    return (
      <div className="wpass wpass--event wpass--cinema">
        <div className="wpass-evtop">
          <img className="wpass-evlogo" src={starLogo} alt="STAR" />
          <span className="wpass-toprow">{kv("TIME", evTime, true)}</span>
        </div>
        <img className="wpass-strip" src={stripCinema} alt="" />
        <div className="wpass-evbody">
          <div className="wpass-fields">
            {kvBig("EVENT", ticket.name)}
            {kvBig("DATE", date, true)}
          </div>
          <div className="wpass-fields">
            {kv("VENUE", venue)}
            {kv("GATE", String(1 + (n % 8)))}
            {kv("SEAT", seat)}
            {kv("TYPE", "GA", true)}
          </div>
        </div>
        <img className="wpass-appicon" src={passIcon} alt="" />
        <img className="wpass-nfc" src={contactlessIcon} alt="" width="20" height="20" />
      </div>
    );

  return (
    <div className="wpass wpass--event wpass--coupon">
      <div className="wpass-evtop">
        <img className="wpass-evlogo" src={triangleLogo} alt="TRIANGLE" />
        <span className="wpass-toprow">{kv("EXPIRE", date, true)}</span>
      </div>
      <img className="wpass-strip wpass-strip--tall" src={stripCoupon} alt="" />
      <div className="wpass-evbody">
        <div className="wpass-fields">
          {kvBig("PASS", ticket.name)}
          {kvBig("VALID", "All zones", true)}
        </div>
        <div className="wpass-fields wpass-fields--one">
          {kv("NOTE", "Please show before entry")}
        </div>
      </div>
      <div className="wpass-code-panel">
        <BarsArt seed={ticket.ref} />
        <span className="wpass-ref tnum">{ticket.ref}</span>
      </div>
      <img className="wpass-appicon" src={passIcon} alt="" />
    </div>
  );
}
