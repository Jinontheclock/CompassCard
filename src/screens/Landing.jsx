import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import compassMark from "../assets/compass-mark.svg";
import cardArt from "../assets/compass-card.png";

/* The Figma frame leaves these two buttons at their component default, so
   the wording is set here: log in on top, sign up beneath it. */
const PRIMARY_LABEL = "Login";
const SECONDARY_LABEL = "Sign Up";

export default function Landing({ onSignUp, onLogin }) {
  return (
    <div className="scr scr--dark">
      <StatusBar light />

      <div className="landing-body">
        <img className="landing-mark" src={compassMark} alt="" width="56" height="56" />

        <h1 className="landing-title">Compass</h1>
        <p className="landing-sub">One app to ride both systems — pay, manage, check, ask.</p>
        <p className="landing-note">TransLink + BC Ferries walk-on</p>

        <img className="landing-card" src={cardArt} alt="" width="274" height="172" />
      </div>

      <div className="landing-actions">
        <Button tone="onDark" onClick={onLogin}>
          {PRIMARY_LABEL}
        </Button>
        <Button tone="outline" onClick={onSignUp}>
          {SECONDARY_LABEL}
        </Button>
      </div>

      <HomeIndicator light />
    </div>
  );
}
