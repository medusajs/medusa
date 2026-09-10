import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminPromotion } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeletePromotion } from "../../../../../hooks/api/promotions"
import { usePromotionPermissions } from "../../../../../hooks/use-resource-permissions"

export const PromotionListTableActions = ({
  promotion,
}: {
  promotion: AdminPromotion
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { canUpdate, canDelete } = usePromotionPermissions()
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

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/promotions/${promotion.id}/edit`,
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
