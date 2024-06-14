import { Container, Heading, IconButton } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import { useNavigate } from "react-router-dom"

import { ProductVariantDTO } from "@medusajs/types"
import { Thumbnail } from "../../../../../components/common/thumbnail"

type InventoryItemVariantsSectionProps = {
  variants: ProductVariantDTO[]
}

export const InventoryItemVariantsSection = ({
  variants,
}: InventoryItemVariantsSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!variants?.length) {
    return null
  }

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
            <div className="flex items-center gap-3">
              <div className="shadow-elevation-card-rest rounded-md">
                <Thumbnail src={variant.product?.thumbnail} />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-ui-fg-base font-medium">
                  {variant.title}
                </span>
                <span className="text-ui-fg-subtle">
                  {variant.options.map((o) => o.value).join(" ⋅ ")}
                </span>
              </div>
              <IconButton
                size="2xsmall"
                variant="transparent"
                type="button"
                onClick={() => navigate(`/products/${variant.product.id}`)} // TODO: navigate to variant details when implemented
              >
                <ArrowUpRightOnBox className="text-ui-fg-muted" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
