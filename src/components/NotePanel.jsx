/* The grey information panel — never a warning, just a note about what
   happens next. Carries an icon as well as its tone, so it never relies on
   colour alone. */
export default function NotePanel({ children }) {
  return (
    <div className="note-panel">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="5.4" r="1" fill="currentColor" />
        <path d="M9 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <p>{children}</p>
    </div>
  );
}
