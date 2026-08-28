import { PencilSquare, Trash } from "@medusajs/icons"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../components/common/action-menu"
import { AdminInventoryItem } from "@medusajs/types"
import { useDeleteInventoryItem } from "../../../../hooks/api/inventory"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const InventoryActions = ({
  item,
  canUpdate,
  canDelete,
}: {
  item: AdminInventoryItem
  canUpdate: boolean
  canDelete: boolean
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteInventoryItem(item.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("inventory.deleteWarning"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `${item.id}/edit`,
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

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
