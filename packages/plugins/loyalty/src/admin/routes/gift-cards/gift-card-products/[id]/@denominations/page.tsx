import { Heading } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import { RouteDrawer } from "../../../../../components/modals";
import { EDIT_GIFT_CARD_DENOMINATIONS_PERMISSIONS } from "../../../../../lib/permissions";
import { useProduct } from "../../../../../hooks/api/products";
import { GiftCardProductEditDenominationsForm } from "./components/gift-card-product-edit-denominations-form";

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
          <Heading>Edit gift cards denominations</Heading>
        </RouteDrawer.Title>

        <RouteDrawer.Description className="sr-only">
          Edit the gift card denominations
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {!isLoading && product && (
        <GiftCardProductEditDenominationsForm product={product} />
      )}
    </RouteDrawer>
  );
};

export const handle = {
  permissions: EDIT_GIFT_CARD_DENOMINATIONS_PERMISSIONS,
};

export default GiftCardProductEdit;
