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
          <div key={uuidv4()}>
            <span className="bold">Description:</span> <span>{product.description}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Price:</span> <span>{product.price}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Compare at price:</span> <span>{product.compareAtPrice}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Product type:</span> <span>{product.productType}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Options:</span> <span>{options}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Tags:</span> <span>{product.tags.join(', ')}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Vendor:</span> <span>{product.vendor}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Requires shipping:</span> <span>{product.requiresShipping.toString()}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Weight:</span> <span>{product.weight}</span>
          </div>
          <div key={uuidv4()}>
            <span className="bold">Weight unit:</span> <span>{product.weightUnit}</span>
          </div>
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
