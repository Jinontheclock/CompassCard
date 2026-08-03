/* The switch the settings rows carry. The frame draws only the on state —
   a Compass-blue track with the knob against the right edge — so off is
   drawn as its mirror: the track goes to the hairline grey and the knob
   crosses to the left. Nothing about it is coloured alone; the knob's
   position says as much as the fill does. */
export default function Toggle({ on, label, onChange }) {
  return (
    <button
      type="button"
      className={"toggle" + (on ? " toggle--on" : "")}
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange?.(!on)}
    >
      <span className="toggle-knob" />
    </button>
  );
}
