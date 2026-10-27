import { HttpTypes } from "@medusajs/types"
import { Button, Tooltip } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { _DataTable } from "../../../../../../components/table/data-table/data-table"
import { DateCell } from "../../../../../../components/table/table-cells/common/date-cell"
import {
  CustomerCell,
  CustomerHeader,
} from "../../../../../../components/table/table-cells/order/customer-cell"
import {
  DisplayIdCell,
  DisplayIdHeader,
} from "../../../../../../components/table/table-cells/order/display-id-cell"
import {
  TotalCell,
  TotalHeader,
} from "../../../../../../components/table/table-cells/order/total-cell"
import { useOrders } from "../../../../../../hooks/api/orders"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { getStylizedAmount } from "../../../../../../lib/money-amount-helpers"
import { computeOrderParcel } from "../../../../../../lib/order-parcel"
import { READY_TO_SHIP_FIELDS } from "../../../const"

const PAGE_SIZE = 20
const QUERY_PREFIX = "rts"

/**
 * The order's shipping method, augmented with the nested relation chain
 * down to the shipping option's location. The base `AdminOrderShippingMethod`
 * type only declares `shipping_option_id`, not a `shipping_option` relation -
 * this mirrors the local augmentation pattern used for order fulfillments
 * in `order-detail/constants.ts`.
 */
type ReadyToShipShippingMethod = HttpTypes.AdminOrderShippingMethod & {
  shipping_option?: {
    service_zone?: {
      fulfillment_set?: {
        location?: {
          name?: string | null
        } | null
      } | null
    } | null
  } | null
}

type ReadyToShipOrder = Omit<HttpTypes.AdminOrder, "shipping_methods"> & {
  shipping_methods?: ReadyToShipShippingMethod[] | null
}

const getShipFromLocationName = (
  shippingMethod?: ReadyToShipShippingMethod | null
): string | null =>
  shippingMethod?.shipping_option?.service_zone?.fulfillment_set?.location
    ?.name ?? null

/**
 * Renders the stock location a Ready to Ship order will fulfill from,
 * resolved via the order's shipping method -> shipping option -> service
 * zone -> fulfillment set -> location chain (the pre-fulfillment path - an
 * order with no `Fulfillment` record yet has nothing for
 * `fulfillment.location_id` to read). Renders empty when there is no
 * shipping method to resolve from at all, or when the location can't be
 * resolved - the same precondition the Shipping Rate column fails under.
 */
export const ShipFromCell = ({
  shippingMethod,
}: {
  shippingMethod?: ReadyToShipShippingMethod | null
}) => {
  const locationName = getShipFromLocationName(shippingMethod)

  if (!locationName) {
    return null
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{locationName}</span>
    </div>
  )
}

const formatPackageField = (value: number | null, notSetLabel: string) =>
  value === null ? notSetLabel : String(value)

/**
 * Renders the parcel computed from the order's unfulfilled items. Each
 * missing weight/length/width/height field renders as "Not set" rather
 * than a fabricated default.
 */
export const PackageCell = ({
  items,
}: {
  items: HttpTypes.AdminOrderLineItem[]
}) => {
  const { t } = useTranslation()
  const notSetLabel = t("orders.readyToShip.notSet")
  const parcel = computeOrderParcel(items)

  return (
    <div className="flex h-full w-full flex-col justify-center gap-y-0.5 overflow-hidden py-1">
      <span className="truncate">
        {t("orders.readyToShip.weight")}:{" "}
        {formatPackageField(parcel.weight, notSetLabel)}
      </span>
      <span className="text-ui-fg-subtle truncate">
        {formatPackageField(parcel.length, notSetLabel)} x{" "}
        {formatPackageField(parcel.width, notSetLabel)} x{" "}
        {formatPackageField(parcel.height, notSetLabel)}
      </span>
    </div>
  )
}

