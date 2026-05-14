import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { Link, Query } from "@medusajs/framework/modules-sdk"
import { LinkDefinition } from "@medusajs/types"

export const dismissProductVariantsInventoryStepId =
  "dismiss-product-variants-inventory"

export type DismissProductVariantsInventoryStepInput = {
  variantIds: string[]
}

async function dismissVariantsInventory(
  variantIds: string[],
  query: Query,
  link: Link
): Promise<Record<string, string[]>> {
  const dismissedVariantInventoryItems: Record<string, string[]> = {}
  if (!variantIds.length) {
    return dismissedVariantInventoryItems
  }

  const { data: variantInventoryItems } = await query.graph({
    entity: "product_variant_inventory_item",
    fields: ["inventory_item_id", "variant_id"],
    filters: {
      variant_id: variantIds,
    },
  })

  const variantInventoryItemsMap = new Map<string, string[]>()
  for (const item of variantInventoryItems) {
    variantInventoryItemsMap.set(item.variant_id, [
      ...(variantInventoryItemsMap.get(item.variant_id) ?? []),
      item.inventory_item_id,
    ])
  }

  const dismissLinks: LinkDefinition[] = []
  for (const variantId of variantIds) {
    if (!variantId) {
      continue
    }

    dismissedVariantInventoryItems[variantId] =
      variantInventoryItemsMap.get(variantId) ?? []

    for (const inventoryItemId of variantInventoryItemsMap.get(variantId) ??
      []) {
      dismissLinks.push({
        [Modules.PRODUCT]: { variant_id: variantId },
        [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
      })
    }
  }

  await link.dismiss(dismissLinks)

  return dismissedVariantInventoryItems
}

export const dismissProductVariantsInventoryStep = createStep(
  dismissProductVariantsInventoryStepId,
  async (data: DismissProductVariantsInventoryStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const variantIds = data.variantIds || []

    if (!variantIds.length) {
      return new StepResponse(void 0)
    }

    const dismissedVariantInventoryItems = await dismissVariantsInventory(
      variantIds,
      query as Query,
      link
    )
    return new StepResponse(void 0, dismissedVariantInventoryItems)
  },
  async (dismissedVariantInventoryItems, { container }) => {
    if (!dismissedVariantInventoryItems) {
      return
    }

    const linksToCreate: LinkDefinition[] = []
    for (const [variantId, inventoryItemIds] of Object.entries(
      dismissedVariantInventoryItems
    )) {
      for (const inventoryItemId of inventoryItemIds) {
        linksToCreate.push({
          [Modules.PRODUCT]: { variant_id: variantId },
          [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
        })
      }
    }

    const link = container.resolve(ContainerRegistrationKeys.LINK)
    await link.create(linksToCreate)
  }
)
