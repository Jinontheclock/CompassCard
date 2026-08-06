import { Fragment, useRef } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";

/* Twenty digits in five groups, the shape the frame draws. Nothing is
   validated — any digits are accepted, and an empty field still continues. */
const GROUPS = 5;
const GROUP_LEN = 4;
const CVN_LEN = 3;

const digitsOnly = (s, max) => s.replace(/\D/g, "").slice(0, max);

/* The frame shades the groups from ink through to muted as the entry runs
   out. Typed groups take the ink; the group the entry has reached takes the
   mid tone; the ones past it stay muted. */
function CardNumber({ value, onChange }) {
  const refs = useRef([]);
  const reached = value.findIndex((g) => g.length < GROUP_LEN);

  const setGroup = (i, raw) => {
    const digits = digitsOnly(raw, GROUP_LEN);
    onChange(value.map((g, j) => (j === i ? digits : g)));
    if (digits.length === GROUP_LEN && i < GROUPS - 1) refs.current[i + 1]?.focus();
  };

  const stepBack = (i) => (e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="reg-box reg-cardno">
      {value.map((group, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="reg-sep">·</span>}
          <input
            ref={(el) => (refs.current[i] = el)}
            className={"reg-digits" + (i === reached ? " reg-digits--reached" : "")}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={GROUP_LEN}
            placeholder="0000"
            aria-label={`Card number, group ${i + 1} of ${GROUPS}`}
            value={group}
            onChange={(e) => setGroup(i, e.target.value)}
            onKeyDown={stepBack(i)}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default function CardRegister({ values, onChange, onBack, backLabel, onNext, onSkip }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} account />

      <div className="scr-body">
        <h1 className="scr-title">Register Your Card</h1>
        <p className="scr-sub">One time only — after this, your card lives on your account.</p>

        <div className="stack-fields">
          <label className="reg-group">
            <span className="reg-label">Card number · 20 digits</span>
            <CardNumber value={values.number} onChange={(next) => onChange("number", next)} />
            <span className="reg-hint">On the back of your Compass Card</span>
          </label>

          <label className="reg-group">
            <span className="reg-label">CVN · 3 digits</span>
            <div className="reg-box reg-cvn">
              <input
                className="reg-digits"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={CVN_LEN}
                placeholder="•••"
                aria-label="CVN"
                value={values.cvn}
                onChange={(e) => onChange("cvn", digitsOnly(e.target.value, CVN_LEN))}
              />
            </div>
          </label>
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
