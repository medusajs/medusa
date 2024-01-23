import { Product } from "@medusajs/medusa";
import { Container, Heading } from "@medusajs/ui";

type ProductMedisaSectionProps = {
  product: Product;
};

export const ProductMediaSection = ({ product }: ProductMedisaSectionProps) => {
  return (
    <div>
      <Container className="flex flex-col gap-y-4">
        <div>
          <Heading level="h2">Media</Heading>
        </div>
        {product.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((i) => {
              return (
                <div
                  className="overflow-hidden flex items-center justify-center h-24"
                  key={i.id}
                >
                  <img
                    src={i.url}
                    alt={`${product.title} image`}
                    className="h-full object-contain rounded-md"
                  />
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};
