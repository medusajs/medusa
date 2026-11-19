import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  Action,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteCustomerGroupLazy } from "../../../../../hooks/api"
import { useCustomerGroupPermissions } from "../../../../../hooks/use-resource-permissions"

type CustomerGroupListTableActionsProps = {
  customerGroup: HttpTypes.AdminCustomerGroup
}

export const CustomerGroupListTableActions = ({
  customerGroup,
}: CustomerGroupListTableActionsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useCustomerGroupPermissions()

  const { mutateAsync: deleteCustomerGroup } = useDeleteCustomerGroupLazy()

  const handleDelete = async () => {
    const name = customerGroup.name ?? ""

    const res = await prompt({
      title: t("customerGroups.delete.title"),
      description: t("customerGroups.delete.description", { name }),
      verificationText: name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteCustomerGroup(
      { id: customerGroup.id },
      {
        onSuccess: () => {
          toast.success(t("customerGroups.delete.successToast", { name }))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  const editGroup = canUpdate
    ? [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          onClick: () => {
            navigate(`/customer-groups/${customerGroup.id}/edit`)
          },
        },
      ]
    : []

  const deleteGroup = canDelete
    ? [
        {
          icon: <Trash />,
          label: t("actions.delete"),
          onClick: () => {
            handleDelete()
          },
        },
      ]
    : []

  const actionGroups = [editGroup, deleteGroup].filter(
    (group) => group.length > 0
  )

  if (actionGroups.length === 0) {
    return null
  }

  return (
    <ActionMenu
      groups={actionGroups.map((group) => ({ actions: group as Action[] }))}
    />
  )
}
