import { EditReservationForm } from "./components/edit-reservation-form"
import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../../components/route-modal"
import { useParams } from "react-router-dom"
import { useReservation } from "../../../../../hooks/api/reservations"
import { useTranslation } from "react-i18next"

export const ReservationEdit = () => {
  const { id } = useParams()
  // const { t } = useTranslation()

  console.log(id)
  const { reservation, isLoading, isError, error } = useReservation(id!)
  console.log(reservation)

  const ready = !isLoading && reservation
  console.log(ready)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{"t()"}</Heading>
      </RouteDrawer.Header>
      {/* {ready && <EditReservationForm reservation={reservation} />} */}
    </RouteDrawer>
  )
}
