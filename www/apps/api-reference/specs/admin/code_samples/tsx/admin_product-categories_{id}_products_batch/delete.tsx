import React from "react"
import { useAdminDeleteProductsFromCategory } from "medusa-react"

type ProductsData = {
  id: string
}

type Props = {
  productCategoryId: string
}

const Category = ({
  productCategoryId
}: Props) => {
  const deleteProducts = useAdminDeleteProductsFromCategory(
    productCategoryId
  )
  // ...

  const handleDeleteProducts = (
    productIds: ProductsData[]
  ) => {
    deleteProducts.mutate({
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
