import infoIcon from "../assets/icon-info.svg";
import checkIcon from "../assets/icon-check.svg";

/* The grey panel that says what happens next. `tone` picks the glyph:
   info    — a note, compass-700
   success — a reassurance, success green
   Both are Figma exports, so the colour is baked into the file rather than
   inherited. The panel always carries an icon as well as its wording, so it
   never leans on colour alone. */
const ICONS = { info: infoIcon, success: checkIcon };

export default function NotePanel({ tone = "info", children }) {
  return (
    <div className="note-panel">
      <img className={"note-icon note-icon--" + tone} src={ICONS[tone]} alt="" width="20" height="20" />
      <p>{children}</p>
    </div>
  );
}
