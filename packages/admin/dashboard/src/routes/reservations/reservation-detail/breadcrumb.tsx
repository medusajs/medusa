import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"

import { useReservationItem } from "../../../hooks/api"

type ReservationDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminReservationResponse>

export const ReservationDetailBreadcrumb = (
  props: ReservationDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { reservation } = useReservationItem(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!reservation) {
    return null
  }

  const display =
    reservation?.inventory_item?.title ??
    reservation?.inventory_item?.sku ??
    reservation.id

  return <span>{display}</span>
}
