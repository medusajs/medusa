import React from "react"
import { useAdminPriceListProducts } from "medusa-react"

type Props = {
  priceListId: string
}

const PriceListProducts = ({
  priceListId
}: Props) => {
  const { products, isLoading } = useAdminPriceListProducts(
    priceListId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {products && !products.length && (
        <span>No Price Lists</span>
      )}
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

export default PriceListProducts
