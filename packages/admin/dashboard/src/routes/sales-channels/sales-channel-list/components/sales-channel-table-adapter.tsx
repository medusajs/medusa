import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useStore } from "../../../../hooks/api"
import { useSalesChannels } from "../../../../hooks/api/sales-channels"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../lib/table/table-adapters"
import { SalesChannelListTableActions } from "./sales-channel-list-table-actions"
// Registers the `sales_channel_status` renderer.
import "./sales-channel-table-renderers"

type SalesChannelWithIsDefault = HttpTypes.AdminSalesChannel & {
  is_default?: boolean
}

export function createSalesChannelTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<SalesChannelWithIsDefault> {
  return createTableAdapter<SalesChannelWithIsDefault>({
    entity: "sales-channels",
    queryPrefix: "sc",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { store } = useStore()
      const { sales_channels, count, isError, error, isLoading } =
        useSalesChannels(
          { fields, ...params },
          {
            placeholderData: (previousData: any, previousQuery: any) => {
              const prevFields =
                previousQuery?.[previousQuery?.length - 1]?.query?.fields
              if (prevFields && prevFields !== fields) {
                return undefined
              }
              return previousData
            },
          }
        )

      const data = sales_channels?.map((sales_channel) => ({
        ...sales_channel,
        is_default: store?.default_sales_channel_id === sales_channel.id,
      }))

      return { data, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/sales-channels/${row.id}`,
    renderRowActions: (row) => (
      <SalesChannelListTableActions salesChannel={row} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "name",
        "description",
        "is_disabled",
        "created_at",
        "updated_at",
        "deleted_at",
      ]
      return columns.map((column) => ({
        ...column,
        filter: !ALLOWED_FILTERS.includes(column.field)
          ? { ...column.filter, enabled: false }
          : column.filter,
      }))
    },
  })
}

// eslint-disable-next-line max-len
export function useSalesChannelTableAdapter(): TableAdapter<SalesChannelWithIsDefault> {
  const { t } = useTranslation()
  return useMemo(() => createSalesChannelTableAdapter({ t }), [t])
}
