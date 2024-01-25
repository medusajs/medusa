import React from "react"
import { useAdminUpdateProductOption } from "medusa-react"

type Props = {
  productId: string
  optionId: string
}

const ProductOption = ({
  productId,
  optionId
}: Props) => {
  const updateOption = useAdminUpdateProductOption(
    productId
  )
  // ...

  const handleUpdate = (
    title: string
  ) => {
    updateOption.mutate({
      option_id: optionId,
      title,
    }, {
      onSuccess: ({ product }) => {
        console.log(product.options)
      }
    })
  }

  // ...
}

export default ProductOption
