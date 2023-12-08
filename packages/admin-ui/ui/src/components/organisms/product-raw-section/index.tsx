import { Product } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import JSONView from "../../molecules/json-view"
import Section from "../section"

type Props = {
  product: Product
}

/** Temporary component, should be replaced with <RawJson /> but since the design is different we will use this to not break the existing design across admin. */
const ProductRawSection = ({ product }: Props) => {
  const { t } = useTranslation()
  return (
    <Section
      title={
        product.is_giftcard
          ? t("product-raw-section-raw-gift-card", "Raw Gift Card")
          : t("product-raw-section-raw-product", "Raw Product")
      }
    >
      <div className="pt-base">
        <JSONView data={product} />
      </div>
    </Section>
  )
}

export default ProductRawSection
