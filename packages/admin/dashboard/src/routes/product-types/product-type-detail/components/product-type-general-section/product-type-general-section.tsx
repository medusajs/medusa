import { GlobeEurope, PencilSquare, Trash } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import { Container, Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductTypeAction } from "../../../common/hooks/use-delete-product-type-action"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

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

  return (
    <Container className="flex items-center justify-between">
      <Heading>{productType.value}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("actions.edit"),
                icon: <PencilSquare />,
                to: "edit",
              },
            ],
          },
          ...(isTranslationsEnabled
            ? [
                {
                  actions: [
                    {
                      label: t("translations.actions.manage"),
                      to: `/settings/translations/edit?reference=product_type&reference_id=${productType.id}`,
                      icon: <GlobeEurope />,
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
    </Container>
  )
}
