import { useMemo } from "react"
import { createDataTableColumnHelper, StatusBadge } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useDate } from "../../../../../../hooks/use-date"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminOrder>()

export function useOrderDataTableColumns(apiColumns: any[] | undefined) {
  const { getFullDate } = useDate()

  return useMemo(() => {
    if (!apiColumns?.length) {
      return []
    }

    return apiColumns.map((apiColumn) => {
      // Special handling for specific columns
      if (apiColumn.field === "display_id") {
        return columnHelper.accessor("display_id", {
          id: apiColumn.field,
          header: () => apiColumn.name,
          cell: ({ getValue }) => {
            const value = getValue()
            return (
              <div className="flex items-center gap-x-2">
                <span className="text-ui-fg-subtle">#</span>
                <span>{value}</span>
              </div>
            )
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          enableSorting: false,
        })
      }

      if (
        apiColumn.field === "created_at" ||
        apiColumn.field === "updated_at"
      ) {
        return columnHelper.accessor(apiColumn.field as any, {
          id: apiColumn.field,
          header: () => apiColumn.name,
          cell: ({ getValue }) => {
            const value = getValue()
            if (!value) {
              return null
            }
            return getFullDate({ date: value })
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          enableSorting: false,
        })
      }

      if (apiColumn.field === "payment_status") {
        return columnHelper.accessor("payment_status", {
          id: apiColumn.field,
          header: () => apiColumn.name,
          cell: ({ getValue }) => {
            const value = getValue()
            return value ? (
              <StatusBadge color={"grey"}>{value as string}</StatusBadge>
            ) : null
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          enableSorting: false,
        })
      }

      if (apiColumn.field === "fulfillment_status") {
        return columnHelper.accessor("fulfillment_status", {
          id: apiColumn.field,
          header: () => apiColumn.name,
          cell: ({ getValue }) => {
            const value = getValue()
            return value ? (
              <StatusBadge color={"grey"}>{value as string}</StatusBadge>
            ) : null
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          enableSorting: false,
        })
      }

      if (apiColumn.field === "total") {
        return columnHelper.accessor("total", {
          id: apiColumn.field,
          header: () => apiColumn.name,
          cell: ({ getValue }) => {
            const value = getValue()
            // Format as currency if we have the value
            return value !== null && value !== undefined
              ? `$${(value / 100).toFixed(2)}`
              : null
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          enableSorting: false,
        })
      }

      // Handle nested fields with dot notation
      const fieldParts = apiColumn.field.split(".")

      return columnHelper.accessor(
        (row) => {
          let value: any = row
          for (const part of fieldParts) {
            value = value?.[part]
          }
          return value
        },
        {
          id: apiColumn.field,
          header: () => apiColumn.name,
          cell: ({ getValue }) => {
            const value = getValue()
            if (value === null || value === undefined) {
              return null
            }

            // Handle objects by trying to display sensible values
            if (typeof value === "object") {
              if (value.name) {
                return value.name
              }
              if (value.title) {
                return value.title
              }
              if (value.code) {
                return value.code
              }
              if (value.label) {
                return value.label
              }
              return JSON.stringify(value)
            }

            return String(value)
          },
          meta: {
            name: apiColumn.name,
            column: apiColumn,
          },
          enableSorting: false,
        }
      )
    })
  }, [apiColumns, getFullDate])
}
