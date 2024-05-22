import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { ProductAttributeSection } from "./components/product-attribute-section"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductOptionSection } from "./components/product-option-section"
import { ProductSalesChannelSection } from "./components/product-sales-channel-section"
import { ProductVariantSection } from "./components/product-variant-section"
import { productLoader } from "./loader"

// import after from "medusa-admin:widgets/product/details/after"
// @ts-ignore - virtual module
// import obj from "virtual:config"
import before from "virtual:medusa/widgets/product/details/before"
// import sideAfter from "medusa-admin:widgets/product/details/side/after"
// import sideBefore from "medusa-admin:widgets/product/details/side/before"

import { useProduct } from "../../../hooks/api/products"
import { ProductOrganizationSection } from "./components/product-organization-section"

// TODO: Use product domain translations only
export const ProductDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >

  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(id!, undefined, {
    initialData: initialData,
  })

  if (isLoading || !product) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <ProductGeneralSection product={product} />
          <ProductMediaSection product={product} />
          <ProductOptionSection product={product} />
          <ProductVariantSection product={product} />
          {/* {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })} */}

          <div className="hidden lg:block">
            <JsonViewSection data={product} root="product" />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 lg:mt-0 lg:max-w-[400px]">
          {/* {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })} */}
          <ProductSalesChannelSection product={product} />
          <ProductOrganizationSection product={product} />
          <ProductAttributeSection product={product} />
          {/* {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })} */}

          <div className="lg:hidden">
            <JsonViewSection data={product} root="product" />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
