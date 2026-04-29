import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductTypeAction } from "../../../common/hooks/use-delete-product-type-action"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

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

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `/settings/product-types/${productType.id}/edit`,
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
                    to: `/settings/translations/edit?reference=product_type&reference_id=${productType.id}`,
                  },
                ],
              },
            ]
          : []),
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
