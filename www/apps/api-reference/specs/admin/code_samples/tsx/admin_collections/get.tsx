import React from "react"
import { useAdminCollections } from "medusa-react"

const Collections = () => {
  const { collections, isLoading } = useAdminCollections()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {collections && !collections.length && <span>
        No Product Collections
      </span>}
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

export default Collections
