import { v4 as uuidv4 } from 'uuid';

export default function NewProducts(props) {
  const products = props.productList;

  const listItems = products.map(product =>
    <li key={product.id}>
      <p>
        <span className="bold">{product.title}</span> ({product.tags[0]})
      </p>
        
    </li>
  );

  if (products.length) {
    return (
      <>
        <h2>New Products Created</h2>
        <ul>{listItems}</ul>
      </>
    )
  } else {
    return <></>
  }

}
