import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";

export default function SignUp({ onBack, onNext, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} account />

      <div className="scr-body">
        <h1 className="scr-title">Sign Up</h1>
        <p className="scr-sub">One account for your cards, passes and history.</p>

        <div className="stack-24">
          <Field label="Email" type="email" placeholder="name@email.com" value={email} onChange={setEmail} />
          <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
          <Field
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={setConfirm}
          />
        </div>

        <NotePanel>Next: register your Compass Card — or start without one.</NotePanel>
      </div>

      <div className="scr-footer">
        <Button onClick={onNext}>Create Account</Button>
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
