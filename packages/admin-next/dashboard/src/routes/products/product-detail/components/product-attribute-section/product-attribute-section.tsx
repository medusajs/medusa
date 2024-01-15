import { Product } from "@medusajs/medusa";
import { Container, Heading } from "@medusajs/ui";

type ProductAttributeSectionProps = {
  product: Product;
};

export const ProductAttributeSection = ({
  product,
}: ProductAttributeSectionProps) => {
  return (
    <div>
      <Container>
        <Heading level="h2">Attributes</Heading>
      </Container>
    </div>
  );
};
