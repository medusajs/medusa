import React from "react"
import { useAdminProductTags } from "medusa-react"

function ProductTags() {
  const {
    product_tags,
    isLoading
  } = useAdminProductTags()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_tags && !product_tags.length && (
        <span>No Product Tags</span>
      )}
      {product_tags && product_tags.length > 0 && (
        <ul>
          {product_tags.map(
            (tag) => (
              <li key={tag.id}>{tag.value}</li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default ProductTags
