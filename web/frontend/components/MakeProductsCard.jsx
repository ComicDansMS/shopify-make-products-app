import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import TextField from "./Fields/TextField";
import NumberField from "./Fields/NumberField";
import ProductList from "./ProductList";

export default function MakeProductsCard() {
  const fetch = useAuthenticatedFetch();
  const [ category, setCategory ] = useState('clothing');
  const [ productCount, setProductCount ] = useState(5);
  const [ tagCount, setTagCount ] = useState(2);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ gptResponse, setGptResponse ] = useState({});

  async function handleSubmit() {
    setIsLoading(true);

    // GPT request
    try {
      const response = await fetch(`/api/openai/gpt/fetch/${category}/${productCount}/${tagCount}`)
      const data = await response.json();
  
      setIsLoading(false);
      setGptResponse(data);
      console.log(data);
    } catch (error) {
      console.log(error);
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
        onClick={() => {
          setIsLoading(false);
          setGptResponse({});
        }}
      >
        Reset
      </button>

      <ProductList productList={gptResponse.products} />
    </div>
  )
}