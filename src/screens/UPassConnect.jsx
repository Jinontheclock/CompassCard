import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Dropdown from "../components/Dropdown.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { SCHOOLS } from "../data/seed.js";
import chevron from "../assets/icon-chevron.svg";
import checkIcon from "../assets/icon-check-sm.svg";

/* Connecting the U-Pass for the first time. The school is picked from the
   participating institutions and the student number typed; the two lines
   under them are the point of the whole screen, which is that neither a
   card number nor a monthly deadline comes into it. */
export default function UPassConnect({ card, upass, studentId, onStudentId, onSchool, onBack, onConnect }) {
  const [open, setOpen] = useState(false);

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
            {/* the frame's lying-down chevron is the mark of a list opening
                downward, and this is that list */}
            <div className="menu-anchor">
              <button type="button" className="pick-box pick-box--tap" onClick={() => setOpen(!open)}>
                <span className="pick-value">{upass.schoolName}</span>
                <img className="pick-chevron" src={chevron} alt="" width="8" height="14" />
              </button>
              <Dropdown
                open={open}
                wide
                options={SCHOOLS.map((school) => ({ label: school.name, value: school }))}
                value={SCHOOLS.find((school) => school.short === upass.school)}
                onPick={onSchool}
                onClose={() => setOpen(false)}
              />
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
