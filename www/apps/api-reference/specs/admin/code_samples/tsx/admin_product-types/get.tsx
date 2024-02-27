import React from "react"
import { useAdminProductTypes } from "medusa-react"

function ProductTypes() {
  const {
    product_types,
    isLoading
  } = useAdminProductTypes()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_types && !product_types.length && (
        <span>No Product Tags</span>
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

export default ProductTypes
