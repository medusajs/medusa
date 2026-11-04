import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteRefundReasonLazy } from "../../../../../hooks/api"
import { useRefundReasonPermissions } from "../../../../../hooks/use-resource-permissions"

export const RefundReasonListTableActions = ({
  refundReason,
}: {
  refundReason: HttpTypes.AdminRefundReason
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useRefundReasonPermissions()

  const { mutateAsync } = useDeleteRefundReasonLazy()

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("refundReasons.delete.confirmation", {
        label: refundReason.label,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(refundReason.id, {
      onSuccess: () => {
        toast.success(t("refundReasons.delete.successToast"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          onClick: () =>
            navigate(`/settings/refund-reasons/${refundReason.id}/edit`),
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
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
