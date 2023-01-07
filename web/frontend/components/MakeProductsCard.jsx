import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import TextField from "./Fields/TextField";
import NumberField from "./Fields/NumberField";
import CheckboxField from "./Fields/CheckboxField";
import NewProducts from "./NewProducts";
import formatProductData from "../helpers/format-product-data";
import toggleCheckbox from "../helpers/toggle-checkbox";
import { useEffect } from "react";


export default function MakeProductsCard() {
  const fetch = useAuthenticatedFetch();
  const [ category, setCategory ] = useState('clothing');
  const [ productCount, setProductCount ] = useState(15);
  const [ tagCount, setTagCount ] = useState(3);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ newProducts, setNewProducts ] = useState([]);
  

  async function handleSubmit() {
    setIsLoading(true);

    if (category === '') console.log('Category is required');
    if (productCount === '') console.log('Product count is required');
    if (tagCount === '') console.log('Tag count is required')

    // GPT request
    try {
      const response = await fetch(`/api/openai/gpt/${category}/${productCount}/${tagCount}`);
      const data = await response.json();
      console.log(data.choices[0].text);
      setIsLoading(false);
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

      <NewProducts productList={newProducts} />
    </div>
  )
}