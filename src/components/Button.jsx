/* The one button in the kit. `tone` picks the surface it sits on:
   primary   — solid Compass blue on a light screen
   onDark    — filled pale blue on the dark onboarding screens
   outline   — hairline only, for the second choice on a dark screen
   Every button is 50px tall, which clears the 44px touch minimum. A button
   whose work is done can be handed `disabled` and stays put, greyed. */
export default function Button({ tone = "primary", disabled = false, onClick, children }) {
  return (
    <button type="button" className={"btn btn--" + tone} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
