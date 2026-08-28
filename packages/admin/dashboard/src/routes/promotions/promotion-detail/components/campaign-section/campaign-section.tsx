import { ArrowUpRightOnBox, PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import {
  Action,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { DateRangeDisplay } from "../../../../../components/common/date-range-display"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import {
  useCampaignPermissions,
  usePromotionPermissions,
} from "../../../../../hooks/use-resource-permissions"

const CampaignDetailSection = ({
  campaign,
}: {
  campaign: HttpTypes.AdminCampaign
}) => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="text-ui-fg-muted flex items-center gap-x-1.5">
        <Text size="small" weight="plus" className="text-ui-fg-base">
          {campaign.name}
        </Text>
        <Text size="small" weight="plus">
          ·
        </Text>
        <Text size="small" weight="plus">
          {campaign.campaign_identifier}
        </Text>
      </div>
      <DateRangeDisplay
        startsAt={campaign.starts_at}
        endsAt={campaign.ends_at}
        showTime
      />
    </div>
  )
}

export const CampaignSection = ({
  campaign,
}: {
  campaign: HttpTypes.AdminCampaign | null
}) => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { canUpdate: canUpdatePromotion } = usePromotionPermissions()
  const { canUpdate: canUpdateCampaign } = useCampaignPermissions()

  const canManagePromotionCampaign = canUpdatePromotion && canUpdateCampaign

  const actions: Action[] = []

  if (canManagePromotionCampaign) {
    actions.push({
      label: t("actions.edit"),
      to: "add-to-campaign",
      icon: <PencilSquare />,
    })
  }

  if (campaign) {
    actions.unshift({
      label: t("promotions.campaign.actions.goToCampaign"),
      to: `/campaigns/${campaign.id}`,
      icon: <ArrowUpRightOnBox />,
    })
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading level="h2">{t("promotions.fields.campaign")}</Heading>

        {actions.length > 0 && <ActionMenu groups={[{ actions }]} />}
      </div>

      {campaign ? (
        <CampaignDetailSection campaign={campaign} />
      ) : (
        <NoRecords
          className="h-[180px] pt-4 text-center"
          title="Not part of a campaign"
          message="Add this promotion to an existing campaign"
          action={
            canManagePromotionCampaign
              ? {
                  to: `/promotions/${id}/add-to-campaign`,
                  label: "Add to Campaign",
                }
              : undefined
          }
          buttonVariant="transparentIconLeft"
        />
      )}
    </Container>
  )
}
