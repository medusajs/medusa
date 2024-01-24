import { Product } from "@medusajs/medusa";
import { Container, Heading } from "@medusajs/ui";

type ProductVariantSectionProps = {
  product: Product;
};

export const ProductVariantSection = ({
  product,
}: ProductVariantSectionProps) => {
  return (
    <div>
      <Container>
        <Heading level="h2">Variants</Heading>
      </Container>
    </div>
  );
};
