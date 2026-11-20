import { defineRouteConfig } from "@medusajs/admin-sdk"
import { LayoutComposer } from "@medusajs/dashboard/components"
import { usePermissions } from "@medusajs/dashboard/hooks"
import type { HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  DataTableFilter,
  Tooltip,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"

import { DataTable } from "../../components/common/data-table"
import { useCustomers } from "../../hooks/api/customers"
import { useDraftOrders } from "../../hooks/api/draft-orders"
import { useRegions } from "../../hooks/api/regions"
import { useSalesChannels } from "../../hooks/api/sales-channels"
import { useDataTableDateFilters } from "../../hooks/common/use-data-table-date-filters"
import { useQueryParams } from "../../hooks/common/use-query-params"
import {
  CREATE_DRAFT_ORDER_PERMISSIONS,
  VIEW_DRAFT_ORDER_PERMISSIONS,
} from "../../lib/permissions"
import { getFullDate } from "../../lib/utils/date-utils"
import { useTranslation } from "react-i18next"

const PAGE_SIZE = 20

const Breadcrumb = () => {
  const { t } = useTranslation()

  return <>{t("draftOrders.domain")}</>
}

export const handle = {
  breadcrumb: () => <Breadcrumb />,
}

const List = () => {
  const { t } = useTranslation()
  const queryParams = useDraftOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { draft_orders, count, isPending, isError, error } = useDraftOrders(
    {
      ...queryParams,
      order: queryParams.order ?? "-created_at",
      fields:
        "+customer.*,+sales_channel.*,+email,+display_id,+total,+currency_code,+shipping_total,+tax_total,+discount_total,+items.*,+items.variant.*,+items.variant.product.*,+items.variant.product.shipping_profile.*,+items.variant.options.*,+region.*",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useFilters()
  const { hasAllPermissions } = usePermissions()
  const canCreate = hasAllPermissions(CREATE_DRAFT_ORDER_PERMISSIONS)

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="draft_order.list"
      preferredLayoutId="core:single-column"
      sections={{
        main: (
          <LayoutComposer.Entry id="DraftOrderListTable">
            <Container className="p-0">
              <DataTable
                data={draft_orders}
                getRowId={(row) => row.id}
                columns={columns}
                filters={filters}
                isLoading={isPending}
                pageSize={PAGE_SIZE}
                rowCount={count}
                heading={t("draftOrders.domain")}
                action={
                  canCreate
                    ? {
                        label: t("actions.create"),
                        to: "create",
                      }
                    : undefined
                }
                rowHref={(row) => `${row.id}`}
                emptyState={{
                  empty: {
                    heading: t("draftOrders.list.noRecordsMessage"),
                    description: t("draftOrders.list.description"),
                  },
                  filtered: {
                    heading: t("draftOrders.list.filtered.heading"),
                    description: t("draftOrders.list.filtered.description"),
                  },
                }}
              />
            </Container>
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}

export const config = defineRouteConfig({
  label: "draftOrders.domain",
  translationNs: "translation",
  nested: "/orders",
  permissions: VIEW_DRAFT_ORDER_PERMISSIONS,
})

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminOrder>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: t("orders.fields.displayId"),
        cell: ({ getValue }) => {
          return `#${getValue()}`
        },
        enableSorting: true,
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.date"),
        cell: ({ getValue }) => {
          return (
            <Tooltip
              content={getFullDate({ date: getValue(), includeTime: true })}
            >
              <span>{getFullDate({ date: getValue() })}</span>
            </Tooltip>
          )
        },
        enableSorting: true,
      }),
      columnHelper.accessor("customer_id", {
        header: t("fields.customer"),
        cell: ({ row }) => {
          return row.original.customer?.email || "-"
        },
        enableSorting: true,
      }),
      columnHelper.accessor("sales_channel_id", {
        header: t("fields.salesChannel"),
        cell: ({ row }) => {
          return row.original.sales_channel?.name || "-"
        },
        enableSorting: true,
      }),
      columnHelper.accessor("region_id", {
        header: t("fields.region"),
        cell: ({ row }) => {
          return row.original.region?.name || "-"
        },
        enableSorting: true,
      }),
    ],
    [t]
  )
}

const useFilters = (): DataTableFilter[] => {
  const { t } = useTranslation()
  const dateFilterOptions = useDataTableDateFilters()
  const { hasPermission } = usePermissions()
  const canReadCustomers = hasPermission("customer:read")
  const canReadSalesChannels = hasPermission("sales_channel:read")
  const canReadRegions = hasPermission("region:read")

  const { customers } = useCustomers(
    {
      limit: 1000,
      fields: "id,email",
    },
    {
      throwOnError: true,
      enabled: canReadCustomers,
    }
  )

  const { sales_channels } = useSalesChannels(
    {
      limit: 1000,
      fields: "id,name",
    },
    {
      throwOnError: true,
      enabled: canReadSalesChannels,
    }
  )

  const { regions } = useRegions(
    {
      limit: 1000,
      fields: "id,name",
    },
    { throwOnError: true, enabled: canReadRegions }
  )

  return useMemo(() => {
    const filters: DataTableFilter[] = []

    if (canReadCustomers) {
      filters.push({
        id: "customer_id",
        label: t("fields.customer"),
        options:
          customers
            ?.filter(
              (customer): customer is HttpTypes.AdminCustomer =>
                customer !== null
            )
            .map((customer) => ({
              label: customer.email,
              value: customer.id,
            })) ?? [],
        type: "select",
      })
    }

    if (canReadSalesChannels) {
      filters.push({
        id: "sales_channel_id",
        label: t("fields.salesChannel"),
        options:
          sales_channels?.map((sales_channel) => ({
            label: sales_channel.name,
            value: sales_channel.id,
          })) ?? [],
        type: "select",
      })
    }

    if (canReadRegions) {
      filters.push({
        id: "region_id",
        label: t("fields.region"),
        options:
          regions?.map((region) => ({
            label: region.name,
            value: region.id,
          })) ?? [],
        type: "select",
      })
    }

    return [...filters, ...dateFilterOptions]
  }, [
    t,
    canReadCustomers,
    canReadSalesChannels,
    canReadRegions,
    customers,
    sales_channels,
    regions,
    dateFilterOptions,
  ])
}

type UseDraftOrderTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useDraftOrderTableQuery = ({
  prefix,
  pageSize = 20,
}: UseDraftOrderTableQueryProps) => {
  const queryObject = useQueryParams(
    [
      "offset",
      "q",
      "order",
      "customer_id",
      "region_id",
      "created_at",
      "updated_at",
    ],
    prefix
  )

  const { offset, created_at, updated_at, ...rest } = queryObject

  const searchParams: HttpTypes.AdminDraftOrderListParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    ...rest,
  }

  return searchParams
}

export default List
