import {
  BigNumberInput,
  ConfirmVariantInventoryWorkflowInputDTO,
} from "@medusajs/framework/types"
import { MedusaError, deepFlatMap } from "@medusajs/framework/utils"

interface ConfirmInventoryPreparationInput {
  product_variant_inventory_items: {
    variant_id: string
    inventory_item_id: string
    required_quantity: number
  }[]
  items: {
    id?: string
    variant_id?: string | null
    quantity: BigNumberInput
  }[]
  variants: {
    id: string
    manage_inventory?: boolean
    allow_backorder?: boolean
  }[]
  location_ids: string[]
}

interface ConfirmInventoryItem {
  id?: string
  inventory_item_id: string
  required_quantity: number
  allow_backorder: boolean
  quantity: BigNumberInput
  location_ids: string[]
}

export const prepareConfirmInventoryInput = (data: {
  input: ConfirmVariantInventoryWorkflowInputDTO
}) => {
  const productVariantInventoryItems = new Map<string, any>()
  const stockLocationIds = new Set<string>()
  const allVariants = new Map<string, any>()
  let hasSalesChannelStockLocation = false
  let hasManagedInventory = false

  const salesChannelId = data.input.sales_channel_id

  for (const updateItem of data.input.itemsToUpdate ?? []) {
    const item = data.input.items.find(
      (item) => item.variant_id === updateItem.data.variant_id
    )
    if (item && updateItem.data.quantity) {
      item.quantity = updateItem.data.quantity!
    }
  }

  deepFlatMap(
    data.input,
    "variants.inventory_items.inventory.location_levels.stock_locations.sales_channels",
    ({ variants, inventory_items, stock_locations, sales_channels }) => {
      if (!variants) {
        return
      }

      if (
        !hasSalesChannelStockLocation &&
        sales_channels?.id === salesChannelId
      ) {
        hasSalesChannelStockLocation = true
      }

      if (stock_locations) {
        stockLocationIds.add(stock_locations.id)
      }

      if (inventory_items) {
        const inventoryItemId = inventory_items.inventory_item_id
        if (!productVariantInventoryItems.has(inventoryItemId)) {
          productVariantInventoryItems.set(inventoryItemId, {
            variant_id: inventory_items.variant_id,
            inventory_item_id: inventoryItemId,
            required_quantity: inventory_items.required_quantity,
          })
        }
      }

      if (!allVariants.has(variants.id)) {
        if (!hasManagedInventory && variants.manage_inventory) {
          hasManagedInventory = true
        }

        allVariants.set(variants.id, {
          id: variants.id,
          manage_inventory: variants.manage_inventory,
          allow_backorder: variants.allow_backorder,
        })
      }
    }
  )

  if (!hasManagedInventory) {
    return { items: [] }
  }

  if (salesChannelId && !hasSalesChannelStockLocation) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Sales channel ${salesChannelId} is not associated with any stock location.`
    )
  }

  const items = formatInventoryInput({
    product_variant_inventory_items: Array.from(
      productVariantInventoryItems.values()
    ),
    location_ids: Array.from(stockLocationIds),
    items: data.input.items,
    variants: Array.from(allVariants.values()),
  })

  return { items }
}

const formatInventoryInput = ({
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
    ConfirmInventoryPreparationInput["variants"][0]
  >(variants.map((v) => [v.id, v]))

  const itemsToConfirm: ConfirmInventoryItem[] = []

  items.forEach((item) => {
    const variant = variantsMap.get(item.variant_id!)

    if (!variant?.manage_inventory) {
      return
    }

    const variantInventoryItems = product_variant_inventory_items.filter(
      (i) => i.variant_id === item.variant_id
    )

    if (!variantInventoryItems.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant ${item.variant_id} does not have any inventory items associated with it.`
      )
    }

    variantInventoryItems.forEach((variantInventoryItem) =>
      itemsToConfirm.push({
        id: item.id,
        inventory_item_id: variantInventoryItem.inventory_item_id,
        required_quantity: variantInventoryItem.required_quantity,
        allow_backorder: !!variant.allow_backorder,
        quantity: item.quantity,
        location_ids: location_ids,
      })
    )
  })

  return itemsToConfirm
}
