import { Button, Container, Heading } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useLocationTableColumns } from "./use-location-table-columns"
import { useLocationTableQuery } from "./use-location-table-query"

const PAGE_SIZE = 20

export const LocationsListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useLocationTableQuery({ pageSize: PAGE_SIZE })

  /**
   * Note: The endpoint is bugged and does not return count, causing the table to not render
   * any rows.
   */
  const {
    stock_locations = [],
    count,
    isLoading,
    isError,
    error,
  } = useStockLocations({
    ...searchParams,
    fields: "*address",
  })

  const columns = useLocationTableColumns()

  const { table } = useDataTable({
    data: stock_locations,
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
        <Heading level="h2">{t("locations.domain")}</Heading>
        <div>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <DataTable
        table={table}
        pageSize={PAGE_SIZE}
        count={count || 1}
        columns={columns}
        navigateTo={(row) => row.id}
        // TODO: revisit loader - on query change this will cause unmounting of the table, rendering loader briefly and again rendering table which will make search input unfocused
        // isLoading={isLoading}
        queryObject={raw}
        pagination
        search
      />
    </Container>
  )
}
