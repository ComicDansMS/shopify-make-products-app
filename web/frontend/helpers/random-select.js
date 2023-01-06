export default function randomSelect(array, usedInts) {
  let randomInt =  Math.floor(Math.random() * (array.length) + 1);
  let range = [];
  
  for (let i = 0; i < array.length; i++) {
    range.push(i + 1);
  }

  while (
    usedInts.includes(randomInt)
     && usedInts.length < array.length
  ) {
    randomInt =  Math.floor(Math.random() * (array.length) + 1);
  }

  usedInts.push(randomInt);

  return array[randomInt - 1];
}