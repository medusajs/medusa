import React from "react"
import { useAdminInventoryItems } from "medusa-react"

function InventoryItems() {
  const {
    inventory_items,
    isLoading
  } = useAdminInventoryItems()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {inventory_items && !inventory_items.length && (
        <span>No Items</span>
      )}
      {inventory_items && inventory_items.length > 0 && (
        <ul>
          {inventory_items.map(
            (item) => (
              <li key={item.id}>{item.id}</li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default InventoryItems
