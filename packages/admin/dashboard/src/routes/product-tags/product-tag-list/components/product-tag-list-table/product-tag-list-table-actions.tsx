import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useDeleteProductTagAction } from "../../../common/hooks/use-delete-product-tag-action"

export const ProductTagListTableActions = ({
  productTag,
}: {
  productTag: HttpTypes.AdminProductTag
}) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTagAction({ productTag })
  const isTranslationsEnabled = useFeatureFlag("translation")

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `${productTag.id}/edit`,
            },
          ],
        },
        ...(isTranslationsEnabled
          ? [
              {
                actions: [
                  {
                    icon: <GlobeEurope />,
                    label: t("translations.actions.manage"),
                    to: `/settings/translations/edit?reference=product_tag&reference_id=${productTag.id}`,
                  },
                ],
              },
            ]
          : []),
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
