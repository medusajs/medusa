import React from "react"
import {
  useAdminInventoryItemLocationLevels,
} from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const {
    inventory_item,
    isLoading,
  } = useAdminInventoryItemLocationLevels(inventoryItemId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {inventory_item && (
        <ul>
          {inventory_item.location_levels.map((level) => (
            <span key={level.id}>{level.stocked_quantity}</span>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InventoryItem
