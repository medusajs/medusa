import { useMemo } from "react"
import { createDataTableColumnHelper } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import {
  getCellRenderer,
  getColumnValue,
} from "../../../lib/table/cell-renderers"
import { TableAdapter } from "../../../lib/table/table-adapters"

export function useConfigurableTableColumns<TData = any>(
  apiColumns: HttpTypes.AdminColumn[] | undefined,
  adapter?: TableAdapter<TData>
) {
  const columnHelper = useMemo(() => createDataTableColumnHelper<TData>(), [])
  const { t } = useTranslation()

  return useMemo(() => {
    if (!apiColumns?.length) {
      return []
    }

    const generatedColumns = apiColumns.map((apiColumn) => {
      // Virtual selection column: the ui select column (checkbox), kept as a
      // normal column (id "select") so it participates in ordering — its low
      // default_order keeps it first.
      if (apiColumn.render_mode === "select") {
        return columnHelper.select()
      }

      // Virtual actions column: rendered from the adapter's row actions rather
      // than the cell-renderer registry, but kept as a normal column so it
      // participates in visibility/ordering.
      if (apiColumn.render_mode === "actions") {
        return columnHelper.accessor(() => null, {
          id: apiColumn.field,
          header: () => null,
          cell: ({ row }: { row: any }) => {
            const content = adapter?.renderRowActions?.(row.original)
            if (!content) {
              return null
            }
            return (
              <div
                className="flex items-center justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                {content}
              </div>
            )
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          computed: {
            required_fields: [],
            optional_fields: [],
          },
          enableHiding: apiColumn.hideable,
          enableSorting: false,
          align: "right",
        } as any)
      }

      let renderType = apiColumn.computed?.type

      if (!renderType) {
        renderType = apiColumn.render_mode
      }

      const renderer = getCellRenderer(renderType, apiColumn.data_type)
      const align = adapter?.getColumnAlignment?.(apiColumn) ?? renderer.align
      // Per-column override wins; otherwise fall back to the renderer's default
      // (renderers that self-handle overflow set this to false), then to `true`.
      const truncateTooltip =
        (apiColumn.metadata as any)?.truncate_tooltip ??
        renderer.truncateTooltip ??
        true

      const accessor = (row: TData) => getColumnValue(row, apiColumn)

      return columnHelper.accessor(accessor, {
        id: apiColumn.field,
        header: () => apiColumn.name,
        cell: ({ getValue, row }: { getValue: any; row: any }) => {
          const value = getValue()

          return renderer.render(value, row.original, apiColumn, t)
        },
        meta: {
          name: apiColumn.name,
          column: apiColumn, // Store column metadata for future use
        },
        enableHiding: apiColumn.hideable,
        enableSorting: apiColumn.sortable,
        sortLabel: apiColumn.name,
        align,
        truncateTooltip,
      } as any)
    })

    return generatedColumns
  }, [apiColumns, adapter, t, columnHelper])
}
