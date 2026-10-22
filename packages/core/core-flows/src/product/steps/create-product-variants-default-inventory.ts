import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
} from "@medusajs/framework/utils"
import type { RemoteQueryFunction } from "@medusajs/framework/types"
import {
  IInventoryService,
  IProductModuleService,
  LinkDefinition,
} from "@medusajs/types"
import { createDefaultInventoryItem } from "../utils/create-default-inventory-item"

export const createProductVariantsDefaultInventoryStepId =
  "create-product-variants-default-inventory"

export type CreateProductVariantsDefaultInventoryStepInput = {
  variantIds: string[]
}

/**
 * Variants that already have an inventory item linked are left untouched, so
 * toggling `manage_inventory` off and back on does not stack duplicate items.
 */
async function getVariantIdsWithoutInventory(
  variantIds: string[],
  query: Omit<RemoteQueryFunction, symbol>
): Promise<string[]> {
  const { data: variantInventoryItems } = await query.graph({
    entity: "product_variant_inventory_item",
    fields: ["variant_id"],
    filters: {
      variant_id: variantIds,
    },
  })

  return arrayDifference(
    variantIds,
    variantInventoryItems.map((item) => item.variant_id)
  )
}

export const createProductVariantsDefaultInventoryStep = createStep(
  createProductVariantsDefaultInventoryStepId,
  async (
    data: CreateProductVariantsDefaultInventoryStepInput,
    { container }
  ) => {
    const variantIds = deduplicate(data.variantIds ?? []).filter(Boolean)

    if (!variantIds.length) {
      return new StepResponse(void 0)
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    const variantIdsWithoutInventory = await getVariantIdsWithoutInventory(
      variantIds,
      query
    )

    if (!variantIdsWithoutInventory.length) {
      return new StepResponse(void 0)
    }

    const productService: IProductModuleService = container.resolve(
      Modules.PRODUCT
    )

    const variants = await productService.listProductVariants({
      id: variantIdsWithoutInventory,
    })

    if (!variants.length) {
      return new StepResponse(void 0)
    }

    const inventoryService: IInventoryService = container.resolve(
      Modules.INVENTORY
    )

    const createdItems = await inventoryService.createInventoryItems(
      variants.map((variant) => createDefaultInventoryItem(variant))
    )

    const links: LinkDefinition[] = variants.map((variant, index) => ({
      [Modules.PRODUCT]: { variant_id: variant.id },
      [Modules.INVENTORY]: { inventory_item_id: createdItems[index].id },
      data: { required_quantity: 1 },
    }))

    await link.create(links)

    return new StepResponse(void 0, {
      inventoryItemIds: createdItems.map((item) => item.id),
      links,
    })
  },
  async (createdInventory, { container }) => {
    if (!createdInventory?.inventoryItemIds.length) {
      return
    }

    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const inventoryService = container.resolve(Modules.INVENTORY)

    await link.dismiss(createdInventory.links)
    await inventoryService.deleteInventoryItems(
      createdInventory.inventoryItemIds
    )
  }
)
