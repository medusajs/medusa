import { Container, Heading } from "@medusajs/ui"
import { useAdminOrders } from "medusa-react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/data-table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { useColumns } from "./use-columns"
import { useFilters } from "./use-filters"

const PAGE_SIZE = 50
const DEFAULT_RELATIONS = "customer,items,sales_channel"
const DEFAULT_FIELDS =
  "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code"

export const OrderListTable = () => {
  const { t } = useTranslation()
  const queryObject = useQueryParams([
    "offset",
    "q",
    "created_at",
    "updated_at",
    "region_id",
    "sales_channel_id",
    "payment_status",
    "fulfillment_status",
  ])
  const {
    offset,
    sales_channel_id,
    created_at,
    updated_at,
    fulfillment_status,
    payment_status,
    region_id,
    ...params
  } = queryObject

  const { orders, count, isError, error, isLoading } = useAdminOrders(
    {
      limit: PAGE_SIZE,
      offset: offset ? Number(offset) : 0,
      expand: DEFAULT_RELATIONS,
      fields: DEFAULT_FIELDS,
      sales_channel_id: sales_channel_id?.split(","),
      fulfillment_status: fulfillment_status?.split(","),
      payment_status: payment_status?.split(","),
      created_at: created_at ? JSON.parse(created_at) : undefined,
      updated_at: updated_at ? JSON.parse(updated_at) : undefined,
      region_id: region_id?.split(","),
      ...params,
    },
    {
      keepPreviousData: true,
    }
  )

  const filters = useFilters()
  const columns = useColumns()
  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  const noResults = !isLoading && !isError && orders?.length === 0

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("orders.domain")}</Heading>
      </div>
      {/* {!isLoading ? (
        <div className="divide-y">
          <DataTable.Query
            search
            orderBy={["display_id", "created_at", "updated_at"]}
            filters={filters}
          />
          {!noResults ? (
            <DataTable
              table={table}
              count={count}
              columns={columns}
              pagination
              navigateTo={(row) => `/orders/${row.original.id}`}
            />
          ) : (
            <NoResults />
          )}
        </div>
      ) : (
        <DataTable.Skeleton
          columns={columns}
          rowCount={PAGE_SIZE}
          pagination
          searchable
          orderBy
          filterable
        />
      )} */}
      <DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/orders/${row.original.id}`}
        filters={filters}
        count={count}
        isLoading={isLoading}
        rowCount={PAGE_SIZE}
        orderBy={["display_id", "created_at", "updated_at"]}
        search
        queryObject={queryObject}
      />
    </Container>
  )
}
