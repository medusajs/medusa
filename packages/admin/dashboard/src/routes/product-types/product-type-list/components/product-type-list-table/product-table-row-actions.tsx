import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteProductTypeAction } from "../../../common/hooks/use-delete-product-type-action"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import {
  useProductTypePermissions,
  useTranslationPermissions,
} from "../../../../../hooks/use-resource-permissions"

type ProductTypeRowActionsProps = {
  productType: HttpTypes.AdminProductType
}

export const ProductTypeRowActions = ({
  productType,
}: ProductTypeRowActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTypeAction(
    productType.id,
    productType.value
  )
  const isTranslationsEnabled = useFeatureFlag("translation")
  const { canUpdate, canDelete } = useProductTypePermissions()
  const { canUpdate: canUpdateTranslations } = useTranslationPermissions()

  const canManageTranslations =
    isTranslationsEnabled && canUpdateTranslations

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          label: t("actions.edit"),
          icon: <PencilSquare />,
          to: `/settings/product-types/${productType.id}/edit`,
        },
      ],
    })
  }

  if (canManageTranslations) {
    groups.push({
      actions: [
        {
          icon: <GlobeEurope />,
          label: t("translations.actions.manage"),
          to: `/settings/translations/edit?reference=product_type&reference_id=${productType.id}`,
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          label: t("actions.delete"),
          icon: <Trash />,
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
