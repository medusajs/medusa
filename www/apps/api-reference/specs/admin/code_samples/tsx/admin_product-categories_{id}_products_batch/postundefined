import React from "react"
import { useAdminAddProductsToCategory } from "medusa-react"

type ProductsData = {
  id: string
}

type Props = {
  productCategoryId: string
}

const Category = ({
  productCategoryId
}: Props) => {
  const addProducts = useAdminAddProductsToCategory(
    productCategoryId
  )
  // ...

  const handleAddProducts = (
    productIds: ProductsData[]
  ) => {
    addProducts.mutate({
      product_ids: productIds
    }, {
      onSuccess: ({ product_category }) => {
        console.log(product_category.products)
      }
    })
  }

  // ...
}

export default Category
