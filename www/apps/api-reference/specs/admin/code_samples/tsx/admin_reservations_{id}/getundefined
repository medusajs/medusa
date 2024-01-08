import React from "react"
import { useAdminReservation } from "medusa-react"

type Props = {
  reservationId: string
}

const Reservation = ({ reservationId }: Props) => {
  const { reservation, isLoading } = useAdminReservation(
    reservationId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {reservation && <span>{reservation.inventory_item_id}</span>}
    </div>
  )
}

export default Reservation
