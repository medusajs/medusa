import React from "react"
import { useAdminCreateInventoryItem } from "medusa-react"

const CreateInventoryItem = () => {
  const createInventoryItem = useAdminCreateInventoryItem()
  // ...

  const handleCreate = (variantId: string) => {
    createInventoryItem.mutate({
      variant_id: variantId,
    }, {
      onSuccess: ({ inventory_item }) => {
        console.log(inventory_item.id)
      }
    })
  }

  // ...
}

export default CreateInventoryItem
