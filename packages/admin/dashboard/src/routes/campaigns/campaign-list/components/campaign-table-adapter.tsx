import { AdminCampaign } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useCampaigns } from "../../../../hooks/api/campaigns"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../lib/table/table-adapters"
import { CampaignListTableActions } from "./campaign-list-table-actions"

export function createCampaignTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<AdminCampaign> {
  return createTableAdapter<AdminCampaign>({
    entity: "campaigns",
    queryPrefix: "cmp",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("campaigns.list.empty.heading"),
        description: t("campaigns.list.empty.description"),
      },
      filtered: {
        heading: t("campaigns.list.filtered.heading"),
        description: t("campaigns.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { campaigns, count, isError, error, isLoading } = useCampaigns(
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
      return { data: campaigns, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/campaigns/${row.id}`,
    renderRowActions: (row) => <CampaignListTableActions campaign={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = ["campaign_identifier", "budget.currency_code"]

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
export function useCampaignTableAdapter(): TableAdapter<AdminCampaign> {
  const { t } = useTranslation()
  return useMemo(() => createCampaignTableAdapter({ t }), [t])
}
