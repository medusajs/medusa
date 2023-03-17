import { Product } from "@medusajs/medusa"
import JSONView from "../../../../../components/molecules/json-view"
import Section from "../../../../../components/organisms/section"

type Props = {
  product: Product
}

/** Temporary component, should be replaced with <RawJson /> but since the design is different we will use this to not break the existing design across admin. */
const RawSection = ({ product }: Props) => {
  return (
    <Section title="Raw Product">
      <div className="pt-base">
        <JSONView data={product} />
      </div>
    </Section>
  )
}

export default RawSection
