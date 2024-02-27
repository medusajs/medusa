import React from "react"
import { useAdminUpdateInventoryItem } from "medusa-react"

type Props = {
  inventoryItemId: string
}

const InventoryItem = ({ inventoryItemId }: Props) => {
  const updateInventoryItem = useAdminUpdateInventoryItem(
    inventoryItemId
  )
  // ...

  const handleUpdate = (origin_country: string) => {
    updateInventoryItem.mutate({
      origin_country,
    }, {
      onSuccess: ({ inventory_item }) => {
        console.log(inventory_item.origin_country)
      }
    })
  }

  // ...
}

export default InventoryItem
