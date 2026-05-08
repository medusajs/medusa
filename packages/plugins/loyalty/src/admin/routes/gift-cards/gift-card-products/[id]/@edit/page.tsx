import { Heading } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import { RouteDrawer } from "../../../../../components/modals";
import { useProduct } from "../../../../../hooks/api/products";
import { GiftCardProductEditForm } from "./components/gift-card-product-edit-form";

export const GiftCardProductEdit = () => {
  const { id } = useParams();

  const { product, isLoading, isError, error } = useProduct(id!, {});

  if (isError) {
    throw error;
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit gift card product</Heading>
        </RouteDrawer.Title>

        <RouteDrawer.Description className="sr-only">
          Edit the gift card product
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {!isLoading && product && <GiftCardProductEditForm product={product} />}
    </RouteDrawer>
  );
};

export default GiftCardProductEdit;
