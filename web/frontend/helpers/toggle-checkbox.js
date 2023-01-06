export default function toggleCheckbox(state, setState) {
  state ? setState(false) : setState(true)
}