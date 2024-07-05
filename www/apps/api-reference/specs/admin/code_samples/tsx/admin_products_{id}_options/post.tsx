import React from "react"
import { useAdminCreateProductOption } from "medusa-react"

type Props = {
  productId: string
}

const CreateProductOption = ({ productId }: Props) => {
  const createOption = useAdminCreateProductOption(
    productId
  )
  // ...

  const handleCreate = (
    title: string
  ) => {
    createOption.mutate({
      title
    }, {
      onSuccess: ({ product }) => {
        console.log(product.options)
      }
    })
  }

  // ...
}

export default CreateProductOption
