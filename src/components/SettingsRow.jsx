import chevron from "../assets/icon-chevron.svg";

/* A row in a settings panel: a label, an optional value, and the chevron
   that says it opens something. The frames leave most value slots empty, so
   `value` is only passed where one is drawn. */
export default function SettingsRow({ label, value, tall = false, strong = false, chevron: opens = true, onClick }) {
  return (
    <button
      type="button"
      className={"settings-row" + (tall ? " settings-row--tall" : "") + (strong ? " settings-row--value" : "")}
      onClick={onClick}
    >
      <span className="settings-label">{label}</span>
      <span className="settings-trail">
        {value && <span className={"settings-value" + (strong ? " settings-value--strong tnum" : "")}>{value}</span>}
        {opens && <img src={chevron} alt="" width="8" height="14" />}
      </span>
    </button>
  );
}
