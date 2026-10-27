import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox, Tooltip, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper, RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState } from "react"
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
import {
  BulkFulfillOrdersResult,
  useBulkFulfillOrders,
  useOrders,
} from "../../../../../../hooks/api/orders"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { getStylizedAmount } from "../../../../../../lib/money-amount-helpers"
import { computeOrderParcel } from "../../../../../../lib/order-parcel"
import { READY_TO_SHIP_FIELDS } from "../../../const"
import { BulkFulfillResultSummary } from "./bulk-fulfill-result-summary"
import { FulfillConfirmPopover } from "./fulfill-confirm-popover"

const PAGE_SIZE = 20
const QUERY_PREFIX = "rts"

/**
 * The order's shipping method, augmented with the nested relation chain
 * down to the shipping option's location. The base `AdminOrderShippingMethod`
 * type only declares `shipping_option_id`, not a `shipping_option` relation -
 * this mirrors the local augmentation pattern used for order fulfillments
 * in `order-detail/constants.ts`.
 */
export type ReadyToShipShippingMethod = HttpTypes.AdminOrderShippingMethod & {
  shipping_option?: {
    service_zone?: {
      fulfillment_set?: {
        location?: {
          id?: string | null
          name?: string | null
        } | null
      } | null
    } | null
  } | null
}

export type ReadyToShipOrder = Omit<
  HttpTypes.AdminOrder,
  "shipping_methods"
> & {
  shipping_methods?: ReadyToShipShippingMethod[] | null
}

export const getShipFromLocationName = (
  shippingMethod?: ReadyToShipShippingMethod | null
): string | null =>
  shippingMethod?.shipping_option?.service_zone?.fulfillment_set?.location
    ?.name ?? null

/**
 * Resolves the stock location's id from the same shipping method ->
 * shipping option -> service zone -> fulfillment set -> location chain as
 * `getShipFromLocationName`. Used by `FulfillConfirmPopover` to build the
 * fulfillment payload's `location_id` - the `name` alone isn't a usable id.
 */
export const getShipFromLocationId = (
  shippingMethod?: ReadyToShipShippingMethod | null
): string | null =>
  shippingMethod?.shipping_option?.service_zone?.fulfillment_set?.location
    ?.id ?? null

/**
 * Whether the order has a shipping method at all - the single precondition
 * the Shipping Rate/Ship From columns, the Fulfill button
 * (`FulfillConfirmPopover`/`DisabledFulfillCell`), and the bulk row
 * selection checkbox below all gate on. Centralized here so the bulk
 * checkbox can't drift from the single-row Fulfill button's own guard.
 */
export const orderHasShippingMethod = (
  order: Pick<ReadyToShipOrder, "shipping_methods">
): boolean => !!order.shipping_methods?.[0]

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
 * Renders the disabled Fulfill button for an order with no shipping method
 * at all - the same precondition the Shipping Rate and Ship From columns
 * fail under. `FulfillConfirmPopover` renders this directly for that case
 * and wires up the real confirm popover itself for every order that does
 * have a shipping method, so this component only ever renders the single,
 * disabled state - there is no enabled rendering to toggle between here.
 */
export const DisabledFulfillCell = () => {
  const { t } = useTranslation()

  return (
    <Tooltip content={t("orders.readyToShip.noShippingMethod")}>
      <Button size="small" variant="secondary" disabled>
        {t("orders.readyToShip.fulfill")}
      </Button>
    </Tooltip>
  )
}

const columnHelper = createColumnHelper<ReadyToShipOrder>()

const useReadyToShipTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : table.getIsAllPageRowsSelected()
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => {
          // `enableRowSelection` (set on `useDataTable` below, keyed off
          // the same `orderHasShippingMethod` check the single-row Fulfill
          // button uses) makes `getCanSelect()` false for an order with no
          // shipping method - mirrored here so the bulk checkbox can't
          // select an order the single-row path would already refuse to
          // fulfill, which would otherwise only fail later, server-side,
          // once the batch runs.
          const isSelectable = row.getCanSelect()

          return (
            <Checkbox
              disabled={!isSelectable}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
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
        cell: ({ row }) => <FulfillConfirmPopover order={row.original} />,
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
  const prompt = usePrompt()
  const [searchParams] = useSearchParams()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [bulkFulfillResult, setBulkFulfillResult] =
    useState<BulkFulfillOrdersResult | null>(null)
  // Guards the *entire* bulk-fulfill flow below (confirm prompt through the
  // mutation settling), not just the mutation call itself - each
  // fulfillment buys a real EasyPost shipping label, so a second click or
  // repeated "f" keypress while one batch (or even its confirm prompt) is
  // still in flight must be a no-op rather than firing a second, possibly
  // overlapping request for the same selection.
  const [isBulkFulfilling, setIsBulkFulfilling] = useState(false)

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

  const { mutateAsync: bulkFulfillOrders } = useBulkFulfillOrders()

  const { table } = useDataTable({
    data: (orders as ReadyToShipOrder[] | undefined) ?? [],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    prefix: QUERY_PREFIX,
    // Keyed off the same `shipping_methods` check the single-row Fulfill
    // button (`FulfillConfirmPopover`/`DisabledFulfillCell`) already gates
    // on, so an order that button would refuse to fulfill can't be
    // selected via the bulk checkbox either - see `orderHasShippingMethod`.
    enableRowSelection: (row) => orderHasShippingMethod(row.original),
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
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
        count={count}
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        prefix={QUERY_PREFIX}
        noRecords={{
          message: t("orders.readyToShip.noRecordsMessage"),
        }}
        commands={[
          {
            // `_DataTable`'s own `handleAction` clears `rowSelection` once
            // this returned promise resolves (`data-table-root.tsx`'s
            // `handleAction` calls `table.resetRowSelection()` after
            // `action(...)` settles), so this never resets it itself -
            // doing so here too would just duplicate that guarantee. The
            // catch below keeps this promise always resolving (a
            // request-level failure, as opposed to a per-order one in the
            // structured result, still surfaces via a toast) so that
            // clear-on-settle always runs.
            //
            // The `isBulkFulfilling` guard below covers a second click or
            // a repeated "f" keypress arriving while a prior invocation
            // (confirm prompt or mutation) hasn't settled yet - the
            // command bar/keyboard shortcut (`command-bar.tsx`'s
            // `Command`) has no such guard of its own.
            action: async (selection) => {
              if (isBulkFulfilling) {
                return
              }

              setIsBulkFulfilling(true)

              try {
                const orderIds = Object.keys(selection)

                const confirmed = await prompt({
                  title: t("general.areYouSure"),
                  description: t(
                    "orders.readyToShip.fulfillSelectedConfirmDescription",
                    { count: orderIds.length }
                  ),
                  confirmText: t("actions.continue"),
                  cancelText: t("actions.cancel"),
                })

                if (!confirmed) {
                  return
                }

                const result = await bulkFulfillOrders({
                  order_ids: orderIds,
                })
                setBulkFulfillResult(result)
              } catch (e) {
                toast.error(
                  e instanceof Error
                    ? e.message
                    : t("errorBoundary.defaultTitle")
                )
              } finally {
                setIsBulkFulfilling(false)
              }
            },
            label: t("orders.readyToShip.fulfillSelected"),
            shortcut: "f",
          },
        ]}
      />
      {bulkFulfillResult && (
        <BulkFulfillResultSummary
          result={bulkFulfillResult}
          onDismiss={() => setBulkFulfillResult(null)}
        />
      )}
    </>
  )
}
