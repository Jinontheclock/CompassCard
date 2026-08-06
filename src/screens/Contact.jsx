import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";

/* Where a person actually is. The numbers are TransLink's own — the Compass
   line is the one printed on the back of the card — stated rather than
   linked, since the demo phone places no calls. */
export default function Contact({ onBack, backLabel }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Contact Info</h1>

        <div className="payment-stack">
          <section className="section">
            <h2 className="section-label">TRANSLINK</h2>
            <div className="panel panel--flat">
              <SettingsRow label="Compass support" value="604.398.2042" ink pad chevron={false} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Customer information" value="604.953.3333" ink pad chevron={false} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Online" value="translink.ca" ink pad chevron={false} />
            </div>
          </section>

          <NotePanel>You can always reach a person from the assistant.</NotePanel>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
