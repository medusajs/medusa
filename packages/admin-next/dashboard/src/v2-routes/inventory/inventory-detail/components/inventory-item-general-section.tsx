import { Container, Heading, Text } from "@medusajs/ui"

import { InventoryItemRes } from "../../../../types/api-responses"
import { SectionRow } from "../../../../components/common/section"
import { useTranslation } from "react-i18next"

type InventoryItemGeneralSectionProps = {
  inventoryItem: InventoryItemRes["inventory_item"]
}
export const InventoryItemGeneralSection = ({
  inventoryItem,
}: InventoryItemGeneralSectionProps) => {
  const { t } = useTranslation()

  const variantArray = inventoryItem.variant
    ? Array.isArray(inventoryItem.variant)
      ? inventoryItem.variant
      : [inventoryItem.variant]
    : []

  const variantTitles = variantArray.map((variant) => variant.title)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{inventoryItem.title ?? inventoryItem.sku}</Heading>
      </div>
      <SectionRow title={t("fields.sku")} value={inventoryItem.sku ?? "-"} />
      <SectionRow
        title={t("inventory.associatedVariants")}
        value={variantTitles?.length ? variantTitles.join(", ") : "-"}
      />
      <SectionRow
        title={t("fields.inStock")}
        value={getQuantityFormat(
          inventoryItem.stocked_quantity,
          inventoryItem.location_levels.length
        )}
      />

      <SectionRow
        title={t("inventory.reserved")}
        value={getQuantityFormat(
          inventoryItem.reserved_quantity,
          inventoryItem.location_levels.length
        )}
      />
      <SectionRow
        title={t("inventory.available")}
        value={getQuantityFormat(
          inventoryItem.stocked_quantity - inventoryItem.reserved_quantity,
          inventoryItem.location_levels.length
        )}
      />
    </Container>
  )
}

const getQuantityFormat = (quantity: number, locations: number) => {
  return `${quantity ?? "-"}
   ${quantity ? `across ${locations} locations` : ""}`
}
