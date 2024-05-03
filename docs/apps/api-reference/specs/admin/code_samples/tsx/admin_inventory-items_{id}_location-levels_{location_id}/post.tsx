import React from "react"
import { useAdminUpdateLocationLevel } from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const updateLocationLevel = useAdminUpdateLocationLevel(
    inventoryItemId
  )
  // ...

  const handleUpdate = (
    stockLocationId: string,
    stocked_quantity: number
  ) => {
    updateLocationLevel.mutate({
      stockLocationId,
      stocked_quantity,
    }, {
      onSuccess: ({ inventory_item }) => {
        console.log(inventory_item.id)
      }
    })
  }

  // ...
}

export default InventoryItem
