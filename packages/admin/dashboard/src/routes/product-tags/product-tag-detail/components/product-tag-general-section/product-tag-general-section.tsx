import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductTagAction } from "../../../common/hooks/use-delete-product-tag-action"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

type ProductTagGeneralSectionProps = {
  productTag: HttpTypes.AdminProductTag
}

export const ProductTagGeneralSection = ({
  productTag,
}: ProductTagGeneralSectionProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTagAction({ productTag })
  const isTranslationsEnabled = useFeatureFlag("translation")

  return (
    <Container className="flex items-center justify-between">
      <div className="flex items-center gap-x-1.5">
        <span className="text-ui-fg-muted h1-core">#</span>
        <Heading>{productTag.value}</Heading>
      </div>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: t("actions.edit"),
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
                      to: `/settings/translations/edit?reference=product_tag&reference_id=${productTag.id}`,
                      icon: <GlobeEurope />,
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
    </Container>
  )
}
