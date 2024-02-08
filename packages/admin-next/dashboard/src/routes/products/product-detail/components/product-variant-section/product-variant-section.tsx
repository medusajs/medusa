import { Product } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"

type ProductVariantSectionProps = {
  product: Product
}

export const ProductVariantSection = ({
  product,
}: ProductVariantSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Variants</Heading>
      </div>
    </Container>
  )
}
