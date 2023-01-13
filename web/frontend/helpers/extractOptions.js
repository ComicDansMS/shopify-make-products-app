export default function extractOptions(productOptions) {

  const optionsArray = [];

  productOptions.forEach(option => {
    optionsArray.push(option.name)
  })

  return optionsArray;
}