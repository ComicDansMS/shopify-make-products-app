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
  const [ autoTitles, setAutoTitles] = useState(false);
  const [ productCount, setProductCount ] = useState(5);
  const [ productTitles, setProductTitles ] = useState('');
  const [ productCategory, setProductCategory ] = useState('clothing');
  const [ productTags, setProductTags ] = useState('');
  const [ autoTags, setAutoTags] = useState(false);
  const [ tagCount, setTagCount ] = useState(3);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ newProducts, setNewProducts ] = useState([]);
  const [ gptComplete, setGptComplete ] = useState(false);
  

  async function handleSubmit() {

    if (productTitles === '' && autoTitles !== true) {
      console.log('Missing titles')
      setIsLoading(false);
      return;
    }

    if (productTags === '' && autoTags !== true) {
      console.log('Missing tags')
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/openai/gpt/products/${productCategory}/${productCount}`);
      const data = await response.json();
      setProductTitles(data.choices[0].text);
    } catch (error) {
      console.log(error)
    }
  

    try {
      const response = await fetch(`/api/openai/gpt/tags/${productCategory}/${tagCount}`);
      const data = await response.json();
      setProductTags(data.choices[0].text);
      setGptComplete(true)
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch is in useEffect to avoid weird bug where no data was in product titles/tags
  useEffect(async () => {
    if (gptComplete) {
      console.log('Starting product creation')
      try {
        const productData = formatProductData({
          titles: productTitles,
          tags: productTags,
        });

        console.log('productData', productData)
  
        const response = await fetch(`/api/products/create/${productData}`);
        const data = await response.json();
        
        data.forEach(() => {
          setNewProducts(data);
          setProductTitles('');
          setProductTags('');
          setGptComplete(false);
        })
      } catch (error) {
        console.log(error);
      }
    }
  }, [gptComplete])

  return (
    <div className="makeProductsCard card">
      <h1>Make some products</h1>

      <CheckboxField
        label='Autogenerate Titles'
        name='autoTitles'
        onChange={() => toggleCheckbox(autoTitles, setAutoTitles)}
      />

      {
        autoTitles ? (
          <>
            <TextField 
              label='Category'
              name='productCategory'
              value={productCategory}
              onChange={setProductCategory}
            />

            <NumberField 
              label='Product Count'
              name='ProductCount'
              value={productCount}
              onChange={setProductCount}
              min="1"
              max="100"
            />
          </>
        ) : (
          <TextField 
            label='Product Titles - Seperated by a pipe character'
            name='productTitles'
            value={productTitles}
            onChange={setProductTitles}
          />
        )
      }

      <CheckboxField
        label='Autogenerate Tags'
        name='autoTags'
        onChange={() => toggleCheckbox(autoTags, setAutoTags)}
      />

      {
        autoTags ? (
          <>
            <NumberField 
              label='Tag Count'
              name='tagCount'
              value={tagCount}
              onChange={setTagCount}
              min="1"
              max="100"
            />
          </>
        ) : (
          <TextField 
            label='Product Tags - Seperated by a pipe character'
            name='productTags'
            value={productTags}
            onChange={setProductTags}
          />
        )
      }

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