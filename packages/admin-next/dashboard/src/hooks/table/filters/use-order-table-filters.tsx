import { useAdminRegions, useAdminSalesChannels } from "medusa-react"
import { useTranslation } from "react-i18next"

import type { Filter } from "../../../components/table/data-table"

export const useOrderTableFilters = (): Filter[] => {
  const { t } = useTranslation()

  const { regions } = useAdminRegions({
    limit: 1000,
    fields: "id,name",
    expand: "",
  })

  const { sales_channels } = useAdminSalesChannels({
    limit: 1000,
    fields: "id,name",
    expand: "",
  })

  let filters: Filter[] = []

  if (regions) {
    const regionFilter: Filter = {
      key: "region_id",
      label: t("fields.region"),
      type: "select",
      options: regions.map((r) => ({
        label: r.name,
        value: r.id,
      })),
      multiple: true,
      searchable: true,
    }

    filters = [...filters, regionFilter]
  }

  if (sales_channels) {
    const salesChannelFilter: Filter = {
      key: "sales_channel_id",
      label: t("fields.salesChannel"),
      type: "select",
      multiple: true,
      searchable: true,
      options: sales_channels.map((s) => ({
        label: s.name,
        value: s.id,
      })),
    }

    filters = [...filters, salesChannelFilter]
  }

  const paymentStatusFilter: Filter = {
    key: "payment_status",
    label: t("orders.payment.statusLabel"),
    type: "select",
    multiple: true,
    options: [
      {
        label: t("orders.payment.status.notPaid"),
        value: "not_paid",
      },
      {
        label: t("orders.payment.status.awaiting"),
        value: "awaiting",
      },
      {
        label: t("orders.payment.status.captured"),
        value: "captured",
      },
      {
        label: t("orders.payment.status.refunded"),
        value: "refunded",
      },
      {
        label: t("orders.payment.status.partiallyRefunded"),
        value: "partially_refunded",
      },
      {
        label: t("orders.payment.status.canceled"),
        value: "canceled",
      },
      {
        label: t("orders.payment.status.requiresAction"),
        value: "requires_action",
      },
    ],
  }

  const fulfillmentStatusFilter: Filter = {
    key: "fulfillment_status",
    label: t("orders.fulfillment.statusLabel"),
    type: "select",
    multiple: true,
    options: [
      {
        label: t("orders.fulfillment.status.notFulfilled"),
        value: "not_fulfilled",
      },
      {
        label: t("orders.fulfillment.status.fulfilled"),
        value: "fulfilled",
      },
      {
        label: t("orders.fulfillment.status.partiallyFulfilled"),
        value: "partially_fulfilled",
      },
      {
        label: t("orders.fulfillment.status.returned"),
        value: "returned",
      },
      {
        label: t("orders.fulfillment.status.partiallyReturned"),
        value: "partially_returned",
      },
      {
        label: t("orders.fulfillment.status.shipped"),
        value: "shipped",
      },
      {
        label: t("orders.fulfillment.status.partiallyShipped"),
        value: "partially_shipped",
      },
      {
        label: t("orders.fulfillment.status.canceled"),
        value: "canceled",
      },
      {
        label: t("orders.fulfillment.status.requiresAction"),
        value: "requires_action",
      },
    ],
  }

  const dateFilters: Filter[] = [
    { label: "Created At", key: "created_at" },
    { label: "Updated At", key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  filters = [
    ...filters,
    paymentStatusFilter,
    fulfillmentStatusFilter,
    ...dateFilters,
  ]

  return filters
}
