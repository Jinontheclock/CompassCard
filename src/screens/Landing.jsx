import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import cardArt from "../assets/compass-card.svg";

/* ⚠️ The two buttons on this frame are the only labels the Figma file leaves
   at their component default ("Reload"). The flow they open is unambiguous —
   sign up, or log in to an existing account — so they read that way here.
   Change these two strings if the design settles on different wording. */
const PRIMARY_LABEL = "Get started";
const SECONDARY_LABEL = "Log in";

export default function Landing({ onSignUp, onLogin }) {
  return (
    <div className="scr scr--dark">
      <StatusBar light />

      <div className="landing-body">
        <svg className="landing-mark" viewBox="0 0 56 56" aria-hidden="true">
          <path
            d="M20 40a17 17 0 0 1 0-24M27 34a8.5 8.5 0 0 1 0-12M34 28.5a1 1 0 1 0 0-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="landing-title">Compass</h1>
        <p className="landing-sub">One app to ride both systems — pay, manage, check, ask.</p>
        <p className="landing-note">TransLink + BC Ferries walk-on</p>

        <img className="landing-card" src={cardArt} alt="" />
      </div>

      <div className="landing-actions">
        <Button tone="onDark" onClick={onSignUp}>
          {PRIMARY_LABEL}
        </Button>
        <Button tone="outline" onClick={onLogin}>
          {SECONDARY_LABEL}
        </Button>
      </div>

      <HomeIndicator light />
    </div>
  );
}
