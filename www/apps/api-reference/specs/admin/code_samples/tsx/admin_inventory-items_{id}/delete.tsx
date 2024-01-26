import React from "react"
import { useAdminDeleteInventoryItem } from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const deleteInventoryItem = useAdminDeleteInventoryItem(
    inventoryItemId
  )
  // ...

  const handleDelete = () => {
    deleteInventoryItem.mutate()
  }

  // ...
}

export default InventoryItem
