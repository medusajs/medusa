import { Button, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCustomerGroupTableColumns } from "./use-customer-group-table-columns"
import { useCustomerGroupTableFilters } from "./use-customer-group-table-filters"
import { useCustomerGroupTableQuery } from "./use-customer-group-table-query"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"

const PAGE_SIZE = 20

export const CustomerGroupListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups({
      ...searchParams,
      fields: "id,name,customers.id",
    })

  const filters = useCustomerGroupTableFilters()
  const columns = useCustomerGroupTableColumns()

  const { table } = useDataTable({
    data: customer_groups ?? [],
    columns,
    enablePagination: true,
    count,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("customerGroups.domain")}</Heading>
        <Link to="/customer-groups/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        filters={filters}
        search
        pagination
        navigateTo={(row) => `/customer-groups/${row.original.id}`}
        orderBy={["name", "created_at", "updated_at"]}
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}
