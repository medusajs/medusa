import { ExtendedReservationItem } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import { useAdminInventoryItem } from "medusa-react"

type ReservationGeneralSectionProps = {
  reservation: ExtendedReservationItem
}

// TODO: Its not possible to get the data necessary for this component with the current API

export const ReservationGeneralSection = ({
  reservation,
}: ReservationGeneralSectionProps) => {
  const { inventory_item, isLoading, isError, error } = useAdminInventoryItem(
    reservation.inventory_item_id
  )

  if (isLoading || !inventory_item) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return <Container className="divide-y p-0"></Container>
}
