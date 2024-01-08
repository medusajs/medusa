import React from "react"
import { useAdminDeleteVariant } from "medusa-react"

type Props = {
  productId: string
  variantId: string
}

const ProductVariant = ({
  productId,
  variantId
}: Props) => {
  const deleteVariant = useAdminDeleteVariant(
    productId
  )
  // ...

  const handleDelete = () => {
    deleteVariant.mutate(variantId, {
      onSuccess: ({ variant_id, object, deleted, product }) => {
        console.log(product.variants)
      }
    })
  }

  // ...
}

export default ProductVariant
