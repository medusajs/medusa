import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateVariantInventoryItemDTO,
  IInventoryServiceNext,
  InventoryNext,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createInventoryItemsStepId = "create-inventory-items"
export const createInventoryItemsStep = createStep(
  createInventoryItemsStepId,
  async (data: CreateVariantInventoryItemDTO[], { container }) => {
    const inventoryService: IInventoryServiceNext = container.resolve(
      ModuleRegistrationName.INVENTORY
    )
    const variantItemDataMap: Record<
      string,
      InventoryNext.CreateInventoryItemInput[]
    > = {}
    const variantItemsMap: Record<string, InventoryNext.InventoryItemDTO[]> = {}

    for (const { variant_id, ...inventoryData } of data) {
      const array = variantItemDataMap[variant_id] || []

      array.push(inventoryData)
      variantItemDataMap[variant_id] = array
    }

    for (const [variantId, itemsData] of Object.entries(variantItemDataMap)) {
      const createdItems = await inventoryService.create(itemsData)

      variantItemsMap[variantId] = createdItems
    }

    const createdItems = Object.values(variantItemsMap).flat(1)

    return new StepResponse(
      variantItemsMap,
      createdItems.map((i) => i.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)
    await inventoryService!.delete(ids)
  }
)
