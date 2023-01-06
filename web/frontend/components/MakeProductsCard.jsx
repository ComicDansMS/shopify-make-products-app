import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import TextField from "./Fields/TextField";
import NumberField from "./Fields/NumberField";
import CheckboxField from "./Fields/CheckboxField";
import NewProducts from "./NewProducts";
import formatProductData from "../helpers/format-product-data";
import toggleCheckbox from "../helpers/toggle-checkbox";


export default function MakeProductsCard() {
  const fetch = useAuthenticatedFetch();
  const [ autoTitles, setAutoTitles] = useState(false);
  const [ productCount, setProductCount ] = useState(5);
  const [ productTitles, setProductTitles ] = useState('');
  const [ productTags, setProductTags ] = useState('');
  const [ autoTags, setAutoTags] = useState(false);
  const [ tagCount, setTagCount ] = useState(3);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ newProducts, setNewProducts ] = useState([]);

  function handleSubmit() {
    if (productTitles === '' && autoTitles !== true) {
      console.log('Missing titles')
      return;
    }

    // setIsLoading(true)

    const productData = formatProductData({
      titles: autoTitles ? 'auto' : productTitles,
      tags: autoTags ? 'auto' : productTags,
    });

    fetch(`/api/products/create/${productData}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(() => {
          setNewProducts(data)
        })
        setIsLoading(false);
        setProductTitles('');
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  }

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
          <NumberField 
            label='Product Count'
            name='ProductCount'
            value={productCount}
            onChange={setProductCount}
            min="1"
            max="100"
          />
        ) : (
          <TextField 
            label='Product Titles'
            name='CheckboxField'
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
          <NumberField 
            label='Tag Count'
            name='tagCount'
            value={tagCount}
            onChange={setTagCount}
            min="1"
            max="100"
          />
        ) : (
          <TextField 
            label='Product Tags'
            name='CheckboxField'
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