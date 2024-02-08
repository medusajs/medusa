import { Button, Container, Heading } from "@medusajs/ui"
import { useAdminSalesChannels } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useSalesChannelTableColumns } from "./use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "./use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "./use-sales-channel-table-query"

const PAGE_SIZE = 20

export const SalesChannelListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { sales_channels, count, isLoading, isError, error } =
    useAdminSalesChannels(searchParams, {
      keepPreviousData: true,
    })

  const filters = useSalesChannelTableFilters()
  const columns = useSalesChannelTableColumns()

  const { table } = useDataTable({
    data: sales_channels ?? [],
    columns,
    count,
    pageSize: PAGE_SIZE,
    enablePagination: true,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("salesChannels.domain")}</Heading>
        <Link to="/settings/sales-channels/create">
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/settings/sales-channels/${row.original.id}`}
        count={count}
        search
        filters={filters}
        isLoading={isLoading}
        rowCount={PAGE_SIZE}
        orderBy={["name", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}
