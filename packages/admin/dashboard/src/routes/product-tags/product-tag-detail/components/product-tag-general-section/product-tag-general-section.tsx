import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteProductTagAction } from "../../../common/hooks/use-delete-product-tag-action"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { usePermissions } from "../../../../../providers/permissions-provider"

type ProductTagGeneralSectionProps = {
  productTag: HttpTypes.AdminProductTag
}

export const ProductTagGeneralSection = ({
  productTag,
}: ProductTagGeneralSectionProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTagAction({ productTag })
  const isTranslationsEnabled = useFeatureFlag("translation")
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission("product_tag:update")
  const canDelete = hasPermission("product_tag:delete")
  const canManageTranslations =
    isTranslationsEnabled && hasPermission("translation:update")

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
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
          to: `/settings/translations/edit?reference=product_tag&reference_id=${productTag.id}`,
          icon: <GlobeEurope />,
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

  return (
    <Container className="flex items-center justify-between">
      <div className="flex items-center gap-x-1.5">
        <span className="text-ui-fg-muted h1-core">#</span>
        <Heading>{productTag.value}</Heading>
      </div>
      {groups.length > 0 && <ActionMenu groups={groups} />}
    </Container>
  )
}
