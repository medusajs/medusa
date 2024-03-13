import { useAdminReservation } from "medusa-react"
import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { ReservationGeneralSection } from "./components/reservation-general-section"

export const ReservationDetail = () => {
  const { id } = useParams()

  const { reservation, isLoading, isError, error } = useAdminReservation(id!)

  if (isLoading || !reservation) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ReservationGeneralSection reservation={reservation} />
      <JsonViewSection data={reservation} />
    </div>
  )
}
