import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { CustomerGroupListTableActions } from "./customer-group-list-table-actions"

export function createCustomerGroupTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminCustomerGroup> {
  return createTableAdapter<HttpTypes.AdminCustomerGroup>({
    entity: "customer-groups",
    queryPrefix: "cg",
    pageSize: 10,
    emptyState: {
      empty: {
        heading: t("customerGroups.list.empty.heading"),
        description: t("customerGroups.list.empty.description"),
      },
      filtered: {
        heading: t("customerGroups.list.filtered.heading"),
        description: t("customerGroups.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { customer_groups, count, isError, error, isLoading } =
        useCustomerGroups(
          {
            fields,
            ...params,
          },
          {
            placeholderData: (previousData, previousQuery: any) => {
              const prevFields =
                previousQuery?.[previousQuery?.length - 1]?.query?.fields
              if (prevFields && prevFields !== fields) {
                return undefined
              }
              return previousData
            },
          }
        )
      return { data: customer_groups, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/customer-groups/${row.id}`,
    renderRowActions: (row) => (
      <CustomerGroupListTableActions customerGroup={row} />
    ),
    transformColumns: (columns) => {
      // Mirrors AdminGetCustomerGroupsParamsFields on the admin customer
      // groups list endpoint.
      const ALLOWED_FILTERS = [
        "id",
        "name",
        "created_by",
        "created_at",
        "updated_at",
        "deleted_at",
        "customers.id",
      ]

      return columns.map((column) => {
        const isFilterDisabled = !ALLOWED_FILTERS.includes(column.field)

        return {
          ...column,
          filter: isFilterDisabled
            ? { ...column.filter, enabled: false }
            : column.filter,
        }
      })
    },
  })
}

// eslint-disable-next-line max-len
export function useCustomerGroupTableAdapter(): TableAdapter<HttpTypes.AdminCustomerGroup> {
  const { t } = useTranslation()
  return useMemo(() => createCustomerGroupTableAdapter({ t }), [t])
}
