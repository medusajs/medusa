import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteProductTypeAction } from "../../../common/hooks/use-delete-product-type-action"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { usePermissions } from "../../../../../providers/permissions-provider"

type ProductTypeGeneralSectionProps = {
  productType: HttpTypes.AdminProductType
}

export const ProductTypeGeneralSection = ({
  productType,
}: ProductTypeGeneralSectionProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTypeAction(
    productType.id,
    productType.value
  )
  const isTranslationsEnabled = useFeatureFlag("translation")
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission("product_type:update")
  const canDelete = hasPermission("product_type:delete")
  const canManageTranslations =
    isTranslationsEnabled && hasPermission("translation:update")

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          label: t("actions.edit"),
          icon: <PencilSquare />,
          to: "edit",
        },
      ],
    })
  }

  if (canManageTranslations) {
    groups.push({
      actions: [
        {
          label: t("translations.actions.manage"),
          to: `/settings/translations/edit?reference=product_type&reference_id=${productType.id}`,
          icon: <GlobeEurope />,
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

  return (
    <Container className="flex items-center justify-between">
      <Heading>{productType.value}</Heading>
      {groups.length > 0 && <ActionMenu groups={groups} />}
    </Container>
  )
}
