import React from "react"
import { useProductCategory } from "medusa-react"

type Props = {
  categoryId: string
}

const Category = ({ categoryId }: Props) => {
  const { product_category, isLoading } = useProductCategory(
    categoryId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_category && <span>{product_category.name}</span>}
    </div>
  )
}

export default Category
