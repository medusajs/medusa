import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useCustomers } from "../../../../../hooks/api/customers"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { CustomerActions } from "./customer-list-table-actions"

export function createCustomerTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminCustomer> {
  return createTableAdapter<HttpTypes.AdminCustomer>({
    entity: "customers",
    queryPrefix: "c",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("customers.list.empty.heading"),
        description: t("customers.list.empty.description"),
      },
      filtered: {
        heading: t("customers.list.filtered.heading"),
        description: t("customers.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { customers, count, isError, error, isLoading } = useCustomers(
        {
          fields,
          ...params,
        },
        {
          placeholderData: (previousData, previousQuery: any) => {
            // Only keep placeholder data if the fields haven't changed
            const prevFields =
              previousQuery?.[previousQuery?.length - 1]?.query?.fields
            if (prevFields && prevFields !== fields) {
              return undefined
            }
            return previousData
          },
        }
      )
      return { data: customers, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/customers/${row.id}`,
    renderRowActions: (row) => <CustomerActions customer={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "email",
        "company_name",
        "first_name",
        "last_name",
        "has_account",
        "created_by",
        "created_at",
        "updated_at",
        "deleted_at",
        "groups.id",
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
export function useCustomerTableAdapter(): TableAdapter<HttpTypes.AdminCustomer> {
  const { t } = useTranslation()
  return useMemo(() => createCustomerTableAdapter({ t }), [t])
}
