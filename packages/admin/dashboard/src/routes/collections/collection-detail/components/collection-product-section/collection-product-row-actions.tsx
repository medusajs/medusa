import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useUpdateCollectionProducts } from "../../../../../hooks/api/collections"
import { usePermissions } from "../../../../../providers/permissions-provider"
import { useProductPermissions } from "../../../../../hooks/use-resource-permissions"

export const CollectionProductRowActions = ({
  product,
  collectionId,
}: {
  product: HttpTypes.AdminProduct
  collectionId: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { hasAllPermissions } = usePermissions()
  const { canUpdate: canEditProduct } = useProductPermissions()
  const { mutateAsync } = useUpdateCollectionProducts(collectionId)

  const canManageCollectionProducts = hasAllPermissions([
    "product:update",
    "product_collection:update",
  ])

  const handleRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.removeSingleProductWarning", {
        title: product.title,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      { remove: [product.id] },
      {
        onSuccess: () => {
          toast.success(
            t("collections.products.remove.successToast", { count: 1 })
          )
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  const groups: ActionGroup[] = []

  if (canEditProduct) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/products/${product.id}/edit`,
        },
      ],
    })
  }

  if (canManageCollectionProducts) {
    groups.push({
      actions: [
        {
          icon: <Trash />,
          label: t("actions.remove"),
          onClick: handleRemove,
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
