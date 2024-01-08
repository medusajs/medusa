import React from "react"
import { useAdminDeleteReservation } from "medusa-react"

type Props = {
  reservationId: string
}

const Reservation = ({ reservationId }: Props) => {
  const deleteReservation = useAdminDeleteReservation(
    reservationId
  )
  // ...

  const handleDelete = () => {
    deleteReservation.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Reservation
