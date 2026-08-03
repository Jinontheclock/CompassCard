import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import Toggle from "../components/Toggle.jsx";

/* The account settings, three panels deep. The frames draw the rows with
   empty value slots — an account nothing has been written into — and each
   row opens the editor for what it names, so a saved value comes back and
   sits in the slot. Notification is the one row that is not an editor: it
   is a switch, thrown where it lies. */
export default function Account({ account, onBack, onOpen, onEdit, onNotifications, onRefund }) {
  const dots = account.password ? "•".repeat(8) : undefined;

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Account</h1>

        <div className="account-stack">
          <section className="section">
            <h2 className="section-label">ACCOUNT INFORMATION</h2>
            <div className="panel">
              <SettingsRow label="Name" value={account.name || undefined} onClick={() => onEdit?.("name")} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Mailing address" value={account.address || undefined} onClick={() => onEdit?.("address")} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Phone" value={account.phone || undefined} onClick={() => onEdit?.("phone")} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Password" value={dots} onClick={() => onEdit?.("password")} />
              <div className="panel-rule panel-rule--inset" />
              <div className="settings-row settings-row--still">
                <span className="settings-label">Notification</span>
                <Toggle on={account.notifications} label="Notification" onChange={onNotifications} />
              </div>
            </div>
          </section>

          <section className="section">
            <h2 className="section-label">PAYMENT METHOD</h2>
            <div className="panel">
              <SettingsRow label="Primary payment method" onClick={() => onOpen?.("payment")} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Auto payment method" onClick={() => onOpen?.("payment")} />
              {/* the last two panels close with a rule the first one has not */}
              <div className="panel-rule panel-rule--inset" />
            </div>
          </section>

          <section className="section">
            <h2 className="section-label">HELP</h2>
            <div className="panel">
              <SettingsRow label="Chat with us" tall onClick={() => onOpen?.("help")} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Contact info" tall onClick={() => onOpen?.("contact")} />
              <div className="panel-rule panel-rule--inset" />
            </div>
          </section>

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
