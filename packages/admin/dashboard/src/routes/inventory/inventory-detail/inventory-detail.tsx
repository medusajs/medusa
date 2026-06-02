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

import { useExtension } from "../../../providers/extension-provider"
import { PermissionGuard } from "../../../components/common/permission-guard"
import { INVENTORY_DETAIL_FIELDS } from "./constants"

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
      fields: INVENTORY_DETAIL_FIELDS,
    },
    {
      initialData,
    }
  )

  const { getWidgets } = useExtension()

  if (isLoading || !inventory_item) {
    return (
      <TwoColumnPageSkeleton
        showJSON
        mainSections={3}
        sidebarSections={2}
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("inventory_item.details.after"),
        before: getWidgets("inventory_item.details.before"),
        sideAfter: getWidgets("inventory_item.details.side.after"),
        sideBefore: getWidgets("inventory_item.details.side.before"),
      }}
      data={inventory_item}
      showJSON
      showMetadata
      showRequiredPermissions
    >
      <TwoColumnPage.Main>
        <InventoryItemGeneralSection inventoryItem={inventory_item} />
        <PermissionGuard
          permissions={["inventory_level:read", "stock_location:read"]}
        >
          <InventoryItemLocationLevelsSection inventoryItem={inventory_item} />
        </PermissionGuard>
        <PermissionGuard permission="reservation_item:read">
          <InventoryItemReservationsSection inventoryItem={inventory_item} />
        </PermissionGuard>
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <PermissionGuard permissions={["product:read", "product_variant:read"]}>
          <InventoryItemVariantsSection
            variants={(inventory_item as any).variants}
          />
        </PermissionGuard>
        <InventoryItemAttributeSection inventoryItem={inventory_item as any} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
