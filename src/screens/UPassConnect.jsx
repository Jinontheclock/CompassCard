import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import chevron from "../assets/icon-chevron.svg";
import checkIcon from "../assets/icon-check-sm.svg";

/* Connecting the U-Pass for the first time. The school is picked and the
   student number typed; the two lines under them are the point of the whole
   screen, which is that neither a card number nor a monthly deadline comes
   into it. */
export default function UPassConnect({ card, upass, studentId, onStudentId, onBack, onConnect }) {
  return (
    <div className="scr">
      <StatusBar />
      {/* named for the card it is being connected to, as the rest are */}
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">Connect U-Pass BC</h1>
        <p className="scr-sub">Connect once. It renews every month while you are enrolled.</p>

        <div className="connect-stack">
          <div className="pick-group">
            <span className="pick-label">School</span>
            {/* there is no school list in the frames, so the row states the
                one the account is enrolled at rather than opening a picker */}
            <div className="pick-box">
              <span className="pick-value">{upass.schoolName}</span>
              <img className="pick-chevron" src={chevron} alt="" width="8" height="14" />
            </div>
          </div>

          <div className="pick-group">
            <span className="pick-label">Student ID</span>
            <div className="pick-box">
              <input
                className="pick-input"
                type="text"
                inputMode="numeric"
                placeholder="Your student number"
                value={studentId}
                onChange={(e) => onStudentId?.(e.target.value)}
              />
            </div>
          </div>

          <div className="panel panel--flat">
            <div className="settings-row settings-row--value connect-point">
              <img src={checkIcon} alt="" width="18" height="18" />
              <span className="settings-label">No 20-digit number to enter</span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--value connect-point">
              <img src={checkIcon} alt="" width="18" height="18" />
              <span className="settings-label">No monthly window to catch</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scr-footer scr-footer--connect">
        <Button onClick={onConnect}>Connect</Button>
        <p className="scr-footnote">Eligibility is confirmed with your school.</p>
      </div>

      <HomeIndicator />
    </div>
  );
}
