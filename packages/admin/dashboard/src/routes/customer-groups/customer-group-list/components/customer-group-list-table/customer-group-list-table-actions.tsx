import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCustomerGroupLazy } from "../../../../../hooks/api"

type CustomerGroupListTableActionsProps = {
  customerGroup: HttpTypes.AdminCustomerGroup
}

export const CustomerGroupListTableActions = ({
  customerGroup,
}: CustomerGroupListTableActionsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

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

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              onClick: () =>
                navigate(`/customer-groups/${customerGroup.id}/edit`),
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
