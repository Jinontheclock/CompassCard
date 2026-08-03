import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";

/* The way back into a forgotten account. One field, one button; the email
   arrives already holding whatever was typed on the login screen, since
   that is the address being reset. Sending turns the screen into its own
   receipt — the note says where the link went, and the button stays sent. */
export default function Forgot({ email: initial, onBack, onSent }) {
  const [email, setEmail] = useState(initial);
  const [sent, setSent] = useState(false);

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Log In" />

      <div className="scr-body">
        <h1 className="scr-title">Forgot Password</h1>
        <p className="scr-sub">We&rsquo;ll email you a link to set a new one.</p>

        <div className="stack-fields">
          <Field
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={setEmail}
          />
        </div>

        {sent && (
          <NotePanel tone="success">
            A reset link is on its way{email ? ` to ${email}` : ""}. It works for the next hour.
          </NotePanel>
        )}
      </div>

      <div className="scr-footer">
        <Button disabled={sent} onClick={() => setSent(true)}>
          {sent ? "Link Sent" : "Send Reset Link"}
        </Button>
        <p className="scr-footnote">
          Remembered it?{" "}
          <button type="button" className="linkish" onClick={onSent}>
            Log in
          </button>
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
