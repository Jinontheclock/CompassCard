import infoIcon from "../assets/icon-info.svg";

/* The grey information panel — never a warning, just a note about what
   happens next. Carries an icon as well as its tone, so it never relies on
   colour alone. The icon is the Figma export, so its compass-700 stroke is
   baked in rather than inherited. */
export default function NotePanel({ children }) {
  return (
    <div className="note-panel">
      <img src={infoIcon} alt="" width="20" height="20" />
      <p>{children}</p>
    </div>
  );
}
