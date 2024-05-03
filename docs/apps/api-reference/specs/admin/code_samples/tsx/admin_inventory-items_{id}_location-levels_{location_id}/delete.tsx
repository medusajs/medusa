import React from "react"
import { useAdminDeleteLocationLevel } from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const deleteLocationLevel = useAdminDeleteLocationLevel(
    inventoryItemId
  )
  // ...

  const handleDelete = (
    locationId: string
  ) => {
    deleteLocationLevel.mutate(locationId)
  }

  // ...
}

export default InventoryItem
