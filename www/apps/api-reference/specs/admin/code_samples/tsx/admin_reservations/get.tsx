import React from "react"
import { useAdminReservations } from "medusa-react"

const Reservations = () => {
  const { reservations, isLoading } = useAdminReservations()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {reservations && !reservations.length && (
        <span>No Reservations</span>
      )}
      {reservations && reservations.length > 0 && (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>{reservation.quantity}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Reservations
