import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ProductVariantDTO } from "@medusajs/types"
import { Thumbnail } from "../../../../../components/common/thumbnail"

type InventoryItemVariantsSectionProps = {
  variants: ProductVariantDTO[]
}

export const InventoryItemVariantsSection = ({
  variants,
}: InventoryItemVariantsSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("inventory.associatedVariants")}</Heading>
      </div>

      <div className="txt-small flex flex-col gap-2 px-2 pb-2">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thumbnail src={variant.product?.thumbnail} />
                <div>
                  <span>{variant.title}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
