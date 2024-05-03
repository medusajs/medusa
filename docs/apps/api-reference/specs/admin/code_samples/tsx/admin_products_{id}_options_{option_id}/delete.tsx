import React from "react"
import { useAdminDeleteProductOption } from "medusa-react"

type Props = {
  productId: string
  optionId: string
}

const ProductOption = ({
  productId,
  optionId
}: Props) => {
  const deleteOption = useAdminDeleteProductOption(
    productId
  )
  // ...

  const handleDelete = () => {
    deleteOption.mutate(optionId, {
      onSuccess: ({ option_id, object, deleted, product }) => {
        console.log(product.options)
      }
    })
  }

  // ...
}

export default ProductOption
