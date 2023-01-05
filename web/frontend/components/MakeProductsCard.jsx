import { useState } from "react"

export default function MakeProductsCard() {
  const [ productTitles, setProductTitles ] = useState('');
  const [ productTags, setProductTags ] = useState('');

  function toArray(input) {
    const trimmedArray = input.split(',').map(value => {
      return value.trim()
    })

    return trimmedArray;
  }

  function handleSubmit() {
    const productData = {};
    
    productData.titles = toArray(productTitles);
    productData.tags = toArray(productTags);
  }

  return (
    <div className="makeProductsCard card">
      <h1>Make some products</h1>

      <div className="field">
        <label htmlFor="productTitles">Product Titles</label>
        <input
          type="text"
          name="productTitles"
          value={productTitles}
          onChange={e => setProductTitles(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="productTags">Product Tags</label>
        <input
          type="text"
          name="productTags"
          value={productTags}
          onChange={e => setProductTags(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}