import { Product } from "@medusajs/medusa"
import { JsonViewer } from "@textea/json-viewer"
import Section from "../../../../../components/organisms/section"

type Props = {
  product: Product
}

/** Temporary component, should be replaced with <RawJson /> but since the design is different we will use this to not break the existing design across admin. */
const RawSection = ({ product }: Props) => {
  return (
    <Section title="Raw Product">
      <div className="mt-base bg-grey-5 rounded-rounded px-base py-xsmall">
        <JsonViewer
          value={product}
          rootName="product"
          defaultInspectDepth={0}
        />
      </div>
    </Section>
  )
}

export default RawSection
