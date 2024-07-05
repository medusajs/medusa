import React from "react"
import { useAdminUpdateProduct } from "medusa-react"

type Props = {
  productId: string
}

const Product = ({ productId }: Props) => {
  const updateProduct = useAdminUpdateProduct(
    productId
  )
  // ...

  const handleUpdate = (
    title: string
  ) => {
    updateProduct.mutate({
      title,
    }, {
      onSuccess: ({ product }) => {
        console.log(product.id)
      }
    })
  }

  // ...
}

export default Product
