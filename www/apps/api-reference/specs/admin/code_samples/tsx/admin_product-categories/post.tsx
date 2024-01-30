import React from "react"
import { useAdminCreateProductCategory } from "medusa-react"

const CreateCategory = () => {
  const createCategory = useAdminCreateProductCategory()
  // ...

  const handleCreate = (
    name: string
  ) => {
    createCategory.mutate({
      name,
    }, {
      onSuccess: ({ product_category }) => {
        console.log(product_category.id)
      }
    })
  }

  // ...
}

export default CreateCategory
