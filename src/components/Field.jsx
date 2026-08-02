/* A labelled input. The demo never validates — any value is accepted — but
   the field still behaves like a real one so the flow feels honest. */
export default function Field({ label, type = "text", placeholder, value, onChange, inputMode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}
