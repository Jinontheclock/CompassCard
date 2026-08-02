/* The 46px row under the status bar: an optional back control on the left,
   an optional account button on the right. */
export default function NavHeader({ onBack, account, onAccount, title }) {
  return (
    <div className="nav-header">
      {onBack ? (
        <button type="button" className="nav-back" onClick={onBack}>
          <svg width="11" height="18" viewBox="0 0 11 18" aria-hidden="true">
            <path d="M9.5 1.5 2 9l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      ) : (
        <span />
      )}
      {title && <span className="nav-title">{title}</span>}
      {account ? (
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="9" cy="5.6" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M2.8 16a6.2 6.2 0 0 1 12.4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
