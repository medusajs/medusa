import React from "react"
import { useAdminProductTagUsage } from "medusa-react"

const ProductTags = (productId: string) => {
  const { tags, isLoading } = useAdminProductTagUsage()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {tags && !tags.length && <span>No Product Tags</span>}
      {tags && tags.length > 0 && (
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>{tag.value} - {tag.usage_count}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductTags
