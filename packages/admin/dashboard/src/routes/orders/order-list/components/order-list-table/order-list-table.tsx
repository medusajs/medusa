import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom"

import { _DataTable } from "../../../../../components/table/data-table/data-table"
import { useOrders } from "../../../../../hooks/api/orders"
import { useOrderTableColumns } from "../../../../../hooks/table/columns/use-order-table-columns"
import { useOrderTableQuery } from "../../../../../hooks/table/query/use-order-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

import { DEFAULT_FIELDS } from "../../const"
import { useOrderTableFilters } from "../../../../../hooks/table/filters"
import {
  BulkTagOrdersAction,
  BulkTagOrdersModal,
} from "./components/bulk-tag-orders-modal"
import { ReadyToShipTable } from "./components/ready-to-ship-table"
import { ShippedTable } from "./components/shipped-table"
import { getOrderListView, OrderListTabs } from "./order-list-tabs"

const PAGE_SIZE = 20

/**
 * The default `All` tab's table: the existing filters/search/bulk-tag/
 * export experience, unchanged from before the tab bar was introduced.
 * Split out into its own component (rather than gated inline inside
 * `OrderListTable`) so its hooks - `useOrders`, `useOrderTableQuery`,
 * etc. - only run while this tab is actually active; the Ready to Ship
 * and Shipped tabs mount/unmount this component rather than it running
 * unconditionally in the background on every tab.
 */
const AllOrdersTable = () => {
  const { t } = useTranslation()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [bulkTagAction, setBulkTagAction] =
    useState<BulkTagOrdersAction | null>(null)

  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { orders, count, isError, error, isLoading } = useOrders(
    {
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useOrderTableFilters()
  const columns = useOrderTableColumns({ enableRowSelection: true })

  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    meta: {
      orderIdsOnPage: orders?.map((order) => order.id) ?? [],
    },
  })

  if (isError) {
    throw error
  }

  return (
    <>
      <_DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/orders/${row.original.id}`}
        filters={filters}
        count={count}
        search
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        orderBy={[
          { key: "display_id", label: t("orders.fields.displayId") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        queryObject={raw}
        noRecords={{
          message: t("orders.list.noRecordsMessage"),
        }}
        commands={[
          {
            action: async (selection) => {
              setBulkTagAction({
                mode: "add",
                orderIds: Object.keys(selection),
              })
            },
            label: t("orders.tags.addAction"),
            shortcut: "t",
          },
          {
            action: async (selection) => {
              setBulkTagAction({
                mode: "remove",
                orderIds: Object.keys(selection),
              })
            },
            label: t("orders.tags.removeAction"),
            shortcut: "r",
          },
        ]}
      />
      <Outlet />
      {bulkTagAction && (
        <BulkTagOrdersModal
          action={bulkTagAction}
          onClose={() => setBulkTagAction(null)}
        />
      )}
    </>
  )
}

export const OrderListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const view = getOrderListView(searchParams)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("orders.domain")}</Heading>
        {view === "all" && (
          <Button size="small" variant="secondary" asChild>
            <Link to={`export${location.search}`}>{t("actions.export")}</Link>
          </Button>
        )}
      </div>
      <div className="px-6 py-4">
        <OrderListTabs />
      </div>
      {view === "all" && <AllOrdersTable />}
      {view === "ready-to-ship" && <ReadyToShipTable />}
      {view === "shipped" && <ShippedTable />}
    </Container>
  )
}
