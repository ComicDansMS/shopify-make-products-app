import { v4 as uuidv4 } from 'uuid';

export default function ProductList(props) {
  const products = props.productList;

  if (products === undefined || props.productList.length === 0) {
    return <></>;
  }

  const listItems = products.map(product => {
    const options = product.options.map(option => {
      return <p key={uuidv4()} className="product-list__option">{option.name}: {option.values.join(', ')}</p>;
    })

    return (
      <li key={uuidv4()} className="product-list__product">
        <h3>{product.title}</h3>
        <div className='product-list__attributes'>
          <p key={uuidv4()}><span className="bold">Description:</span> {product.description}</p>
          <p key={uuidv4()}><span className="bold">Price:</span> {product.price}</p>
          <p key={uuidv4()}><span className="bold">Compare at price:</span> {product.compareAtPrice}</p>
          <p key={uuidv4()}><span className="bold">Product type:</span> {product.productType}</p>
          <p key={uuidv4()}><span className="bold">Options:</span> {options}</p>
          <p key={uuidv4()}><span className="bold">Tags:</span> {product.tags.join(', ')}</p>
          <p key={uuidv4()}><span className="bold">Vendor:</span> {product.vendor}</p>
          <p key={uuidv4()}><span className="bold">Requires shipping:</span> {product.requiresShipping.toString()}</p>
          <p key={uuidv4()}><span className="bold">Weight:</span> {product.weight}</p>
          <p key={uuidv4()}><span className="bold">Weight unit:</span> {product.weightUnit}</p>
        </div>
      </li>
    )
  });

  if (products.length) {
    return (
      <>
        <h2>{products.length} products generated</h2>
        <ul className="product-list">{listItems}</ul>
      </>
    )
  } else {
    return <></>
  }

}
