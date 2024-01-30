import React from "react"
import { useAdminCreateVariant } from "medusa-react"

type CreateVariantData = {
  title: string
  prices: {
    amount: number
    currency_code: string
  }[]
  options: {
    option_id: string
    value: string
  }[]
}

type Props = {
  productId: string
}

const CreateProductVariant = ({ productId }: Props) => {
  const createVariant = useAdminCreateVariant(
    productId
  )
  // ...

  const handleCreate = (
    variantData: CreateVariantData
  ) => {
    createVariant.mutate(variantData, {
      onSuccess: ({ product }) => {
        console.log(product.variants)
      }
    })
  }

  // ...
}

export default CreateProductVariant
