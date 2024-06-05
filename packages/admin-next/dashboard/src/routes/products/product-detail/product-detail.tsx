import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useProduct } from "../../../hooks/api/products"
import { ProductAttributeSection } from "./components/product-attribute-section"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductOptionSection } from "./components/product-option-section"
import { ProductOrganizationSection } from "./components/product-organization-section"
import { ProductSalesChannelSection } from "./components/product-sales-channel-section"
import { ProductVariantSection } from "./components/product-variant-section"
import { PRODUCT_DETAIL_FIELDS } from "./constants"
import { productLoader } from "./loader"

import after from "virtual:medusa/widgets/product/details/after"
import before from "virtual:medusa/widgets/product/details/before"
import sideAfter from "virtual:medusa/widgets/product/details/side/after"
import sideBefore from "virtual:medusa/widgets/product/details/side/before"

export const ProductDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >

  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(
    id!,
    { fields: PRODUCT_DETAIL_FIELDS },
    {
      initialData: initialData,
    }
  )

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
            <w.Component data={product} />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">
          <ProductGeneralSection product={product} />
          <ProductMediaSection product={product} />
          <ProductOptionSection product={product} />
          <ProductVariantSection product={product} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={product} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={product} root="product" />
          </div>
        </div>
        <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[400px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={product} />
              </div>
            )
          })}
          <ProductSalesChannelSection product={product} />
          <ProductOrganizationSection product={product} />
          <ProductAttributeSection product={product} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={product} />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={product} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
