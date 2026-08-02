/* The grey information panel — never a warning, just a note about what
   happens next. Carries an icon as well as its tone, so it never relies on
   colour alone. */
export default function NotePanel({ children }) {
  return (
    <div className="note-panel">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="6" r="1.1" fill="currentColor" />
        <path d="M10 9v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <p>{children}</p>
    </div>
  );
}
