import React from "react"
import { useProductTypes } from "medusa-react"

function Types() {
  const {
    product_types,
    isLoading,
  } = useProductTypes()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_types && !product_types.length && (
        <span>No Product Types</span>
      )}
      {product_types && product_types.length > 0 && (
        <ul>
          {product_types.map(
            (type) => (
              <li key={type.id}>{type.value}</li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default Types
