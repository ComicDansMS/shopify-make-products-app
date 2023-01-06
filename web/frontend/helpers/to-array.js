export default function toArray(input) {
  const trimmedArray = input.split(',').map(value => {
    return value.trim()
  })

  return trimmedArray;
}