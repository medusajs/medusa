import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useProductVariant } from "../../../hooks/api/products"

import { variantLoader } from "./loader"
import { VARIANT_DETAIL_FIELDS } from "./constants"
import { VariantGeneralSection } from "./components/variant-general-section"
import { VariantInventorySection } from "./components/variant-inventory-section"
import { VariantPricesSection } from "./components/variant-prices-section"

export const ProductVariantDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof variantLoader>
  >

  const { id, variant_id } = useParams()
  const { variant, isLoading, isError, error } = useProductVariant(
    id!,
    variant_id,
    { fields: VARIANT_DETAIL_FIELDS },
    {
      initialData: initialData,
    }
  )

  if (isLoading || !variant) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">
          <VariantGeneralSection variant={variant} />
          <VariantInventorySection
            inventoryItems={variant.inventory_items.map((i) => {
              return {
                ...i.inventory,
                required_quantity: i.required_quantity,
                variant,
              }
            })}
          />

          <div className="hidden xl:block">
            <JsonViewSection data={variant} root="product" />
          </div>
        </div>

        <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[400px]">
          <VariantPricesSection variant={variant} />

          <div className="xl:hidden">
            <JsonViewSection data={variant} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
