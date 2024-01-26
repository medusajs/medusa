import React from "react"
import { useAdminProductCategories } from "medusa-react"

function Categories() {
  const {
    product_categories,
    isLoading
  } = useAdminProductCategories()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_categories && !product_categories.length && (
        <span>No Categories</span>
      )}
      {product_categories && product_categories.length > 0 && (
        <ul>
          {product_categories.map(
            (category) => (
              <li key={category.id}>{category.name}</li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default Categories
