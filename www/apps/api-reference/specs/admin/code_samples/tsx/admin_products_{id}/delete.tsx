import React from "react"
import { useAdminDeleteProduct } from "medusa-react"

type Props = {
  productId: string
}

const Product = ({ productId }: Props) => {
  const deleteProduct = useAdminDeleteProduct(
    productId
  )
  // ...

  const handleDelete = () => {
    deleteProduct.mutate(void 0, {
      onSuccess: ({ id, object, deleted}) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Product
