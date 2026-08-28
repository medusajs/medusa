import { PencilSquare, Trash } from "@medusajs/icons"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../components/common/action-menu"
import { useDeleteSalesChannelLazy } from "../../../../hooks/api/sales-channels"
import { useSalesChannelPermissions } from "../../../../hooks/use-resource-permissions"
import { SalesChannelWithIsDefault } from "./sales-channel-list-table"

export const SalesChannelListTableActions = ({
  salesChannel,
}: {
  salesChannel: SalesChannelWithIsDefault
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { canUpdate, canDelete } = useSalesChannelPermissions()

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

  const groups: ActionGroup[] = []

  const disabledTooltip = salesChannel.is_default
    ? t("salesChannels.tooltip.cannotDeleteDefault")
    : undefined

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          onClick: () =>
            navigate(`/settings/sales-channels/${salesChannel.id}/edit`),
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
          onClick: () => handleDelete(),
          disabled: salesChannel.is_default,
          disabledTooltip,
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
