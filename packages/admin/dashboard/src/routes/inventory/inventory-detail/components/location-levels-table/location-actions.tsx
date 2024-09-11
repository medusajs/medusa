import { PencilSquare, Trash } from "@medusajs/icons"

import { InventoryTypes } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteInventoryItemLevel } from "../../../../../hooks/api/inventory"

export const LocationActions = ({
  level,
}: {
  level: InventoryTypes.InventoryLevelDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteInventoryItemLevel(
    level.inventory_item_id,
    level.location_id
  )

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
              to: `locations/${level.location_id}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
              disabled:
                level.reserved_quantity > 0 || level.stocked_quantity > 0,
            },
          ],
        },
      ]}
    />
  )
}
