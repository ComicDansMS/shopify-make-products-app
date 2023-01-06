export default function CheckboxField(props) {
  const {
    label,
    name,
    onChange,
  } = props;

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        type="checkbox"
        name={name}
        onChange={onChange}
      />
    </div>
  )
}
