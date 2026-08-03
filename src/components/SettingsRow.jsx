import chevron from "../assets/icon-chevron.svg";

/* A row in a settings panel: a label, an optional value, and the chevron
   that says it opens something. The frames leave most value slots empty, so
   `value` is only passed where one is drawn.

   The frames draw the row at three heights, which is what the flags pick:
     — nothing, a 48 row, the one the settings lists use
     — `tall`, a 50 row
     — `pad`, a row that grows around its value, so 52 with one line
   and two value treatments: `strong` sets the value in subhead, the way a
   figure is set, and `ink` keeps it at body but in the primary ink rather
   than the secondary. */
export default function SettingsRow({
  label,
  value,
  tall = false,
  pad = false,
  strong = false,
  ink = false,
  chevron: opens = true,
  onClick,
}) {
  const row = [
    "settings-row",
    tall && "settings-row--tall",
    (pad || strong) && "settings-row--value",
  ];
  const val = [
    "settings-value",
    strong && "settings-value--strong tnum",
    ink && "settings-value--ink",
  ];

  return (
    <button type="button" className={row.filter(Boolean).join(" ")} onClick={onClick}>
      <span className="settings-label">{label}</span>
      <span className="settings-trail">
        {value && <span className={val.filter(Boolean).join(" ")}>{value}</span>}
        {opens && <img src={chevron} alt="" width="8" height="14" />}
      </span>
    </button>
  );
}
