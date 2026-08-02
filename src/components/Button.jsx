/* The one button in the kit. `tone` picks the surface it sits on:
   primary   — solid Compass blue on a light screen
   onDark    — filled pale blue on the dark onboarding screens
   outline   — hairline only, for the second choice on a dark screen
   Every button is 50px tall, which clears the 44px touch minimum. */
export default function Button({ tone = "primary", onClick, children }) {
  return (
    <button type="button" className={"btn btn--" + tone} onClick={onClick}>
      {children}
    </button>
  );
}
