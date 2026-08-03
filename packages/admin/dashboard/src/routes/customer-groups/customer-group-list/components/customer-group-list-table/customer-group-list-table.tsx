import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../../../components/data-table"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import { useCustomerGroups } from "../../../../../hooks/api"
import { useDate } from "../../../../../hooks/use-date"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { CustomerGroupListTableActions } from "./customer-group-list-table-actions"

const PAGE_SIZE = 10

export const CustomerGroupListTable = () => {
  const { t } = useTranslation()

  const { q, order, offset, created_at, updated_at } = useQueryParams([
    "q",
    "order",
    "offset",
    "created_at",
    "updated_at",
  ])

  const columns = useColumns()
  const filters = useFilters()

  const { customer_groups, count, isPending, isError, error } =
    useCustomerGroups(
      {
        q,
        order,
        offset: offset ? parseInt(offset) : undefined,
        limit: PAGE_SIZE,
        created_at: created_at ? JSON.parse(created_at) : undefined,
        updated_at: updated_at ? JSON.parse(updated_at) : undefined,
        fields: "id,name,created_at,updated_at,customers.id",
      },
      {
        placeholderData: keepPreviousData,
      }
    )

  if (isError) {
    throw error
  }

  return (
    <Container className="overflow-hidden p-0">
      <DataTable
        data={customer_groups}
        columns={columns}
        filters={filters}
        heading={t("customerGroups.domain")}
        rowCount={count}
        getRowId={(row) => row.id}
        rowHref={(row) => `/customer-groups/${row.id}`}
        action={{
          label: t("actions.create"),
          to: "/customer-groups/create",
        }}
        emptyState={{
          empty: {
            heading: t("customerGroups.list.empty.heading"),
            description: t("customerGroups.list.empty.description"),
          },
          filtered: {
            heading: t("customerGroups.list.filtered.heading"),
            description: t("customerGroups.list.filtered.description"),
          },
        }}
        pageSize={PAGE_SIZE}
        isLoading={isPending}
      />
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminCustomerGroup>()

const useColumns = () => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  return useMemo(() => {
    return [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("customers", {
        header: t("customers.domain"),
        cell: ({ row }) => {
          return <span>{row.original.customers?.length ?? 0}</span>
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ row }) => {
          return (
            <span>
              {getFullDate({
                date: row.original.created_at,
                includeTime: true,
              })}
            </span>
          )
        },
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
      columnHelper.accessor("updated_at", {
        header: t("fields.updatedAt"),
        cell: ({ row }) => {
          return (
            <span>
              {getFullDate({
                date: row.original.updated_at,
                includeTime: true,
              })}
            </span>
          )
        },
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
      columnHelper.display({
        id: "action",
        cell: ({ row }) => (
          <CustomerGroupListTableActions customerGroup={row.original} />
        ),
      }),
    ]
  }, [t, getFullDate])
}

const useFilters = () => {
  const dateFilters = useDataTableDateFilters()

  return useMemo(() => {
    return dateFilters
  }, [dateFilters])
}
