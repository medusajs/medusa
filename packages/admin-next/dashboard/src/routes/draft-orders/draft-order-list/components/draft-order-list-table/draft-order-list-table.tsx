import { Button, Container, Heading } from "@medusajs/ui"
import { useAdminDraftOrders } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDraftOrderTableColumns } from "./use-draft-order-table-columns"
import { useDraftOrderTableFilters } from "./use-draft-order-table-filters"
import { useDraftOrderTableQuery } from "./use-draft-order-table-query"

const PAGE_SIZE = 20

export const DraftOrderListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useDraftOrderTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { draft_orders, count, isLoading, isError, error } =
    useAdminDraftOrders(
      {
        ...searchParams,
        // expand: "cart,cart.customer",
      },
      {
        keepPreviousData: true,
      }
    )

  const columns = useDraftOrderTableColumns()
  const filters = useDraftOrderTableFilters()

  const { table } = useDataTable({
    data: draft_orders || [],
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
        <Heading>{t("draftOrders.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        isLoading={isLoading}
        columns={columns}
        filters={filters}
        pageSize={PAGE_SIZE}
        count={count}
        search
        pagination
        navigateTo={(row) => row.original.id}
        orderBy={["status", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}
