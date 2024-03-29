import { Container, Heading } from "@medusajs/ui"
import { useAdminRegions } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useRegionTableColumns } from "../../../../../hooks/table/columns/use-region-table-columns"
import { useRegionTableFilters } from "../../../../../hooks/table/filters/use-region-table-filters"
import { useRegionTableQuery } from "../../../../../hooks/table/query/use-region-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const TaxListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useRegionTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { regions, count, isLoading, isError, error } = useAdminRegions(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()
  const filters = useRegionTableFilters()

  const { table } = useDataTable({
    data: regions || [],
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
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("regions.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        filters={filters}
        isLoading={isLoading}
        queryObject={raw}
        pageSize={PAGE_SIZE}
        count={count}
        pagination
        search
        navigateTo={(row) => `${row.original.id}`}
        orderBy={["name", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const useColumns = () => {
  const base = useRegionTableColumns()

  return useMemo(() => [...base], [base])
}
