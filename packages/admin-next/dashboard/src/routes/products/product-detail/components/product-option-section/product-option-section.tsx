import { Product } from "@medusajs/medusa";
import { Container, Heading } from "@medusajs/ui";

type ProductOptionSectionProps = {
  product: Product;
};

export const ProductOptionSection = ({
  product,
}: ProductOptionSectionProps) => {
  return (
    <div>
      <Container>
        <Heading level="h2">Options</Heading>
      </Container>
    </div>
  );
};
