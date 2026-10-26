import { DataTableFilter, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useEntityColumns } from "../../../../hooks/api/views"
import { parseFilterParam } from "../../../../hooks/table/query"
import { useColumnFilters } from "../../../../hooks/table/use-column-filters"
import { useDate } from "../../../../hooks/use-date"
import { useProductTableAdapter } from "../../product-list/components/product-list-table/product-table-adapter"

const OPERATOR_LABELS: Record<string, string> = {
  $eq: "=",
  $gt: ">",
  $gte: "≥",
  $lt: "<",
  $lte: "≤",
}

export const ConfigurableExportFilters = () => {
  const adapter = useProductTableAdapter()
  const [searchParams] = useSearchParams()
  const { getFullDate } = useDate()

  const { columns } = useEntityColumns(adapter.entity)
  const apiColumns = useMemo(() => {
    return columns && adapter.transformColumns
      ? adapter.transformColumns(columns)
      : columns
  }, [adapter, columns])
  const { filters } = useColumnFilters(apiColumns)

  const activeFilters = filters.flatMap((filter) => {
    const value = parseFilterParam(
      searchParams.get(`${adapter.queryPrefix}_${filter.id}`)
    )

    if (value === undefined) {
      return []
    }

    return [
      {
        id: filter.id,
        label: filter.label,
        value: formatFilterValue(filter, value, (date) =>
          getFullDate({ date })
        ),
      },
    ]
  })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <div
          key={filter.id}
          className="bg-ui-bg-field shadow-borders-base text-ui-fg-subtle flex items-stretch overflow-hidden rounded-md"
        >
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="whitespace-nowrap border-r px-2 py-1"
          >
            {filter.label}
          </Text>
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="truncate px-2 py-1"
          >
            {filter.value}
          </Text>
        </div>
      ))}
    </div>
  )
}

const formatFilterValue = (
  filter: DataTableFilter,
  value: unknown,
  formatDate: (date: string) => string
): string => {
  const options = "options" in filter ? filter.options : undefined
  const getLabel = (v: unknown) =>
    options?.find((option) => option.value === v)?.label ?? String(v)

  if (Array.isArray(value)) {
    return value.map(getLabel).join(", ")
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([operator, operand]) => {
        const formatted =
          filter.type === "date" ? formatDate(operand) : String(operand)
        return `${OPERATOR_LABELS[operator] ?? operator} ${formatted}`
      })
      .join(", ")
  }

  return getLabel(value)
}
