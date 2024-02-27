import React from "react"
import { useAdminCreateReservation } from "medusa-react"

const CreateReservation = () => {
  const createReservation = useAdminCreateReservation()
  // ...

  const handleCreate = (
    locationId: string,
    inventoryItemId: string,
    quantity: number
  ) => {
    createReservation.mutate({
      location_id: locationId,
      inventory_item_id: inventoryItemId,
      quantity,
    }, {
      onSuccess: ({ reservation }) => {
        console.log(reservation.id)
      }
    })
  }

  // ...
}

export default CreateReservation
