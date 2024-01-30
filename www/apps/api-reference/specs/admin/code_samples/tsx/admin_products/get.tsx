import React from "react"
import { useAdminProducts } from "medusa-react"

const Products = () => {
  const { products, isLoading } = useAdminProducts()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {products && !products.length && <span>No Products</span>}
      {products && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Products
