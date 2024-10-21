import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"

import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useVariants } from "../../../../../hooks/api"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useClaimOutboundItemTableColumns } from "./use-claim-outbound-item-table-columns"
import { useClaimOutboundItemTableFilters } from "./use-claim-outbound-item-table-filters"
import { useClaimOutboundItemTableQuery } from "./use-claim-outbound-item-table-query"

const PAGE_SIZE = 50
const PREFIX = "rit"

type AddClaimOutboundItemsTableProps = {
  onSelectionChange: (ids: string[]) => void
  selectedItems: string[]
  currencyCode: string
}

export const AddClaimOutboundItemsTable = ({
  onSelectionChange,
  selectedItems,
  currencyCode,
}: AddClaimOutboundItemsTableProps) => {
  const { t } = useTranslation()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    selectedItems.reduce((acc, id) => {
      acc[id] = true
      return acc
    }, {} as RowSelectionState)
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    setRowSelection(newState)
    onSelectionChange(Object.keys(newState))
  }

  const { searchParams, raw } = useClaimOutboundItemTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const { variants = [], count } = useVariants({
    ...searchParams,
    fields: "*inventory_items.inventory.location_levels,+inventory_quantity",
  })

  const columns = useClaimOutboundItemTableColumns(currencyCode)
  const filters = useClaimOutboundItemTableFilters()

  const { table } = useDataTable({
    data: variants,
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: (_row) => {
      // TODO: Check inventory here. Check if other validations needs to be made
      return true
    },
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        filters={filters}
        pagination
        layout="fill"
        search
        orderBy={[
          { key: "product_id", label: t("fields.product") },
          { key: "title", label: t("fields.title") },
          { key: "sku", label: t("fields.sku") },
        ]}
        prefix={PREFIX}
        queryObject={raw}
      />
    </div>
  )
}
