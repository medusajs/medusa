import { ProductVariantDTO } from "@medusajs/types"
import { MedusaError } from "medusa-core-utils"

interface ConfirmInventoryPreparationInput {
  productVariantInventoryItems: {
    variant_id: string
    inventory_item_id: string
    required_quantity: number
  }[]
  items: { variant_id?: string; quantity: number }[]
  variants: ProductVariantDTO[]
  locationIds: string[]
}

export const prepareConfirmInventoryInput = ({
  productVariantInventoryItems,
  locationIds,
  items,
  variants,
}: ConfirmInventoryPreparationInput) => {
  if (!productVariantInventoryItems.length) {
    return []
  }

  const variantsMap = new Map<string, ProductVariantDTO>(
    variants.map((v) => [v.id, v])
  )

  const itemsToConfirm: {
    inventory_item_id: string
    required_quantity: number
    quantity: number
    location_ids: string[]
  }[] = []

  items.forEach((item) => {
    const variantInventoryItem = productVariantInventoryItems.find(
      (i) => i.variant_id === item.variant_id
    )

    const variant = variantsMap.get(item.variant_id!)

    if (!variantInventoryItem) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant ${item.variant_id} does not have any inventory items associated with it.`
      )
    }

    if (variant?.manage_inventory) {
      itemsToConfirm.push({
        inventory_item_id: variantInventoryItem.inventory_item_id,
        required_quantity: variantInventoryItem.required_quantity,
        quantity: item.quantity,
        location_ids: locationIds,
      })
    }
  })

  return itemsToConfirm
}
