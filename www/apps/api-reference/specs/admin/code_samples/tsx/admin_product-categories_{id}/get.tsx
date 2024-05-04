import React from "react"
import { useAdminProductCategory } from "medusa-react"

type Props = {
  productCategoryId: string
}

const Category = ({
  productCategoryId
}: Props) => {
  const {
    product_category,
    isLoading,
  } = useAdminProductCategory(productCategoryId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_category && (
        <span>{product_category.name}</span>
      )}

    </div>
  )
}

export default Category
