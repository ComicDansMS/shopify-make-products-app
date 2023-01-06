export default function NumberField(props) {
  const {
    label,
    name,
    value,
    onChange,
    min,
    max,
  } = props;

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
      />
    </div>
  )
}
