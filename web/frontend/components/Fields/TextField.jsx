export default function TextField(props) {
  const {
    label,
    name,
    value,
    onChange,
  } = props;

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
