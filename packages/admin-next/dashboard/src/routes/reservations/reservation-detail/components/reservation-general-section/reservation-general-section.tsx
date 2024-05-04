import { Container, Heading } from "@medusajs/ui"

import { ExtendedReservationItem } from "@medusajs/medusa"
import { useInventoryItem } from "../../../../../hooks/api/inventory"

type ReservationGeneralSectionProps = {
  reservation: ExtendedReservationItem
}

// TODO: Its not possible to get the data necessary for this component with the current API

export const ReservationGeneralSection = ({
  reservation,
}: ReservationGeneralSectionProps) => {
  const { inventory_item, isPending, isError, error } = useInventoryItem(
    reservation.inventory_item_id
  )

  if (isPending || !inventory_item) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return <Container className="divide-y p-0"></Container>
}
