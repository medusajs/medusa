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
    label: t("orders.paymentStatusLabel"),
    type: "select",
    multiple: true,
    options: [
      {
        label: t("orders.paymentStatus.notPaid"),
        value: "not_paid",
      },
      {
        label: t("orders.paymentStatus.awaiting"),
        value: "awaiting",
      },
      {
        label: t("orders.paymentStatus.captured"),
        value: "captured",
      },
      {
        label: t("orders.paymentStatus.refunded"),
        value: "refunded",
      },
      {
        label: t("orders.paymentStatus.partiallyRefunded"),
        value: "partially_refunded",
      },
      {
        label: t("orders.paymentStatus.canceled"),
        value: "canceled",
      },
      {
        label: t("orders.paymentStatus.requresAction"),
        value: "requires_action",
      },
    ],
  }

  const fulfillmentStatusFilter: Filter = {
    key: "fulfillment_status",
    label: t("orders.fulfillmentStatusLabel"),
    type: "select",
    multiple: true,
    options: [
      {
        label: t("orders.fulfillmentStatus.notFulfilled"),
        value: "not_fulfilled",
      },
      {
        label: t("orders.fulfillmentStatus.fulfilled"),
        value: "fulfilled",
      },
      {
        label: t("orders.fulfillmentStatus.partiallyFulfilled"),
        value: "partially_fulfilled",
      },
      {
        label: t("orders.fulfillmentStatus.returned"),
        value: "returned",
      },
      {
        label: t("orders.fulfillmentStatus.partiallyReturned"),
        value: "partially_returned",
      },
      {
        label: t("orders.fulfillmentStatus.shipped"),
        value: "shipped",
      },
      {
        label: t("orders.fulfillmentStatus.partiallyShipped"),
        value: "partially_shipped",
      },
      {
        label: t("orders.fulfillmentStatus.canceled"),
        value: "canceled",
      },
      {
        label: t("orders.fulfillmentStatus.requresAction"),
        value: "requires_action",
      },
    ],
  }

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
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
