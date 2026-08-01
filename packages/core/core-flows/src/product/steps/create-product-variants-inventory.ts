import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { Link, Query } from "@medusajs/framework/modules-sdk"
import {
  IInventoryService,
  IProductModuleService,
  LinkDefinition,
} from "@medusajs/types"

export const createProductVariantsInventoryStepId =
  "create-product-variants-inventory"

export type CreateProductVariantsInventoryStepInput = {
  variantIds: string[]
}

/**
 * Variants that already have an inventory item linked are left untouched, so
 * toggling `manage_inventory` off and back on does not stack duplicate items.
 */
async function getVariantIdsWithoutInventory(
  variantIds: string[],
  query: Query
): Promise<string[]> {
  const { data: variantInventoryItems } = await query.graph({
    entity: "product_variant_inventory_item",
    fields: ["variant_id"],
    filters: {
      variant_id: variantIds,
    },
  })

  const linkedVariantIds = new Set(
    variantInventoryItems.map((item) => item.variant_id)
  )

  return variantIds.filter((variantId) => !linkedVariantIds.has(variantId))
}

export const createProductVariantsInventoryStep = createStep(
  createProductVariantsInventoryStepId,
  async (data: CreateProductVariantsInventoryStepInput, { container }) => {
    const variantIds = Array.from(new Set(data.variantIds ?? [])).filter(
      Boolean
    )

    if (!variantIds.length) {
      return new StepResponse(void 0)
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY) as Query
    const link = container.resolve(ContainerRegistrationKeys.LINK) as Link

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

    /**
     * Mirrors the default inventory item built by createProductVariantsWorkflow
     * when a variant is created with manage_inventory enabled.
     */
    const createdItems = await inventoryService.createInventoryItems(
      variants.map((variant) => ({
        sku: variant.sku ?? undefined,
        origin_country: variant.origin_country ?? undefined,
        mid_code: variant.mid_code ?? undefined,
        material: variant.material ?? undefined,
        weight: variant.weight ?? undefined,
        length: variant.length ?? undefined,
        height: variant.height ?? undefined,
        width: variant.width ?? undefined,
        title: variant.title,
        description: variant.title,
        hs_code: variant.hs_code ?? undefined,
        requires_shipping: true,
      }))
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
