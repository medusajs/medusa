import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../components/common/action-menu"
import { useDeleteSalesChannelLazy } from "../../../../hooks/api/sales-channels"

type SalesChannelWithIsDefault = HttpTypes.AdminSalesChannel & {
  is_default?: boolean
}

export const SalesChannelListTableActions = ({
  salesChannel,
}: {
  salesChannel: SalesChannelWithIsDefault
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteSalesChannelLazy()

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.deleteSalesChannelWarning", {
        name: salesChannel.name,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: salesChannel.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(salesChannel.id, {
      onSuccess: () => {
        toast.success(t("salesChannels.toast.delete"))
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
              onClick: () =>
                navigate(`/settings/sales-channels/${salesChannel.id}/edit`),
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
              disabled: salesChannel.is_default,
              disabledTooltip: salesChannel.is_default
                ? t("salesChannels.tooltip.cannotDeleteDefault")
                : undefined,
            },
          ],
        },
      ]}
    />
  )
}
