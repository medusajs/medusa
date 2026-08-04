import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminCampaign } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../components/common/action-menu"
import { useDeleteCampaign } from "../../../../hooks/api/campaigns"

export const CampaignListTableActions = ({
  campaign,
}: {
  campaign: AdminCampaign
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteCampaign(campaign.id)

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("campaigns.deleteCampaignWarning", {
        name: campaign.name,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: campaign.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(
          t("campaigns.delete.successToast", { name: campaign.name })
        )
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/campaigns/${campaign.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
