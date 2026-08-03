import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import NavHeader from "../components/NavHeader.jsx";

/* One Account row, opened. The frames draw the rows but not what a row
   opens, so this screen is built from the app's own parts — the nav row,
   the title, a field and the button — and serves every row the same way:
   whichever label it is handed, one field, Save, back.

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
  const [draft, setDraft] = useState(value);

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Account" />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">{spec.title}</h1>

        <div className="stack-fields">
          <Field
            label={spec.title}
            type={spec.type}
            inputMode={spec.inputMode}
            placeholder={spec.placeholder}
            value={draft}
            onChange={setDraft}
          />
        </div>
      </div>

      <div className="scr-footer">
        <Button onClick={() => onSave?.(draft)}>Save</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
