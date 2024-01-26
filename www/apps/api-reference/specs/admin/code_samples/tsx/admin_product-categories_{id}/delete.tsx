import React from "react"
import { useAdminDeleteProductCategory } from "medusa-react"

type Props = {
  productCategoryId: string
}

const Category = ({
  productCategoryId
}: Props) => {
  const deleteCategory = useAdminDeleteProductCategory(
    productCategoryId
  )
  // ...

  const handleDelete = () => {
    deleteCategory.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Category
