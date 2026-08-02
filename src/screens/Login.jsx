import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";

/* The one screen in the group without an account button in the nav — there
   is no account to reach yet — and the only one whose title carries no
   subtitle under it. */
export default function Login({ onBack, onNext, onSignUp, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Login</h1>

        <div className="stack-fields">
          <Field label="Email" type="email" placeholder="name@email.com" value={email} onChange={setEmail} />
          <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        </div>

        <p className="forgot">
          <button type="button" className="linkish" onClick={onForgot}>
            Forgot password?
          </button>
        </p>
      </div>

      <div className="scr-footer">
        <Button onClick={onNext}>Login</Button>
        <p className="scr-footnote">
          New to Compass?{" "}
          <button type="button" className="linkish" onClick={onSignUp}>
            Sign Up
          </button>
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
