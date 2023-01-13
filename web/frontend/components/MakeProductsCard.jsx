import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import TextField from "./Fields/TextField";
import NumberField from "./Fields/NumberField";
import CheckboxField from "./Fields/CheckboxField";
import NewProducts from "./NewProducts";
import formatProductData from "../helpers/format-product-data";
import gptProductObject from "../helpers/gptProductObject";


export default function MakeProductsCard() {
  const fetch = useAuthenticatedFetch();
  const [ category, setCategory ] = useState('clothing');
  const [ productCount, setProductCount ] = useState(5);
  const [ tagCount, setTagCount ] = useState(2);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ newProducts, setNewProducts ] = useState([]);
  const [ gptResponse, setGptResponse ] = useState({});

  useEffect(() => {
    if (Object.keys(gptResponse).length !== 0) {
      formatProductData((gptResponse.products));
    }
  },[gptResponse])

  async function handleSubmit() {
    setIsLoading(true);

    // setGptResponse(gptProductObject);
    // setIsLoading(false);

    // GPT request
    const response = await fetch(`/api/openai/gpt/${category}/${productCount}/${tagCount}`);
    const json = await response.json();

    if (Object.hasOwn(json, 'choices')) {
      setGptResponse(JSON.parse(json.choices[0].text));
      setIsLoading(false);
    } else {
      console.log('Encountered error');
      console.log(json);
      setIsLoading(false);
    }
    


    // Shopify create products request
    // try {
    //   const productData = formatProductData({});

    //   const response = await fetch(`/api/products/create/${productData}`);
    //   const data = await response.json();
      
    //   data.forEach(() => {
    //     setNewProducts(data);
    //   })
    // } catch (error) {
    //   console.log(error);
    // }

    //   setIsLoading(false);
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return (
    <div className="makeProductsCard card">
      <h1>Make some products</h1>

      <TextField 
        label='Category'
        name='category'
        value={category}
        onChange={setCategory}
      />

      <NumberField 
        label='Product Count'
        name='ProductCount'
        value={productCount}
        onChange={setProductCount}
        min="1"
        max="100"
      />

      <NumberField 
        label='Tag Count'
        name='tagCount'
        value={tagCount}
        onChange={setTagCount}
        min="1"
        max="100"
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
      >
        { isLoading ? 'Loading...' : 'Submit' }
      </button>

      <button
        onClick={() => setIsLoading(false)}
      >
        Reset
      </button>

      <NewProducts productList={newProducts} />
    </div>
  )
}