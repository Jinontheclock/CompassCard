import backIcon from "../assets/icon-back.svg";
import accountIcon from "../assets/icon-account.svg";

/* The 46px row under the status bar: an optional back control on the left,
   an optional account button on the right. Both glyphs are Figma exports —
   the chevron carries compass-600 and the account mark text-primary. */
export default function NavHeader({ onBack, account, onAccount, title }) {
  return (
    <div className="nav-header">
      {onBack ? (
        <button type="button" className="nav-back" onClick={onBack}>
          <img src={backIcon} alt="" width="11" height="18" />
          Back
        </button>
      ) : (
        <span />
      )}
      {title && <span className="nav-title">{title}</span>}
      {account ? (
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <img src={accountIcon} alt="" width="18" height="18" />
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
