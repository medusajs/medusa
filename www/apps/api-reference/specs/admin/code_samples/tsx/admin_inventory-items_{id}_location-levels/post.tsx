import React from "react"
import { useAdminCreateLocationLevel } from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const createLocationLevel = useAdminCreateLocationLevel(
    inventoryItemId
  )
  // ...

  const handleCreateLocationLevel = (
    locationId: string,
    stockedQuantity: number
  ) => {
    createLocationLevel.mutate({
      location_id: locationId,
      stocked_quantity: stockedQuantity,
    }, {
      onSuccess: ({ inventory_item }) => {
        console.log(inventory_item.id)
      }
    })
  }

  // ...
}

export default InventoryItem
