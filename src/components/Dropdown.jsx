import { Fragment, useEffect, useState } from "react";
import checkIcon from "../assets/icon-check-sm.svg";

/* The list a control opens: a menu dropped under its anchor, on the same
   surface the panels use, with the chosen row marked in the app's blue.
   The backdrop is the way out — anywhere that is not the menu closes it,
   which is how every platform's menus leave.

   `position: fixed` pins the backdrop to the phone screen rather than the
   browser window because the scaled .screen is a transformed ancestor, and
   a transform makes fixed elements measure from it. */
export default function Dropdown({ open, options, value, onPick, onClose, wide = false }) {
  /* stay mounted for the closing beat, so leaving can animate too */
  const [shown, setShown] = useState(open);
  useEffect(() => {
    if (open) setShown(true);
  }, [open]);
  if (!open && !shown) return null;
  const closing = !open && shown;

  return (
    <>
      {open && (
        <button type="button" className="menu-backdrop" aria-label="Close menu" onClick={onClose} />
      )}
      <div
        className={"menu" + (wide ? " menu--wide" : "") + (closing ? " menu--closing" : "")}
        role="listbox"
        onAnimationEnd={() => closing && setShown(false)}
      >
        {options.map((option, i) => {
          const on = option.value === value;
          return (
            <Fragment key={option.label}>
              {i > 0 && <div className="menu-rule" />}
              <button
                type="button"
                className={"menu-item" + (on ? " menu-item--on" : "")}
                role="option"
                aria-selected={on}
                onClick={() => {
                  onPick?.(option.value);
                  onClose?.();
                }}
              >
                <span className="menu-item-label">{option.label}</span>
                {on && <img src={checkIcon} alt="" width="18" height="18" />}
              </button>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
