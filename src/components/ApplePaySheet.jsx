import { useEffect, useState } from "react";
import { money } from "../data/seed.js";

/* the Apple mark itself, drawn in whatever ink the text around it carries */
const AppleMark = () => (
  <svg className="apay-apple" viewBox="0 0 384 512" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
  </svg>
);

/* The Apple Pay sheet, drawn Apple's way rather than the app's — like the
   Wallet screens, this surface keeps Apple's own language: the system font,
   the white card rising from the bottom, hairline rows, the black Pay
   button. Three beats: asking, paying, paid — then it hands the flow back.
   Cancelling is only offered while it is still asking; once payment is
   moving, the sheet finishes what it started. */
export default function ApplePaySheet({ amount, label, onDone, onCancel }) {
  const [phase, setPhase] = useState("asking");

  useEffect(() => {
    if (phase === "paying") {
      const t = setTimeout(() => setPhase("paid"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "paid") {
      const t = setTimeout(onDone, 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, onDone]);

  return (
    <div className="apay" role="dialog" aria-label="Apple Pay">
      <button
        type="button"
        className="apay-backdrop"
        aria-label="Cancel payment"
        onClick={phase === "asking" ? onCancel : undefined}
      />
      <div className="apay-sheet">
        <div className="apay-head">
          <span className="apay-mark">
            <AppleMark />
            Pay
          </span>
          {phase === "asking" && (
            <button type="button" className="apay-close" aria-label="Cancel" onClick={onCancel}>
              ×
            </button>
          )}
        </div>

        <div className="apay-rows">
          <div className="apay-row">
            <span className="apay-row-label">Payment</span>
            <span className="apay-row-value">Apple Pay</span>
          </div>
          <div className="apay-rule" />
          <div className="apay-row">
            <span className="apay-row-label">{label}</span>
            <span className="apay-row-value apay-tnum">{money(amount)}</span>
          </div>
          <div className="apay-rule" />
          <div className="apay-row">
            <span className="apay-row-label apay-row-label--total">Pay Compass</span>
            <span className="apay-total apay-tnum">{money(amount)}</span>
          </div>
        </div>

        {phase === "asking" && (
          <button type="button" className="apay-pay" onClick={() => setPhase("paying")}>
            <AppleMark />
            Pay
          </button>
        )}
        {phase === "paying" && (
          <div className="apay-status">
            <span className="apay-spinner" aria-hidden="true" />
            Processing
          </div>
        )}
        {phase === "paid" && (
          <div className="apay-status apay-status--paid">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d="M4 11.5L9 16.5L18 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Done
          </div>
        )}
      </div>
    </div>
  );
}
