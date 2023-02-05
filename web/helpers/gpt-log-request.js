export default function gptLogRequest(parameters) {

  console.log('=====================');
  console.log('== Sending Request ==');
  console.log('=====================');
  for (const [key, value] of Object.entries(parameters)) {
    if (key !== 'prompt') {
      console.log(`${key}: ${value}`);
    }
  }

}