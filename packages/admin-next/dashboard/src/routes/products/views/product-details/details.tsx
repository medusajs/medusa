import { useAdminProduct } from "medusa-react";
import { useLoaderData, useParams } from "react-router-dom";

import { JsonView } from "../../../../components/common/json-view";
import { ProductAttributeSection } from "../../components/product-attribute-section";
import { ProductGeneralSection } from "../../components/product-general-section";
import { ProductMediaSection } from "../../components/product-media-section";
import { ProductOptionSection } from "../../components/product-option-section";
import { ProductSalesChannelSection } from "../../components/product-sales-channel-section";
import { ProductThumbnailSection } from "../../components/product-thumbnail-section";
import { ProductVariantSection } from "../../components/product-variant-section";
import { productLoader } from "./loader";

import after from "medusa-admin:widgets/product/details/after";
import before from "medusa-admin:widgets/product/details/before";
import sideAfter from "medusa-admin:widgets/product/details/side/after";
import sideBefore from "medusa-admin:widgets/product/details/side/before";

export const ProductDetails = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >;

  const { id } = useParams();
  const { product, isLoading, isError, error } = useAdminProduct(
    id!,
    undefined,
    {
      initialData: initialData,
    }
  );

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading) {
    return <div>Loading</div>;
  }

  // TODO: Move to error.tsx and set as ErrorBoundary for the route
  if (isError || !product) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null;
    return (
      <div>
        {(err as Error & { status: number })?.status === 404 ? (
          <div>Not found</div>
        ) : (
          <div>Something went wrong!</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        );
      })}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-x-4">
        <div className="flex flex-col gap-y-2">
          <ProductGeneralSection product={product} />
          <ProductSalesChannelSection product={product} />
          <ProductOptionSection product={product} />
          <ProductVariantSection product={product} />
          <ProductAttributeSection product={product} />
          <div className="flex flex-col gap-y-2 lg:hidden">
            {sideBefore.widgets.map((w, i) => {
              return (
                <div key={i}>
                  <w.Component />
                </div>
              );
            })}
            <ProductThumbnailSection product={product} />
            <ProductMediaSection product={product} />
            {sideAfter.widgets.map((w, i) => {
              return (
                <div key={i}>
                  <w.Component />
                </div>
              );
            })}
          </div>
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            );
          })}
          <JsonView data={product} root="product" />
        </div>
        <div className="lg:flex flex-col gap-y-2 hidden">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            );
          })}
          <ProductThumbnailSection product={product} />
          <ProductMediaSection product={product} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
