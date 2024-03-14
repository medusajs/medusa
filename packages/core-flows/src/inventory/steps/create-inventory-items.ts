import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { CreateInventoryItemInput } from "@medusajs/types"
import { IInventoryServiceNext } from "@medusajs/types"
import { InventoryItemDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "../../../../modules-sdk/dist"
import { promiseAll } from "@medusajs/utils"

export const createInventoryItemsStepId = "create-inventory-items"
export const createInventoryItemsStep = createStep(
  createInventoryItemsStepId,
  async (
    data: (CreateInventoryItemInput & { tag?: string })[],
    { container }
  ) => {
    const inventoryService: IInventoryServiceNext = container.resolve(
      ModuleRegistrationName.INVENTORY
    )

    const createdItems: {
      inventoryItem: InventoryItemDTO
      tag?: string
    }[] = await promiseAll(
      data.map(async (item) => {
        const inventoryItem = await inventoryService.create({
          sku: item.sku,
          origin_country: item.origin_country,
          hs_code: item.hs_code,
          mid_code: item.mid_code,
          material: item.material,
          weight: item.weight,
          length: item.length,
          height: item.height,
          width: item.width,
        })

        return { tag: item.tag, inventoryItem }
      })
    )

    return new StepResponse(
      createdItems,
      createdItems.map((i) => i.inventoryItem.id)
    )
  },
  async (data: string[] | undefined, { container }) => {
    if (!data?.length) {
      return
    }

    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService!.delete(data)
  }
)
