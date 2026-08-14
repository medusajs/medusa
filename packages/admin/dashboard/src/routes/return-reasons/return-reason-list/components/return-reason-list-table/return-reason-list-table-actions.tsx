import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteReturnReason } from "../../../../../hooks/api/return-reasons"

export const ReturnReasonListTableActions = ({
  returnReason,
}: {
  returnReason: HttpTypes.AdminReturnReason
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteReturnReason()

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("returnReasons.delete.confirmation", {
        label: returnReason.label,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(returnReason.id, {
      onSuccess: () => {
        toast.success(
          t("returnReasons.delete.successToast", {
            label: returnReason.label,
          })
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
              onClick: () =>
                navigate(`/settings/return-reasons/${returnReason.id}/edit`),
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
