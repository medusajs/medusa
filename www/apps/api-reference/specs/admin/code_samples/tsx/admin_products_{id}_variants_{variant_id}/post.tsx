import React from "react"
import { useAdminUpdateVariant } from "medusa-react"

type Props = {
  productId: string
  variantId: string
}

const ProductVariant = ({
  productId,
  variantId
}: Props) => {
  const updateVariant = useAdminUpdateVariant(
    productId
  )
  // ...

  const handleUpdate = (title: string) => {
    updateVariant.mutate({
      variant_id: variantId,
      title,
    }, {
      onSuccess: ({ product }) => {
        console.log(product.variants)
      }
    })
  }

  // ...
}

export default ProductVariant
