/* A labelled input. The demo never demands a value — empty is accepted so
   the flow can be toured — but a field handed an `error` says so beneath
   itself, in the warning ink, and wears it on its border until asked again. */
export default function Field({ label, type = "text", placeholder, value, error, onChange, inputMode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className={"field-input" + (error ? " field-input--error" : "")}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
