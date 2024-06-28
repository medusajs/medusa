import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { usePriceLists } from "../../../../../hooks/api/price-lists"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { usePricingTableColumns } from "./use-pricing-table-columns"
import { usePricingTableFilters } from "./use-pricing-table-filters"
import { usePricingTableQuery } from "./use-pricing-table-query"

const PAGE_SIZE = 20

export const PriceListListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = usePricingTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { price_lists, count, isLoading, isError, error } = usePriceLists(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = usePricingTableFilters()
  const columns = usePricingTableColumns()

  const { table } = useDataTable({
    data: price_lists || [],
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
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("priceLists.domain")}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        filters={filters}
        orderBy={["title", "status", "created_at", "updated_at"]}
        queryObject={raw}
        pageSize={PAGE_SIZE}
        navigateTo={(row) => row.original.id}
        isLoading={isLoading}
        pagination
        search
      />
    </Container>
  )
}
