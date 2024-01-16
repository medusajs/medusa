import { Product } from "@medusajs/medusa";
import { Container, Heading } from "@medusajs/ui";

type ProductThumbnailSectionProps = {
  product: Product;
};

export const ProductThumbnailSection = ({
  product,
}: ProductThumbnailSectionProps) => {
  return (
    <div>
      <Container className="flex flex-col gap-y-4">
        <div>
          <Heading level="h2">Thumbnail</Heading>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {product.thumbnail && (
            <div className="overflow-hidden flex items-center justify-center h-24">
              <img
                src={product.thumbnail}
                alt={`${product.title} thumbnail`}
                className="h-full object-contain rounded-md"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
