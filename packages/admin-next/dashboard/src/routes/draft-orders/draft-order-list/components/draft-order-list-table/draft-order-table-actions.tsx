import { PencilSquare, Trash } from "@medusajs/icons"
import { DraftOrder } from "@medusajs/medusa"
import { usePrompt } from "@medusajs/ui"
import { useAdminDeleteDraftOrder } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

export const DraftOrderTableActions = ({
  draftOrder,
}: {
  draftOrder: DraftOrder
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteDraftOrder(draftOrder.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("draftOrders.deleteWarning", {
        id: `#${draftOrder.display_id}`,
      }),
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
              label: t("actions.edit"),
              to: `${draftOrder.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}
