import { HttpTypes } from "@medusajs/types"
import { DataTableCommand, usePrompt } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useRemoveCustomersFromGroup } from "../../../../../hooks/api/customer-groups"
import { useCustomers } from "../../../../../hooks/api/customers"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"
import { CustomerActions } from "./customer-group-customer-section"

const ALLOWED_FILTERS = [
  "email",
  "first_name",
  "last_name",
  "has_account",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const ConfigurableCustomerGroupCustomerSection = ({
  group,
}: {
  group: HttpTypes.AdminCustomerGroup
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useRemoveCustomersFromGroup(group.id)

  const commands = useMemo<DataTableCommand[]>(
    () => [
      {
        label: t("actions.remove"),
        shortcut: "r",
        action: async (selection) => {
          const ids = Object.keys(selection)
          const res = await prompt({
            title: t("customerGroups.customers.remove.title", {
              count: ids.length,
            }),
            description: t("customerGroups.customers.remove.description", {
              count: ids.length,
            }),
            confirmText: t("actions.continue"),
            cancelText: t("actions.cancel"),
          })
          if (!res) {
            return
          }
          await mutateAsync(ids)
        },
      },
    ],
    [t, prompt, mutateAsync]
  )

  const adapter = useMemo(
    () =>
      createTableAdapter<HttpTypes.AdminCustomer>({
        entity: "customers",
        viewConfigurationKey: "customers-group",
        queryPrefix: "cgcus",
        pageSize: 10,
        enableRowSelection: true,
        commands,
        emptyState: {
          empty: {
            heading: t("customerGroups.customers.list.noRecordsMessage"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        },
        useData: (fields, params) => {
          const { customers, count, isError, error, isLoading } = useCustomers({
            fields,
            ...params,
            groups: group.id,
          })
          return { data: customers, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/customers/${row.id}`,
        renderRowActions: (row) => (
          <CustomerActions customer={row} customerGroupId={group.id} />
        ),
        transformColumns: (columns) =>
          columns.map((column) => ({
            ...column,
            filter: !ALLOWED_FILTERS.includes(column.field)
              ? { ...column.filter, enabled: false }
              : column.filter,
          })),
      }),
    [t, group.id, commands]
  )

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("customers.domain")}
      actions={[{ label: t("general.add"), to: `add-customers` }]}
    />
  )
}
