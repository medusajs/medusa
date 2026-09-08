import { AdminCampaign, AdminPromotion } from "@medusajs/types"
import { DataTableCommand, usePrompt } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useAddOrRemoveCampaignPromotions } from "../../../../../hooks/api/campaigns"
import { usePromotions } from "../../../../../hooks/api/promotions"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"
// Registers the `promotion_method` / `promotion_status` renderers globally.
import "../../../../promotions/promotion-list/components/promotion-list-table/promotion-list-table-renderers"
import { PromotionActions } from "./campaign-promotion-section"

const ALLOWED_FILTERS = [
  "id",
  "code",
  "application_method.currency_code",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const ConfigurableCampaignPromotionSection = ({
  campaign,
}: {
  campaign: AdminCampaign
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAddOrRemoveCampaignPromotions(campaign.id)

  const commands = useMemo<DataTableCommand[]>(
    () => [
      {
        label: t("actions.remove"),
        shortcut: "r",
        action: async (selection) => {
          const ids = Object.keys(selection)
          const res = await prompt({
            title: t("campaigns.promotions.remove.title", {
              count: ids.length,
            }),
            description: t("campaigns.promotions.remove.description", {
              count: ids.length,
            }),
            confirmText: t("actions.continue"),
            cancelText: t("actions.cancel"),
          })
          if (!res) {
            return
          }
          await mutateAsync({ remove: ids })
        },
      },
    ],
    [t, prompt, mutateAsync]
  )

  const adapter = useMemo(
    () =>
      createTableAdapter<AdminPromotion>({
        entity: "promotions",
        viewConfigurationKey: "promotions-campaign",
        queryPrefix: "cmpprom",
        pageSize: 10,
        enableRowSelection: true,
        commands,
        emptyState: {
          empty: {
            heading: t("campaigns.promotions.list.noRecordsMessage"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        },
        useData: (fields, params) => {
          const { promotions, count, isError, error, isLoading } =
            usePromotions({
              fields,
              ...params,
              campaign_id: campaign.id,
            })
          return { data: promotions, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/promotions/${row.id}`,
        renderRowActions: (row) => (
          <PromotionActions promotion={row} campaignId={campaign.id} />
        ),
        transformColumns: (columns) =>
          columns.map((column) => ({
            ...column,
            filter: !ALLOWED_FILTERS.includes(column.field)
              ? { ...column.filter, enabled: false }
              : column.filter,
          })),
      }),
    [t, campaign.id, commands]
  )

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("promotions.domain")}
      actions={[{ label: t("general.add"), to: `add-promotions` }]}
    />
  )
}
