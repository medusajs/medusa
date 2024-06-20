import { DataTable } from "../../../../../components/table/data-table"
import { InventoryTypes } from "@medusajs/types"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import { useReservationTableColumn } from "./use-reservation-list-table-columns"
import { useReservationsTableQuery } from "./use-reservation-list-table-query"

const PAGE_SIZE = 20

export const ReservationItemTable = ({
  inventoryItem,
}: {
  inventoryItem: InventoryTypes.InventoryItemDTO
}) => {
  const { searchParams, raw } = useReservationsTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { reservations, count, isPending, isError, error } =
    useReservationItems({
      ...searchParams,
      inventory_item_id: [inventoryItem.id],
    })

  const columns = useReservationTableColumn({ sku: inventoryItem.sku! })

  const { table } = useDataTable({
    data: reservations ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row: InventoryTypes.ReservationItemDTO) => row.id,
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
