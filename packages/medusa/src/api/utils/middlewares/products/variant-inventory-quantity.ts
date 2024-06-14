import {
  ContainerRegistrationKeys,
  LINKS,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest } from "../../../../types/routing"

export async function getVariantInventoryItems({
  req,
  variantIds,
  additionalFilters = {},
  asMap = true,
}) {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const linkQuery = remoteQueryObjectFromString({
    service: LINKS.ProductVariantInventoryItem,
    variables: {
      filters: {
        variant_id: variantIds,
      },
      ...additionalFilters,
    },
    fields: [
      "variant_id",
      "variant.manage_inventory",
      "required_quantity",
      "inventory.*",
      "inventory.location_levels.*",
    ],
  })

  const links = await remoteQuery(linkQuery)

  if (!asMap) {
    return links
  }

  const variantInventoriesMap = new Map()

  links.forEach((link) => {
    const array = variantInventoriesMap.get(link.variant_id) || []

    array.push(link)

    variantInventoriesMap.set(link.variant_id, array)
  })

  return variantInventoriesMap
}

export async function computeVariantInventoryQuantity({
  variantInventoryItems,
}) {
  const links = variantInventoryItems
  const inventoryQuantities: number[] = []

  for (const link of links) {
    const requiredQuantity = link.required_quantity
    const availableQuantity = (link.inventory?.location_levels || []).reduce(
      (sum, level) => sum + (level?.available_quantity || 0),
      0
    )

    // This will give us the maximum deliverable quantities for each inventory item
    const maxInventoryQuantity = Math.floor(
      availableQuantity / requiredQuantity
    )

    inventoryQuantities.push(maxInventoryQuantity)
  }

  // Since each of these inventory items need to be available to perform an order,
  // we pick the smallest of the deliverable quantities as the total inventory quantity.
  return inventoryQuantities.length ? Math.min(...inventoryQuantities) : 0
}

export const wrapVariantsWithInventoryQuantity = async (
  req: MedusaRequest,
  variants: {
    id: string
    inventory_quantity?: number
    manage_inventory?: boolean
  }[]
) => {
  variants ??= []
  const variantIds = variants.map((variant) => variant.id).flat(1)

  if (!variantIds.length) {
    return
  }

  const variantInventoriesMap = await getVariantInventoryItems({
    req,
    variantIds,
  })

  for (const variant of variants) {
    if (!variant.manage_inventory) {
      continue
    }

    const links = variantInventoriesMap.get(variant.id) || []
    variant.inventory_quantity = await computeVariantInventoryQuantity({
      variantInventoryItems: links,
    })
  }
}
