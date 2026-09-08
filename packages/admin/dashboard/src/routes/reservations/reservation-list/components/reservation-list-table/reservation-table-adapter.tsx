import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ReservationActions } from "./reservation-actions"

export function createReservationTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminReservation> {
  return createTableAdapter<HttpTypes.AdminReservation>({
    entity: "reservation-items",
    queryPrefix: "res",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { reservations, count, isError, error, isLoading } =
        useReservationItems({ fields, ...params })
      return { data: reservations, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/reservations/${row.id}`,
    renderRowActions: (row) => <ReservationActions reservation={row as any} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "inventory_item.id",
        "reservation_location_filter",
        "created_by",
        "description",
        "quantity",
      ]
      return columns.map((column) => ({
        ...column,
        filter: !ALLOWED_FILTERS.includes(column.field)
          ? { ...column.filter, enabled: false }
          : column.filter,
      }))
    },
  })
}

// eslint-disable-next-line max-len
export function useReservationTableAdapter(): TableAdapter<HttpTypes.AdminReservation> {
  const { t } = useTranslation()
  return useMemo(() => createReservationTableAdapter({ t }), [t])
}
