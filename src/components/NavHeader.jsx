/* The 46px row under the status bar: an optional back control on the left,
   an optional account button on the right. */
export default function NavHeader({ onBack, account, onAccount, title }) {
  return (
    <div className="nav-header">
      {onBack ? (
        <button type="button" className="nav-back" onClick={onBack}>
          <svg width="9" height="16" viewBox="0 0 9 16" aria-hidden="true">
            <path d="M8 1 1.5 8 8 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      ) : (
        <span />
      )}
      {title && <span className="nav-title">{title}</span>}
      {account ? (
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M2.5 14a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
