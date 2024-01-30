import React from "react"
import { useAdminInventoryItem } from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const {
    inventory_item,
    isLoading
  } = useAdminInventoryItem(inventoryItemId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {inventory_item && (
        <span>{inventory_item.sku}</span>
      )}
    </div>
  )
}

export default InventoryItem
