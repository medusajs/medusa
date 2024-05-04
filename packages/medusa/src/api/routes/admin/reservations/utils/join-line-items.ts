import { ExtendedReservationItem } from ".."
import { LineItemService } from "../../../../../services"

export const joinLineItems = async (
  reservations: ExtendedReservationItem[],
  lineItemService: LineItemService
): Promise<ExtendedReservationItem[]> => {
  const lineItems = await lineItemService.list(
    {
      id: reservations
        .map((r) => r.line_item_id)
        .filter((lId: string | null | undefined): lId is string => !!lId),
    },
    {
      relations: ["order"],
    }
  )

  const lineItemMap = new Map(lineItems.map((i) => [i.id, i]))

  return reservations.map((reservation) => {
    if (!reservation.line_item_id) {
      return reservation
    }

    reservation.line_item = lineItemMap.get(reservation.line_item_id)

    return reservation
  })
}
