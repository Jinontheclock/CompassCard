import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";

/* The number as the frame shows it, part-way through being keyed in: the
   first two groups are entered, the third is the one being typed and the
   last two are still waiting. The digits and the order are the Figma
   frame's, not invented here. */
const CARD_NUMBER = [
  { digits: "0164", state: "entered" },
  { digits: "2210", state: "entered" },
  { digits: "0000", state: "active" },
  { digits: "0000", state: "waiting" },
  { digits: "0000", state: "waiting" },
];

export default function CardRegister({ onBack, onNext, onSkip }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} account />

      <div className="scr-body">
        <h1 className="scr-title">Register Your Card</h1>
        <p className="scr-sub">Only time only — after this, your card lives on your account.</p>

        <div className="stack-fields">
          <div className="reg-group">
            <span className="reg-label">Card number · 20 digits</span>
            {/* the frame draws this as a filled-in number rather than an
                open input, so it is rendered as it is drawn */}
            <div className="reg-box reg-cardno">
              {CARD_NUMBER.map((group, i) => (
                <Fragment key={i}>
                  {i > 0 && <span className="reg-sep">·</span>}
                  <span className={"reg-digits reg-digits--" + group.state}>{group.digits}</span>
                </Fragment>
              ))}
            </div>
            <span className="reg-hint">On the back of your Compass Card</span>
          </div>

          <div className="reg-group">
            <span className="reg-label">CVN · 3 digits</span>
            <div className="reg-box reg-cvn">
              <span className="reg-sep">•••</span>
            </div>
          </div>
        </div>

        <NotePanel tone="success">
          You will never type this number again — balance, passes and history follow your account.
        </NotePanel>
      </div>

      <div className="scr-footer">
        <Button onClick={onNext}>Register Card</Button>
        <p className="scr-footnote">
          <button type="button" className="linkish" onClick={onSkip}>
            Continue without a card
          </button>
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
