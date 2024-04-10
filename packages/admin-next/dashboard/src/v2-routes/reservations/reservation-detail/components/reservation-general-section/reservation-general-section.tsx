import { Container } from "@medusajs/ui"
import { ExtendedReservationItem } from "@medusajs/medusa"
import { useAdminInventoryItem } from "medusa-react"
import { useReservation } from "../../../../../hooks/api/reservations"
import { useStockLocation } from "../../../../../hooks/api/stock-locations"

type ReservationGeneralSectionProps = {
  reservation: ExtendedReservationItem
}

// TODO: Its not possible to get the data necessary for this component with the current API

export const ReservationGeneralSection = ({
  reservation,
}: ReservationGeneralSectionProps) => {
  // const { reservation, isLoading, isError, error } = useReservation(
  //   reservation.id
  // )

  // if (isLoading || !inventory_item) {
  //   return <div>Loading...</div>
  // }

  // if (isError) {
  //   throw error
  // }

  return <Container className="divide-y p-0"></Container>
}
