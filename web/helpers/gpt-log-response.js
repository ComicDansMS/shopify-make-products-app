export default function gptLogResponse(completion) {
  try {
    const responseJson = JSON.parse(completion.data.choices[0].text);
    const tokenPrice = 0.02 / 1000;

    const logData = {
      "Finish reason": completion.data.choices[0].finish_reason,
      "Returned products": responseJson.products.length,
      "Prompt tokens": completion.data.usage.prompt_tokens,
      "Completion tokens": completion.data.usage.completion_tokens,
      "Total tokens": completion.data.usage.total_tokens,
      "Tokens per product": `${Math.round(completion.data.usage.total_tokens - completion.data.usage.prompt_tokens) / responseJson.products.length}`,
      "Total cost": `\$${(completion.data.usage.total_tokens * tokenPrice).toFixed(4)}`,
    }

    console.log('=======================');
    console.log('== Response received ==');
    console.log('=======================');
    for (const [key, value] of Object.entries(logData)) {
      console.log(`${key}: ${value}`)
    }

  } catch {
    console.log('=======================');
    console.log(`== Response received ==
  Bad response - Unable to process data.
  Finish Reason - ${completion.data.choices[0].finish_reason}
  Completion.data.choices[0] - ${JSON.parse(completion.data.choices[0])}
  `);
  console.log('=======================');
  }
}