import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminPromotion } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeletePromotion } from "../../../../../hooks/api/promotions"

export const PromotionListTableActions = ({
  promotion,
}: {
  promotion: AdminPromotion
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { mutateAsync } = useDeletePromotion(promotion.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("promotions.deleteWarning", { code: promotion.code! }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: promotion.code,
    })

    if (!res) {
      return
    }

    try {
      await mutateAsync(undefined, {
        onSuccess: () => {
          navigate("/promotions", { replace: true })
        },
      })
    } catch {
      throw new Error(
        `Promotion with code ${promotion.code} could not be deleted`
      )
    }
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/promotions/${promotion.id}/edit`,
            },
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
