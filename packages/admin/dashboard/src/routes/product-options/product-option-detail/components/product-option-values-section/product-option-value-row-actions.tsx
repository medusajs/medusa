import { Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductOptionValueLazy } from "../../../../../hooks/api"
import { usePermissions } from "../../../../../providers/permissions-provider"

export const ProductOptionValueRowActions = ({
  optionId,
  value,
}: {
  optionId: string
  value: HttpTypes.AdminProductOptionValue
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteProductOptionValueLazy(optionId)
  const { hasAllPermissions } = usePermissions()
  const canDelete = hasAllPermissions([
    "product_option:update",
    "product_option_value:delete",
  ])

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("productOptions.values.delete.confirmation", {
        value: value.value,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(value.id, {
      onSuccess: () => {
        toast.success(t("productOptions.values.delete.successToast"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  if (!canDelete) {
    return null
  }

  return (
    <ActionMenu
      groups={[
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
