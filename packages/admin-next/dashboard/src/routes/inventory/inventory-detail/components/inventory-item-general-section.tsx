import { Container, Heading } from "@medusajs/ui"

import { ActionMenu } from "../../../../components/common/action-menu"
import { InventoryItemRes } from "../../../../types/api-responses"
import { PencilSquare } from "@medusajs/icons"
import { SectionRow } from "../../../../components/common/section"
import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"

type InventoryItemGeneralSectionProps = {
  inventoryItem: InventoryItemRes["inventory_item"] & {
    variant: HttpTypes.AdminProductVariant | HttpTypes.AdminProductVariant[]
  }
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
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: "edit",
                },
              ],
            },
          ]}
        />
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
          inventoryItem.location_levels?.length
        )}
      />

      <SectionRow
        title={t("inventory.reserved")}
        value={getQuantityFormat(
          inventoryItem.reserved_quantity,
          inventoryItem.location_levels?.length
        )}
      />
      <SectionRow
        title={t("inventory.available")}
        value={getQuantityFormat(
          inventoryItem.stocked_quantity - inventoryItem.reserved_quantity,
          inventoryItem.location_levels?.length
        )}
      />
    </Container>
  )
}

const getQuantityFormat = (quantity: number, locations?: number) => {
  return `${quantity ?? "-"}
   ${quantity ? `across ${locations ?? "-"} locations` : ""}`
}
