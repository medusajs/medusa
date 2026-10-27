import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { _DataTable } from "../../../../../../components/table/data-table/data-table"
import { DateCell } from "../../../../../../components/table/table-cells/common/date-cell"
import { PlaceholderCell } from "../../../../../../components/table/table-cells/common/placeholder-cell"
import {
  CustomerCell,
  CustomerHeader,
} from "../../../../../../components/table/table-cells/order/customer-cell"
import {
  DisplayIdCell,
  DisplayIdHeader,
} from "../../../../../../components/table/table-cells/order/display-id-cell"
import { FulfillmentStatusCell } from "../../../../../../components/table/table-cells/order/fulfillment-status-cell"
import {
  TotalCell,
  TotalHeader,
} from "../../../../../../components/table/table-cells/order/total-cell"
import { useOrders } from "../../../../../../hooks/api/orders"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { formatProvider } from "../../../../../../lib/format-provider"
import { SHIPPED_FIELDS } from "../../../const"

const PAGE_SIZE = 20
const QUERY_PREFIX = "shp"

/**
 * Picks the fulfillment the Carrier and Ship Date columns display, for
 * orders that have more than one (e.g. a `partially_shipped` order with
 * separate shipments per location). Canceled fulfillments are excluded -
 * a canceled fulfillment never shipped, so it can't be the shipment that
 * put the order in this tab. Among the rest, the most recently shipped
 * fulfillment is the most relevant: it's the shipment that most recently
 * advanced the order's `fulfillment_status`.
 */
export const getMostRecentShippedFulfillment = (
  fulfillments?: HttpTypes.AdminOrderFulfillment[] | null
): HttpTypes.AdminOrderFulfillment | null => {
  const shipped = (fulfillments ?? []).filter(
    (fulfillment) => !fulfillment.canceled_at && fulfillment.shipped_at
  )

  if (!shipped.length) {
    return null
  }

  return shipped.reduce((mostRecent, candidate) =>
    new Date(candidate.shipped_at!) > new Date(mostRecent.shipped_at!)
      ? candidate
      : mostRecent
  )
}

/**
 * Renders the carrier (fulfillment provider) that shipped the order, via
 * the same `formatProvider` helper the order detail fulfillment panel uses
 * to render its own Provider field - keeping the two labels consistent.
 */
export const CarrierCell = ({
  fulfillment,
}: {
  fulfillment?: HttpTypes.AdminOrderFulfillment | null
}) => {
  if (!fulfillment) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">
        {formatProvider(fulfillment.provider_id)}
      </span>
    </div>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminOrder>()

const useShippedTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: () => <DisplayIdHeader />,
        cell: ({ getValue }) => <DisplayIdCell displayId={getValue()} />,
      }),
      columnHelper.accessor("customer", {
        header: () => <CustomerHeader />,
        cell: ({ getValue }) => <CustomerCell customer={getValue()} />,
      }),
      columnHelper.accessor("fulfillment_status", {
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">
              {t("orders.shipped.trackingStatus")}
            </span>
          </div>
        ),
        cell: ({ getValue }) => <FulfillmentStatusCell status={getValue()} />,
      }),
      columnHelper.display({
        id: "carrier",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("orders.shipped.carrier")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <CarrierCell
            fulfillment={getMostRecentShippedFulfillment(
              row.original.fulfillments
            )}
          />
        ),
      }),
      columnHelper.display({
        id: "ship_date",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("orders.shipped.shipDate")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <DateCell
            date={
              getMostRecentShippedFulfillment(row.original.fulfillments)
                ?.shipped_at
            }
          />
        ),
      }),
      columnHelper.accessor("total", {
        header: () => <TotalHeader />,
        cell: ({ getValue, row }) => (
          <TotalCell
            currencyCode={row.original.currency_code}
            total={getValue()}
          />
        ),
      }),
    ],
    [t]
  )
}

/**
 * The "Shipped" order list view, inspired by Veeqo's fulfillment list UX -
 * not a Veeqo integration. Shows orders that are
 * `shipped`/`partially_shipped`/`partially_delivered`/`delivered`. Unlike
 * Ready to Ship, there's nothing left to action from this view, so it's
 * read-only: no action column, no Fulfill button.
 */
export const ShippedTable = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const offsetKey = `${QUERY_PREFIX}_offset`
  const offset = Number(searchParams.get(offsetKey) ?? 0)

  const { orders, count, isLoading, isError, error } = useOrders(
    {
      fields: SHIPPED_FIELDS,
      fulfillment_status: [
        "shipped",
        "partially_shipped",
        "partially_delivered",
        "delivered",
      ],
      limit: PAGE_SIZE,
      offset,
      order: "-created_at",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useShippedTableColumns()

  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    prefix: QUERY_PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <_DataTable
      columns={columns}
      table={table}
      pagination
      navigateTo={(row) => `/orders/${row.original.id}`}
      count={count}
      isLoading={isLoading}
      pageSize={PAGE_SIZE}
      prefix={QUERY_PREFIX}
      noRecords={{
        message: t("orders.shipped.noRecordsMessage"),
      }}
    />
  )
}
