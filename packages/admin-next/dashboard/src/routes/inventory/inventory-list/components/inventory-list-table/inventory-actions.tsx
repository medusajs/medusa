import { PencilSquare, Trash } from "@medusajs/icons"
import { InventoryItemDTO } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useAdminDeleteInventoryItem } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

export const InventoryActions = ({ item }: { item: InventoryItemDTO }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminDeleteInventoryItem(item.id)

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

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `${item.id}/edit`,
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
