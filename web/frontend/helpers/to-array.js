export default function toArray(input) {
  const array = input.split('|').map(value => {
    return value.trim()
  })

  return array;
}