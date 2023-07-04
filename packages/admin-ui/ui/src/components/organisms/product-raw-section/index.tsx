import { Product } from "@medusajs/medusa"
import JSONView from "../../molecules/json-view"
import Section from "../section"

type Props = {
  product: Product
}

/** Temporary component, should be replaced with <RawJson /> but since the design is different we will use this to not break the existing design across admin. */
const ProductRawSection = ({ product }: Props) => {
  return (
    <Section title={product.is_giftcard ? "Raw Gift Card" : "Raw Product"}>
      <div className="pt-base">
        <JSONView data={product} />
      </div>
    </Section>
  )
}

export default ProductRawSection
