import { defineRouteConfig } from "@medusajs/admin-sdk"
import type { HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  DataTableFilter,
  Tooltip,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { Fragment, useMemo } from "react"
import { Outlet } from "react-router-dom"

import { DataTable } from "../../components/common/data-table"
import { useCustomers } from "../../hooks/api/customers"
import { useDraftOrders } from "../../hooks/api/draft-orders"
import { useRegions } from "../../hooks/api/regions"
import { useSalesChannels } from "../../hooks/api/sales-channels"
import { useDataTableDateFilters } from "../../hooks/common/use-data-table-date-filters"
import { useQueryParams } from "../../hooks/common/use-query-params"
import { getFullDate } from "../../lib/utils/date-utils"
import { useTranslation } from "react-i18next"

const PAGE_SIZE = 20

export const handle = {
  breadcrumb: () => "Draft Orders",
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

  if (isError) {
    throw error
  }

  return (
    <Fragment>
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
          action={{
            label: t("actions.create"),
            to: "create",
          }}
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
      <Outlet />
    </Fragment>
  )
}

export const config = defineRouteConfig({
  label: "Drafts",
  nested: "/orders",
})

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminOrder>()

const useColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: "Display ID",
        cell: ({ getValue }) => {
          return `#${getValue()}`
        },
        enableSorting: true,
      }),
      columnHelper.accessor("created_at", {
        header: "Date",
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
        header: "Customer",
        cell: ({ row }) => {
          return row.original.customer?.email || "-"
        },
        enableSorting: true,
      }),
      columnHelper.accessor("sales_channel_id", {
        header: "Sales Channel",
        cell: ({ row }) => {
          return row.original.sales_channel?.name || "-"
        },
        enableSorting: true,
      }),
      columnHelper.accessor("region_id", {
        header: "Region",
        cell: ({ row }) => {
          return row.original.region?.name || "-"
        },
        enableSorting: true,
      }),
    ],
    []
  )
}

const useFilters = (): DataTableFilter[] => {
  const dateFilterOptions = useDataTableDateFilters()

  const { customers } = useCustomers(
    {
      limit: 1000,
      fields: "id,email",
    },
    {
      throwOnError: true,
    }
  )

  const { sales_channels } = useSalesChannels(
    {
      limit: 1000,
      fields: "id,name",
    },
    {
      throwOnError: true,
    }
  )

  const { regions } = useRegions(
    {
      limit: 1000,
      fields: "id,name",
    },
    { throwOnError: true }
  )

  return useMemo(() => {
    return [
      {
        id: "customer_id",
        label: "Customer",
        options:
          customers?.map((customer) => ({
            label: customer.email,
            value: customer.id,
          })) ?? [],
        type: "select",
      },
      {
        id: "sales_channel_id",
        label: "Sales Channel",
        options:
          sales_channels?.map((sales_channel) => ({
            label: sales_channel.name,
            value: sales_channel.id,
          })) ?? [],
        type: "select",
      },
      {
        id: "region_id",
        label: "Region",
        options:
          regions?.map((region) => ({
            label: region.name,
            value: region.id,
          })) ?? [],
        type: "select",
      },
      ...dateFilterOptions,
    ] satisfies DataTableFilter[]
  }, [customers, sales_channels, regions, dateFilterOptions])
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
