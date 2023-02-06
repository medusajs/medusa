import { useAdminProducts } from "medusa-react"

const ProductsRoute = () => {
  const { products } = useAdminProducts()
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products?.map((product) => {
          return <li key={product.id}>{product.title}</li>
        })}
      </ul>
    </div>
  )
}

export default ProductsRoute
