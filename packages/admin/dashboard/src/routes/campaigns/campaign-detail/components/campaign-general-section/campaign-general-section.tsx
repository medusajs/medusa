import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminCampaignResponse } from "@medusajs/types"
import {
  Badge,
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteCampaign } from "../../../../../hooks/api/campaigns"
import { useCampaignPermissions } from "../../../../../hooks/use-resource-permissions"
import { currencies } from "../../../../../lib/data/currencies"
import {
  campaignStatus,
  statusColor,
} from "../../../common/utils/campaign-status"

type CampaignGeneralSectionProps = {
  campaign: AdminCampaignResponse["campaign"]
}

export const CampaignGeneralSection = ({
  campaign,
}: CampaignGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { canUpdate, canDelete } = useCampaignPermissions()
  const { mutateAsync } = useDeleteCampaign(campaign.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("campaigns.delete.title"),
      description: t("campaigns.delete.description", {
        name: campaign.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(
          t("campaigns.delete.successToast", {
            name: campaign.name,
          })
        )

        navigate("/campaigns", { replace: true })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const status = campaignStatus(campaign)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{campaign.name}</Heading>

        <div className="flex items-center gap-x-4">
          <StatusBadge color={statusColor(status)}>
            {t(`campaigns.status.${status}`)}
          </StatusBadge>

          {(() => {
            const groups: ActionGroup[] = []

            if (canUpdate) {
              groups.push({
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("actions.edit"),
                    to: `/campaigns/${campaign.id}/edit`,
                  },
                ],
              })
            }

            if (canDelete) {
              groups.push({
                actions: [
                  {
                    icon: <Trash />,
                    label: t("actions.delete"),
                    onClick: handleDelete,
                  },
                ],
              })
            }

            return groups.length > 0 ? <ActionMenu groups={groups} /> : null
          })()}
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("campaigns.fields.identifier")}
        </Text>

        <Text size="small" leading="compact">
          {campaign.campaign_identifier}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>

        <Text size="small" leading="compact">
          {campaign.description || "-"}
        </Text>
      </div>

      {campaign?.budget && campaign.budget.type === "spend" && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("fields.currency")}
          </Text>

          <div>
            <Badge size="xsmall">{campaign?.budget.currency_code}</Badge>
            <Text className="inline pl-3" size="small" leading="compact">
              {currencies[campaign?.budget.currency_code?.toUpperCase()]?.name}
            </Text>
          </div>
        </div>
      )}
    </Container>
  )
}
