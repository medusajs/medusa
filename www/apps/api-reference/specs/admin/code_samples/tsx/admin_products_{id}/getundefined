import React from "react"
import { useAdminProduct } from "medusa-react"

type Props = {
  productId: string
}

const Product = ({ productId }: Props) => {
  const {
    product,
    isLoading,
  } = useAdminProduct(productId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product && <span>{product.title}</span>}

    </div>
  )
}

export default Product
