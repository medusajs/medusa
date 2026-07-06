import { useMemo } from "react"
import { createDataTableColumnHelper } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import {
  getCellRenderer,
  getColumnValue,
} from "../../../lib/table/cell-renderers"
import { getColumnAlignment } from "../../../lib/table/column-utils"

export function useConfigurableTableColumns<TData = any>(
  entity: string,
  apiColumns: HttpTypes.AdminColumn[] | undefined
) {
  const columnHelper = createDataTableColumnHelper<TData>()
  const { t } = useTranslation()

  return useMemo(() => {
    if (!apiColumns?.length) {
      return []
    }

    return apiColumns.map((apiColumn) => {
      let renderType = apiColumn.computed?.type

      if (!renderType) {
        renderType = apiColumn.render_mode
      }

      const renderer = getCellRenderer(renderType, apiColumn.data_type)

      const headerAlign = getColumnAlignment(apiColumn)

      const accessor = (row: TData) => getColumnValue(row, apiColumn)

      return columnHelper.accessor(accessor, {
        id: apiColumn.field,
        header: () => apiColumn.name,
        cell: ({ getValue, row }: { getValue: any; row: any }) => {
          const value = getValue()

          return renderer(value, row.original, apiColumn, t)
        },
        meta: {
          name: apiColumn.name,
          column: apiColumn, // Store column metadata for future use
        },
        enableHiding: apiColumn.hideable,
        enableSorting: apiColumn.sortable,
        sortLabel: apiColumn.name,
        headerAlign, // Pass the header alignment to the DataTable
      } as any)
    })
  }, [entity, apiColumns, t])
}
