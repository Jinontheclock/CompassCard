import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import SettingsRow from "../components/SettingsRow.jsx";

/* The account settings, three panels deep. The rows the frame draws with an
   empty value slot are label-and-chevron only, so they are listed as names
   rather than as data. */
const PANELS = [
  {
    label: "ACCOUNT INFORMATION",
    rows: [{ label: "Name" }, { label: "Mailing address" }, { label: "Phone" }, { label: "Password" }, { label: "Notification" }],
  },
  {
    label: "PAYMENT METHOD",
    rows: [{ label: "Primary payment method", to: "payment" }, { label: "Auto payment method", to: "payment" }],
  },
  {
    label: "HELP",
    rows: [{ label: "Chat with us", to: "help", tall: true }, { label: "Contact info", tall: true }],
  },
];

export default function Account({ onBack, onOpen, onRefund }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Account</h1>

        <div className="account-stack">
          {PANELS.map((panel) => (
            <section className="section" key={panel.label}>
              <h2 className="section-label">{panel.label}</h2>
              <div className="panel">
                {panel.rows.map((row, i) => (
                  <Fragment key={row.label}>
                    {i > 0 && <div className="panel-rule panel-rule--inset" />}
                    <SettingsRow
                      label={row.label}
                      tall={row.tall}
                      onClick={row.to ? () => onOpen?.(row.to) : undefined}
                    />
                  </Fragment>
                ))}
                {/* the last two panels close with a rule the first one has not */}
                {panel.label !== "ACCOUNT INFORMATION" && <div className="panel-rule panel-rule--inset" />}
              </div>
            </section>
          ))}

          <p className="account-note">You can always reach a person from the assistant.</p>
        </div>
      </div>

      <div className="account-footer">
        <Button onClick={onRefund}>Request Refund</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
