import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";

/* One Account row, opened. The frames draw the rows but not what a row
   opens, so this screen is built from the app's own parts — the nav row,
   the title, a field and the button — and serves every row the same way:
   whichever label it is handed, one field, Save, back.

   The password row is the exception, because changing a password is not
   typing a value but proving one and repeating one: the current password
   first — only once there is a current password to prove — then the new
   one twice. The demo still demands nothing typed elsewhere, but here the
   proofs must agree with themselves before Save writes anything.

   What is typed lives here until Save writes it to the account; backing out
   leaves the account as it was, which is what backing out of an edit means. */
const FIELDS = {
  name: { title: "Name", placeholder: "Your name" },
  address: { title: "Mailing Address", placeholder: "Street, city, postal code" },
  phone: { title: "Phone", placeholder: "Your phone number", inputMode: "tel" },
  password: { title: "Password", placeholder: "New password", type: "password" },
};

export default function AccountEdit({ field, value, onSave, onBack }) {
  const spec = FIELDS[field] ?? FIELDS.name;
  const [draft, setDraft] = useState(field === "password" ? "" : value);
  /* the password screen's extra proofs, and what Save last found wrong */
  const [current, setCurrent] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  /* an account signed up without a password has nothing to prove */
  const hasPassword = field === "password" && value !== "";

  const save = () => {
    if (field === "password") {
      const found = {};
      if (hasPassword && current !== value) found.current = "That isn't your current password";
      if (confirm !== draft) found.confirm = "The passwords don't match";
      setErrors(found);
      if (Object.keys(found).length) return;
    }
    onSave?.(draft);
  };
  /* a field asked again is a field forgiven — typing clears its error */
  const retype = (key, set) => (v) => {
    set(v);
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Account" />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">
          {field === "password" ? "Change Password" : spec.title}
        </h1>

        <div className="stack-fields">
          {hasPassword && (
            <Field
              label="Current Password"
              type="password"
              placeholder="Your current password"
              value={current}
              error={errors.current}
              onChange={retype("current", setCurrent)}
            />
          )}
          <Field
            label={field === "password" ? "New Password" : spec.title}
            type={spec.type}
            inputMode={spec.inputMode}
            placeholder={spec.placeholder}
            value={draft}
            onChange={retype("draft", setDraft)}
          />
          {field === "password" && (
            <Field
              label="Confirm New Password"
              type="password"
              placeholder="New password, again"
              value={confirm}
              error={errors.confirm}
              onChange={retype("confirm", setConfirm)}
            />
          )}
        </div>
      </div>

      <div className="scr-footer">
        <Button onClick={save}>Save</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
