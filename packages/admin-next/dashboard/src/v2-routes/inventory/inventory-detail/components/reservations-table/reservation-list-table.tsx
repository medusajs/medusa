import { DataTable } from "../../../../../components/table/data-table"
import { InventoryNext } from "@medusajs/types"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useInventoryItemLevels } from "../../../../../hooks/api/inventory"
import { useInventoryTableColumns } from "./use-reservation-list-table-columns"
import { useInventoryTableQuery } from "./use-reservation-list-table-query"
import { useTranslation } from "react-i18next"

const PAGE_SIZE = 20

export const ItemLocationListTable = ({
  inventory_item_id,
}: {
  inventory_item_id: string
}) => {
  const { searchParams, raw } = useInventoryTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { inventory_levels, count, isLoading, isError, error } =
    useInventoryItemLevels(inventory_item_id, {
      ...searchParams,
      fields: "*stock_locations",
    })

  const columns = useInventoryTableColumns()

  const { table } = useDataTable({
    data: inventory_levels ?? [],
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
