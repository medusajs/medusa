import { ConfirmVariantInventoryWorkflowInputDTO } from "@medusajs/types"
import { MedusaError, deepFlatMap } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { confirmInventoryStep } from "../steps"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"

interface Output {
  items: {
    id?: string
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: number
    location_ids: string[]
  }[]
}

export const confirmVariantInventoryWorkflowId = "confirm-item-inventory"
export const confirmVariantInventoryWorkflow = createWorkflow(
  confirmVariantInventoryWorkflowId,
  (
    input: WorkflowData<ConfirmVariantInventoryWorkflowInputDTO>
  ): WorkflowResponse<Output> => {
    const confirmInventoryInput = transform({ input }, (data) => {
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

      const items = prepareConfirmInventoryInput({
        product_variant_inventory_items: Array.from(
          productVariantInventoryItems.values()
        ),
        location_ids: Array.from(stockLocationIds),
        items: data.input.items,
        variants: Array.from(allVariants.values()),
      })

      return { items }
    })

    when({ input }, ({ input }) => {
      return !input.skipInventoryCheck
    }).then(() => {
      confirmInventoryStep(confirmInventoryInput)
    })

    return new WorkflowResponse(confirmInventoryInput)
  }
)
