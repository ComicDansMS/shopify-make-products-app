import randomSelect from "./random-select";
import stripFormatting from "./strip-formatting";
import toArray from "./to-array";

export default function formatProductData(productData) {

  // Remove new lines and digits from list items
  const titlesStripped = stripFormatting(productData.titles);
  const tagsStripped = stripFormatting(productData.tags);

  // Convert string to array
  const titlesArray = toArray(titlesStripped);
  const tagsArray = toArray(tagsStripped);

  // usedTags is used for randomSelect() to ensure all tags are used
  const usedTags = [];

  // String that will be sent as parameters to API route
  const dataString = [];
  
  titlesArray.forEach(title => {
    dataString.push(JSON.stringify({
      title: title,
      tag: randomSelect(tagsArray, usedTags)
    }))
  })

  // Convert array to string to be sent as parameters in the API request
  return dataString.toString();
}