import { MedusaError } from "medusa-core-utils"

interface ConfirmInventoryPreparationInput {
  product_variant_inventory_items: {
    variant_id: string
    inventory_item_id: string
    required_quantity: number
  }[]
  items: { variant_id?: string; quantity: number }[]
  variants: { id: string; manage_inventory?: boolean }[]
  location_ids: string[]
}

interface ConfirmInventoryItem {
  inventory_item_id: string
  required_quantity: number
  quantity: number
  location_ids: string[]
}

export const prepareConfirmInventoryInput = ({
  product_variant_inventory_items,
  location_ids,
  items,
  variants,
}: ConfirmInventoryPreparationInput) => {
  if (!product_variant_inventory_items.length) {
    return []
  }

  const variantsMap = new Map<
    string,
    { id: string; manage_inventory?: boolean }
  >(variants.map((v) => [v.id, v]))

  const itemsToConfirm: ConfirmInventoryItem[] = []

  items.forEach((item) => {
    const variantInventoryItem = product_variant_inventory_items.find(
      (i) => i.variant_id === item.variant_id
    )

    if (!variantInventoryItem) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant ${item.variant_id} does not have any inventory items associated with it.`
      )
    }

    const variant = variantsMap.get(item.variant_id!)

    if (variant?.manage_inventory) {
      itemsToConfirm.push({
        inventory_item_id: variantInventoryItem.inventory_item_id,
        required_quantity: variantInventoryItem.required_quantity,
        quantity: item.quantity,
        location_ids: location_ids,
      })
    }
  })

  return itemsToConfirm
}
