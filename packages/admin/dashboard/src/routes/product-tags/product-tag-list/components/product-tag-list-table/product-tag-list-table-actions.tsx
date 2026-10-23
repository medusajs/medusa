import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useDeleteProductTagAction } from "../../../common/hooks/use-delete-product-tag-action"
import {
  useProductTagPermissions,
  useTranslationPermissions,
} from "../../../../../hooks/use-resource-permissions"

export const ProductTagListTableActions = ({
  productTag,
}: {
  productTag: HttpTypes.AdminProductTag
}) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTagAction({ productTag })
  const isTranslationsEnabled = useFeatureFlag("translation")

  const { canUpdate, canDelete } = useProductTagPermissions()
  const { canUpdate: canUpdateTranslations } = useTranslationPermissions()

  const canManageTranslations = isTranslationsEnabled && canUpdateTranslations

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `${productTag.id}/edit`,
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
          to: `/settings/translations/edit?reference=product_tag&reference_id=${productTag.id}`,
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