/**
 * Renders the order's first shipping method's name and formatted amount.
 * A $0 (free shipping) amount still renders a value: the guard below only
 * short-circuits on a missing `shippingMethod`, so `getStylizedAmount` -
 * which takes a required `number` and has no null/undefined handling of
 * its own - is only ever called with a real amount, never with the "no
 * shipping method at all" case. That's what keeps the two visibly
 * distinct, not any null-safety in `getStylizedAmount` itself.
 */
export const ShippingRateCell = ({
  shippingMethod,
  currencyCode,
}: {
  shippingMethod?: ReadyToShipShippingMethod | null
  currencyCode: string
}) => {
  if (!shippingMethod) {
    return null
  }

  return (
    <div className="flex h-full w-full items-center gap-x-1.5 overflow-hidden">
      <span className="truncate">{shippingMethod.name}</span>
      <span className="text-ui-fg-subtle truncate">
        {getStylizedAmount(shippingMethod.amount, currencyCode)}
      </span>
    </div>
  )
}

/**
 * Renders the (currently inert) Fulfill action button. Disabled when the
 * order has no shipping method at all - the same precondition the Shipping
 * Rate and Ship From columns fail under. Task 6 wires this up to the real
 * confirm popover by modifying this file.
 */
export const FulfillCell = ({
  hasShippingMethod,
}: {
  hasShippingMethod: boolean
}) => {
  const { t } = useTranslation()

  const button = (
    <Button size="small" variant="secondary" disabled={!hasShippingMethod}>
      {t("orders.readyToShip.fulfill")}
    </Button>
  )

  if (hasShippingMethod) {
    return button
  }

  return (
    <Tooltip content={t("orders.readyToShip.noShippingMethod")}>
      {button}
    </Tooltip>
  )
}

const columnHelper = createColumnHelper<ReadyToShipOrder>()

const useReadyToShipTableColumns = () => {
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
      columnHelper.display({
        id: "ship_from",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("orders.readyToShip.shipFrom")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <ShipFromCell shippingMethod={row.original.shipping_methods?.[0]} />
        ),
      }),
      columnHelper.display({
        id: "package",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("orders.readyToShip.package")}</span>
          </div>
        ),
        cell: ({ row }) => <PackageCell items={row.original.items ?? []} />,
      }),
      columnHelper.display({
        id: "shipping_rate",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">
              {t("orders.readyToShip.shippingRate")}
            </span>
          </div>
        ),
        cell: ({ row }) => (
          <ShippingRateCell
            shippingMethod={row.original.shipping_methods?.[0]}
            currencyCode={row.original.currency_code}
          />
        ),
      }),
      columnHelper.accessor("created_at", {
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">
              {t("orders.readyToShip.orderDate")}
            </span>
          </div>
        ),
        cell: ({ getValue }) => <DateCell date={getValue()} />,
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
      columnHelper.display({
        id: "fulfill",
        cell: ({ row }) => (
          <FulfillCell
            hasShippingMethod={!!row.original.shipping_methods?.length}
          />
        ),
      }),
    ],
    [t]
  )
}

/**
 * The "Ready to Ship" order list view, inspired by Veeqo's fulfillment
 * list UX - not a Veeqo integration. Shows orders that are
 * `not_fulfilled`/`partially_fulfilled` and `captured`/`partially_captured`,
 * with the information a warehouse operator needs to ship them: where
 * they'll ship from, the computed parcel, and the chosen shipping rate.
 */
export const ReadyToShipTable = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const offsetKey = `${QUERY_PREFIX}_offset`
  const offset = Number(searchParams.get(offsetKey) ?? 0)

  const { orders, count, isLoading, isError, error } = useOrders(
    {
      fields: READY_TO_SHIP_FIELDS,
      fulfillment_status: ["not_fulfilled", "partially_fulfilled"],
      payment_status: ["captured", "partially_captured"],
      limit: PAGE_SIZE,
      offset,
      order: "-created_at",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useReadyToShipTableColumns()

  const { table } = useDataTable({
    data: (orders as ReadyToShipOrder[] | undefined) ?? [],
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
        message: t("orders.readyToShip.noRecordsMessage"),
      }}
    />
  )
}
