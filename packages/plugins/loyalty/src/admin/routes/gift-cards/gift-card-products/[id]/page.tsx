import { Outlet, useParams } from "react-router-dom";

import { JsonViewSection } from "../../../../components/json-view-section";
import { TwoColumnLayout } from "../../../../components/layouts/two-column";
import { useProduct } from "../../../../hooks/api/products";
import { ProductGeneralSection } from "./components/product-general-section";
import { ProductMediaSection } from "./components/product-media-section";
import { ProductSalesChannelSection } from "./components/product-sales-channel-section";
import { ProductVariantSection } from "./components/product-variant-section";

export const ProductDetail = () => {
  const { id } = useParams();
  const { product, isLoading, isError, error } = useProduct(id!);

  if (isLoading || !product) {
    return;
  }

  if (isError) {
    throw error;
  }

  return (
    <>
      <TwoColumnLayout
        firstCol={
          <>
            <ProductGeneralSection product={product} />
            <ProductVariantSection product={product} />

            <JsonViewSection data={product} />
          </>
        }
        secondCol={
          <>
            <ProductSalesChannelSection product={product} />
            <ProductMediaSection product={product} />
          </>
        }
      />

      <Outlet />
    </>
  );
};

export default ProductDetail;
