import { DataTable } from "../../../../../components/table/data-table"
import { InventoryNext } from "@medusajs/types"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useInventoryTableColumns } from "./use-reservation-list-table-columns"
import { useInventoryTableQuery } from "./use-reservation-list-table-query"
import { useReservationItems } from "../../../../../hooks/api/inventory"

const PAGE_SIZE = 20

export const ReservationItemTable = ({
  inventoryItem,
}: {
  inventoryItem: InventoryNext.InventoryItemDTO
}) => {
  const { searchParams, raw } = useInventoryTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { reservations, count, isLoading, isError, error } =
    useReservationItems({
      ...searchParams,
      inventory_item_id: [inventoryItem.id],
    })

  const columns = useInventoryTableColumns({ sku: inventoryItem.sku! })

  const { table } = useDataTable({
    data: reservations ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
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
      isLoading={isLoading}
      pagination
      queryObject={raw}
    />
  )
}
