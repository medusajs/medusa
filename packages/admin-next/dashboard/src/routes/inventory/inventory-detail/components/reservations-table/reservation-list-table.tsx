import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"

import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import {
  ExtendedReservationItem,
  useReservationTableColumn,
} from "./use-reservation-list-table-columns"
import { useReservationsTableQuery } from "./use-reservation-list-table-query"
import { useStockLocations } from "../../../../../hooks/api"

const PAGE_SIZE = 20

export const ReservationItemTable = ({
  inventoryItem,
}: {
  inventoryItem: HttpTypes.AdminInventoryItemResponse["inventory_item"]
}) => {
  const { searchParams, raw } = useReservationsTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { reservations, count, isPending, isError, error } =
    useReservationItems({
      ...searchParams,
      inventory_item_id: [inventoryItem.id],
    })

  const { stock_locations } = useStockLocations({
    id: (reservations || []).map((r) => r.location_id),
  })

  const data = useMemo<ExtendedReservationItem[]>(() => {
    const locationMap = new Map((stock_locations || []).map((l) => [l.id, l]))

    return (reservations || []).map((r) => ({
      ...r,
      location: locationMap.get(r.location_id),
    }))
  }, [reservations, stock_locations])

  const columns = useReservationTableColumn({ sku: inventoryItem.sku! })

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row: ExtendedReservationItem) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      pageSize={PAGE_SIZE}
      count={count}
      isLoading={isPending}
      pagination
      queryObject={raw}
    />
  )
}
