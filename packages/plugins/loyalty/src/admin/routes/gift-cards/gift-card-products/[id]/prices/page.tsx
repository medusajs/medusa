import { useParams } from "react-router-dom";
import { RouteFocusModal } from "../../../../../components/modals";
import { useProduct } from "../../../../../hooks/api/products";
import { PricingEdit } from "./components/prices-edit";

export const ProductPrices = () => {
  const { id, variant_id } = useParams();

  const { product, isLoading, isError, error } = useProduct(id!);

  if (isError) {
    throw error;
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && (
        <PricingEdit product={product} variantId={variant_id} />
      )}
    </RouteFocusModal>
  );
};

export default ProductPrices;
