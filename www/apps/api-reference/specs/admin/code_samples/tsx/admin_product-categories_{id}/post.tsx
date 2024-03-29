import React from "react"
import { useAdminUpdateProductCategory } from "medusa-react"

type Props = {
  productCategoryId: string
}

const Category = ({
  productCategoryId
}: Props) => {
  const updateCategory = useAdminUpdateProductCategory(
    productCategoryId
  )
  // ...

  const handleUpdate = (
    name: string
  ) => {
    updateCategory.mutate({
      name,
    }, {
      onSuccess: ({ product_category }) => {
        console.log(product_category.id)
      }
    })
  }

  // ...
}

export default Category
