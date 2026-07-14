import { HttpTypes } from "@medusajs/types"
import { DataTableCommand, toast, usePrompt } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useBatchCustomerCustomerGroups } from "../../../../../hooks/api"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useCustomerPermissions } from "../../../../../hooks/use-resource-permissions"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"
import { CustomerGroupRowActions } from "./customer-group-section"

export const ConfigurableCustomerGroupSection = ({
  customer,
}: {
  customer: HttpTypes.AdminCustomer
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { canUpdate } = useCustomerPermissions()

  const { mutateAsync } = useBatchCustomerCustomerGroups(customer.id)

  const commands = useMemo<DataTableCommand[]>(() => {
    if (!canUpdate) {
      return []
    }
    return [
      {
        label: t("actions.remove"),
        shortcut: "r",
        action: async (selection) => {
          const ids = Object.keys(selection)
          const res = await prompt({
            title: t("general.areYouSure"),
            description: t("customers.groups.removeMany", {
              groups: ids.join(","),
            }),
            confirmText: t("actions.remove"),
            cancelText: t("actions.cancel"),
          })
          if (!res) {
            return
          }
          await mutateAsync(
            { remove: ids },
            { onError: (e) => toast.error(e.message) }
          )
        },
      },
    ]
  }, [t, prompt, mutateAsync, canUpdate])

  const adapter = useMemo(
    () =>
      createTableAdapter<HttpTypes.AdminCustomerGroup>({
        entity: "customer-groups",
        viewConfigurationKey: "customer-groups-customer",
        queryPrefix: "cusgr",
        pageSize: 10,
        enableRowSelection: canUpdate,
        commands,
        emptyState: {
          empty: {
            heading: t("customers.groups.list.noRecordsMessage"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        },
        useData: (fields, params) => {
          const { customer_groups, count, isError, error, isLoading } =
            useCustomerGroups({
              fields: fields + ",+customers.id",
              ...params,
              customers: { id: customer.id },
            })
          return { data: customer_groups, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/customer-groups/${row.id}`,
        renderRowActions: (row) => (
          <CustomerGroupRowActions group={row} customerId={customer.id} />
        ),
      }),
    [t, customer.id, canUpdate, commands]
  )

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("customerGroups.domain")}
      actions={
        canUpdate
          ? [{ label: t("general.add"), to: `add-customer-groups` }]
          : []
      }
    />
  )
}
