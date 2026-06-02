import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"

import { _DataTable } from "../../../../../components/table/data-table"
import { useStockLocations } from "../../../../../hooks/api"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import { useDataTable } from "../../../../../hooks/use-data-table"
import {
  ExtendedReservationItem,
  useReservationTableColumn,
} from "./use-reservation-list-table-columns"
import { useReservationsTableQuery } from "./use-reservation-list-table-query"
import { useStockLocationPermissions } from "../../../../../hooks/use-resource-permissions"

const PAGE_SIZE = 20

export const ReservationItemTable = ({
  inventoryItem,
}: {
  inventoryItem: HttpTypes.AdminInventoryItemResponse["inventory_item"]
}) => {
  const { searchParams, raw } = useReservationsTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { canRead: canReadStockLocations } = useStockLocationPermissions()

  const { reservations, count, isPending, isError, error } =
    useReservationItems({
      ...searchParams,
      inventory_item_id: [inventoryItem.id],
    })

  const { stock_locations } = useStockLocations(
    {
      id: (reservations || []).map((r) => r.location_id),
    },
    { enabled: canReadStockLocations }
  )

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
    <_DataTable
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
