import randomSelect from "./random-select";
import toArray from "./to-array";

export default function formatProductData(productData) {
  const titles = toArray(productData.titles);
  const tags = toArray(productData.tags);
  const usedTags = [];
  const formattedData = [];

  
  titles.forEach(title => {
    // Convert JSON object to string for data to be sent to API as a string
    formattedData.push(JSON.stringify({
      title: title,
      tag: randomSelect(tags, usedTags)
    }))
  })


  // Convert array to string to be sent as parameters in the API request
  return formattedData.toString();
}