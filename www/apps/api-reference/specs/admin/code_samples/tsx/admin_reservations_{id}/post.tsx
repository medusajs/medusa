import React from "react"
import { useAdminUpdateReservation } from "medusa-react"

type Props = {
  reservationId: string
}

const Reservation = ({ reservationId }: Props) => {
  const updateReservation = useAdminUpdateReservation(
    reservationId
  )
  // ...

  const handleUpdate = (
    quantity: number
  ) => {
    updateReservation.mutate({
      quantity,
    })
  }

  // ...
}

export default Reservation
