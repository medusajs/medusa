import React from "react"
import { useAdminCreateProduct } from "medusa-react"

type CreateProductData = {
  title: string
  is_giftcard: boolean
  discountable: boolean
  options: {
    title: string
  }[]
  variants: {
    title: string
    prices: {
      amount: number
      currency_code :string
    }[]
    options: {
      value: string
    }[]
  }[],
  collection_id: string
  categories: {
    id: string
  }[]
  type: {
    value: string
  }
  tags: {
    value: string
  }[]
}

const CreateProduct = () => {
  const createProduct = useAdminCreateProduct()
  // ...

  const handleCreate = (productData: CreateProductData) => {
    createProduct.mutate(productData, {
      onSuccess: ({ product }) => {
        console.log(product.id)
      }
    })
  }

  // ...
}

export default CreateProduct
