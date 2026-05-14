import { useLoaderData, useParams } from "react-router-dom"

import { useProductVariant } from "../../../hooks/api/products"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { VariantGeneralSection } from "./components/variant-general-section"
import {
  InventorySectionPlaceholder,
  VariantInventorySection,
} from "./components/variant-inventory-section"
import { VariantMediaSection } from "./components/variant-media-section"
import { VariantPricesSection } from "./components/variant-prices-section"
import { ExtendedVariant, VARIANT_DETAIL_FIELDS } from "./constants"
import { variantLoader } from "./loader"

export const ProductVariantDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof variantLoader>
  >

  const { id, variant_id } = useParams()
  const { variant, isLoading, isError, error } = useProductVariant(
    id!,
    variant_id!,
    { fields: VARIANT_DETAIL_FIELDS },
    {
      initialData,
    }
  )

  const { getWidgets } = useExtension()

  if (isLoading || !variant) {
    return (
      <TwoColumnPageSkeleton
        mainSections={2}
        sidebarSections={1}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      data={variant}
      hasOutlet
      showJSON
      showMetadata
      widgets={{
        after: getWidgets("product_variant.details.after"),
        before: getWidgets("product_variant.details.before"),
        sideAfter: getWidgets("product_variant.details.side.after"),
        sideBefore: getWidgets("product_variant.details.side.before"),
      }}
    >
      <TwoColumnPage.Main>
        <VariantGeneralSection variant={variant as ExtendedVariant} />
        <VariantMediaSection variant={variant as ExtendedVariant} />
        {!variant.manage_inventory ? (
          <InventorySectionPlaceholder />
        ) : (
          <VariantInventorySection
            inventoryItems={(variant.inventory_items ?? [])
              .filter((i) => i.inventory)
              .map((i) => {
                return {
                  ...i.inventory!,
                  required_quantity: i.required_quantity,
                  variant,
                }
              })}
          />
        )}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <VariantPricesSection variant={variant as ExtendedVariant} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
