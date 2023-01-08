export default function quantityGenerator() {
  const randomInt = Math.random();

  if (randomInt < 0.2) {
    return 0;
  } else {
    return Math.floor(Math.random() * (25) + 1)
  }
}