import React from "react"
import { useCollections } from "medusa-react"

const ProductCollections = () => {
  const { collections, isLoading } = useCollections()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {collections && collections.length === 0 && (
        <span>No Product Collections</span>
      )}
      {collections && collections.length > 0 && (
        <ul>
          {collections.map((collection) => (
            <li key={collection.id}>{collection.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductCollections
