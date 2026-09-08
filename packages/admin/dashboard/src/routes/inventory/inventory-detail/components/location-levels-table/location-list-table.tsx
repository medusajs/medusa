import { DataTable } from "../../../../../components/data-table"
import { useInventoryItemLevels } from "../../../../../hooks/api/inventory"
import { useLocationListTableColumns } from "./use-location-list-table-columns"
import { useLocationLevelTableQuery } from "./use-location-list-table-query"

const PAGE_SIZE = 20
const PREFIX = "invlvl"

export const ItemLocationListTable = ({
  inventory_item_id,
  unit_of_measure,
}: {
  inventory_item_id: string
  unit_of_measure?: string | null
}) => {
  const searchParams = useLocationLevelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const {
    inventory_levels,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItemLevels(inventory_item_id, {
    ...searchParams,
    fields: "+stock_locations.id,+stock_locations.name",
  })

  const columns = useLocationListTableColumns(unit_of_measure)

  if (isError) {
    throw error
  }

  return (
    <DataTable
      data={inventory_levels ?? []}
      columns={columns}
      rowCount={count}
      pageSize={PAGE_SIZE}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      prefix={PREFIX}
      layout="fill"
      enableSearch={false}
    />
  )
}
