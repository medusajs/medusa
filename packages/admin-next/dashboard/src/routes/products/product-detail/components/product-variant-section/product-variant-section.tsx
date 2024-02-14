import { PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductVariantSectionProps = {
  product: Product
}

export const ProductVariantSection = ({
  product,
}: ProductVariantSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.variants")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "variants",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
    </Container>
  )
}
