import { AdminCampaign } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

type CampaignDetailsProps = {
  campaign?: AdminCampaign
}

export const CampaignDetails = ({ campaign }: CampaignDetailsProps) => {
  const { t } = useTranslation()

  if (!campaign) {
    return
  }

  return (
    <Fragment>
      <div>
        <Heading level="h2" className="mb-4">
          {t("campaigns.details")}
        </Heading>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus font-">
            {t("campaigns.fields.identifier")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">
              {campaign.campaign_identifier || "-"}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus">{t("fields.description")}</Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">{campaign.description || "-"}</Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus">
            {t("campaigns.fields.start_date")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">
              {campaign.starts_at?.toString() || "-"}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus">
            {t("campaigns.fields.end_date")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">
              {campaign.ends_at?.toString() || "-"}
            </Text>
          </div>
        </div>
      </div>

      <div>
        <Heading level="h2" className="mb-4">
          {t("campaigns.budget.details")}
        </Heading>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus font-">
            {t("campaigns.budget.fields.type")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">{campaign.budget?.type || "-"}</Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus">
            {t("campaigns.budget.fields.currency")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">
              {campaign?.budget?.currency_code || "-"}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus">
            {t("campaigns.budget.fields.limit")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">{campaign.budget?.limit || "-"}</Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle grid grid-cols-2 items-center py-1">
          <Text className="txt-small-plus">
            {t("campaigns.budget.fields.used")}
          </Text>

          <div className="flex items-center gap-1">
            <Text className="txt-small">{campaign.budget?.used || "-"}</Text>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
