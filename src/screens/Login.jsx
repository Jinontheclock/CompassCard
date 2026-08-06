import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";

/* The one screen in the group without an account button in the nav — there
   is no account to reach yet — and the only one whose title carries no
   subtitle under it. */
export default function Login({ values, onChange, onBack, backLabel, onNext, onSignUp, onForgot }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Login</h1>

        <div className="stack-fields">
          <Field
            label="Email"
            type="email"
            placeholder="name@email.com"
            value={values.email}
            onChange={(v) => onChange("email", v)}
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={(v) => onChange("password", v)}
          />
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
