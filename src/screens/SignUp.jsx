import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";

/* The demo stays permissive — empty fields walk straight through, so the
   flow can be toured without typing — but what IS typed has to hold
   together: an email needs its @, and the two passwords have to agree.
   The complaint appears under the field it is about, and only after the
   button has been asked. */
const complain = (values) => {
  const errors = {};
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "That doesn't look like an email address.";
  }
  if (values.confirm && values.confirm !== values.password) {
    errors.confirm = "These passwords don't match.";
  }
  return errors;
};

export default function SignUp({ values, onChange, onBack, backLabel, onNext, onLogin }) {
  const [errors, setErrors] = useState({});

  const submit = () => {
    const found = complain(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onNext?.();
  };

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} account />

      <div className="scr-body">
        <h1 className="scr-title">Sign Up</h1>
        <p className="scr-sub">One account for your cards, passes and history.</p>

        <div className="stack-fields">
          <Field
            label="Email"
            type="email"
            placeholder="name@email.com"
            value={values.email}
            error={errors.email}
            onChange={(v) => onChange("email", v)}
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={(v) => onChange("password", v)}
          />
          <Field
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={values.confirm}
            error={errors.confirm}
            onChange={(v) => onChange("confirm", v)}
          />
        </div>

        <NotePanel>Next: register your Compass Card — or start without one.</NotePanel>
      </div>

      <div className="scr-footer">
        <Button onClick={submit}>Create Account</Button>
        <p className="scr-footnote">
          Already have an account?{" "}
          <button type="button" className="linkish" onClick={onLogin}>
            Login
          </button>
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
