export default function NewProducts(props) {
  const products = props.productList;  

  const listItems = products.map(product =>
    <li key={product.key}>{product.title}</li>
  );

  if (products.length) {
    return (
      <>
        <h3>New Products Created</h3>
        <ul>{listItems}</ul>
      </>
    )
  } else {
    return <></>
  }

}
