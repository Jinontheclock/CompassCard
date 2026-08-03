import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import TabBar from "../components/TabBar.jsx";
import accountIcon from "../assets/icon-account.svg";
import onTimeIcon from "../assets/icon-ontime.svg";
import emptyIcon from "../assets/icon-empty.svg";

/* The other tab. The sailings are read from the seed; the tickets half is
   empty on purpose — the frame draws the state before anything is booked. */
export default function Tickets({ sailings, onAccount, onSelectTab }) {
  return (
    <div className="scr">
      <StatusBar />

      <div className="nav-header">
        <h1 className="home-title">Tickets</h1>
        <button type="button" className="nav-account" onClick={onAccount} aria-label="Account">
          <img src={accountIcon} alt="" width="18" height="18" />
        </button>
      </div>

      <div className="scr-body">
        <section className="section">
          <h2 className="section-label">SAILING STATUS · BC FERRIES</h2>
          <div className="panel">
            {sailings.map((sailing, i) => (
              <Fragment key={i}>
                {i > 0 && <div className="panel-rule panel-rule--inset" />}
                <div className="panel-row">
                  <div className="sailing">
                    <span className="sailing-leg">{sailing.from}</span>
                    <span className="sailing-leg">{sailing.to}</span>
                    <span className="sailing-time">{sailing.time}</span>
                  </div>
                  <span className="status-ok">
                    <img src={onTimeIcon} alt="" width="17" height="17" />
                    {sailing.status}
                  </span>
                </div>
              </Fragment>
            ))}
            <div className="panel-rule" />
            <div className="panel-foot">Schedules and status only</div>
          </div>
        </section>

        <section className="section section--tickets">
          <h2 className="section-label">YOUR TICKETS</h2>
          <div className="empty-card">
            <img src={emptyIcon} alt="" width="32" height="32" />
            <p className="empty-title">No tickets yet</p>
            <p className="empty-note">
              Reservations — like bikes and reserved seating — and event tickets will show up here
              when they open.
            </p>
          </div>
        </section>
      </div>

      <TabBar active="tickets" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
