import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useInventoryItem } from "../../../hooks/api/inventory"
import { InventoryItemAttributeSection } from "./components/inventory-item-attributes/attributes-section"
import { InventoryItemGeneralSection } from "./components/inventory-item-general-section"
import { InventoryItemLocationLevelsSection } from "./components/inventory-item-location-levels"
import { InventoryItemReservationsSection } from "./components/inventory-item-reservations"
import { InventoryItemVariantsSection } from "./components/inventory-item-variants/variants-section"
import { inventoryItemLoader } from "./loader"

import after from "virtual:medusa/widgets/inventory_item/details/after"
import before from "virtual:medusa/widgets/inventory_item/details/before"
import sideAfter from "virtual:medusa/widgets/inventory_item/details/side/after"
import sideBefore from "virtual:medusa/widgets/inventory_item/details/side/before"

export const InventoryDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof inventoryItemLoader>
  >

  const {
    inventory_item,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(
    id!,
    {
      fields: "*variants,*variants.product,*variants.options",
    },
    {
      initialData,
    }
  )

  if (isLoading || !inventory_item) {
    return (
      <TwoColumnPageSkeleton
        showJSON
        showMetadata
        mainSections={3}
        sidebarSections={2}
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      data={inventory_item}
      showJSON
      showMetadata
      hasOutlet
    >
      <TwoColumnPage.Main>
        <InventoryItemGeneralSection inventoryItem={inventory_item} />
        <InventoryItemLocationLevelsSection inventoryItem={inventory_item} />
        <InventoryItemReservationsSection inventoryItem={inventory_item} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <InventoryItemVariantsSection
          variants={(inventory_item as any).variants}
        />
        <InventoryItemAttributeSection inventoryItem={inventory_item as any} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
