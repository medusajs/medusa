import { ArrowPath } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useOrders } from "../../../../../hooks/api/orders"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"

const ALLOWED_FILTERS = [
  "id",
  "status",
  "sales_channel.id",
  "region.id",
  "created_at",
  "updated_at",
  "total",
]

const CustomerOrderRowActions = ({
  order,
}: {
  order: HttpTypes.AdminOrder
}) => {
  const { t } = useTranslation()
  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("transferOwnership.label"),
              to: `${order.id}/transfer`,
              icon: <ArrowPath />,
            },
          ],
        },
      ]}
    />
  )
}

export const ConfigurableCustomerOrderSection = ({
  customer,
}: {
  customer: HttpTypes.AdminCustomer
}) => {
  const { t } = useTranslation()

  const adapter = useMemo(
    () =>
      createTableAdapter<HttpTypes.AdminOrder>({
        entity: "orders",
        viewConfigurationKey: "orders-customer",
        queryPrefix: "cusord",
        pageSize: 10,
        emptyState: {
          empty: { heading: t("general.noRecordsMessage") },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        },
        useData: (fields, params) => {
          const { orders, count, isError, error, isLoading } = useOrders({
            fields,
            ...params,
            customer_id: customer.id,
          })
          return { data: orders, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/orders/${row.id}`,
        renderRowActions: (row) => <CustomerOrderRowActions order={row} />,
        transformColumns: (columns) =>
          columns.map((column) => ({
            ...column,
            filter: !ALLOWED_FILTERS.includes(column.field)
              ? { ...column.filter, enabled: false }
              : column.filter,
          })),
      }),
    [t, customer.id]
  )

  return (
    <ConfigurableDataTable adapter={adapter} heading={t("orders.domain")} />
  )
}
