import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductOptionLazy } from "../../../../../hooks/api/product-options"
import { useResourcePermissions } from "../../../../../hooks/use-resource-permissions"

export const ProductOptionListTableActions = ({
  productOption,
}: {
  productOption: HttpTypes.AdminProductOption
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteProductOptionLazy()
  const { canUpdate, canDelete } = useResourcePermissions("product_option")

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("productOptions.delete.confirmation", {
        title: productOption.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(productOption.id, {
      onSuccess: () => {
        toast.success(t("productOptions.delete.successToast"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  if (!canUpdate && !canDelete) {
    return null
  }

  return (
    <ActionMenu
      groups={[
        ...(canUpdate
          ? [
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("actions.edit"),
                    onClick: () =>
                      navigate(`/product-options/${productOption.id}/edit`),
                  },
                ],
              },
            ]
          : []),
        ...(canDelete
          ? [
              {
                actions: [
                  {
                    icon: <Trash />,
                    label: t("actions.delete"),
                    onClick: handleDelete,
                  },
                ],
              },
            ]
          : []),
      ]}
    />
  )
}
