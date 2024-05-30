import { InventoryItemDTO, MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest } from "../../../types/routing"
import { refetchEntity } from "../../utils/refetch-entity"

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("product", idOrFilter, scope, fields)
}

type VariantInventoryType = {
  variant_id: string
  variant: { manage_inventory: boolean }
  required_quantity: number
  inventory: InventoryItemDTO
}

export const wrapVariantsWithInventoryQuantity = async (
  req: MedusaRequest,
  variants: {
    id: string
    inventory_quantity?: number
    manage_inventory?: boolean
  }[]
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variantIds = variants.map((variant) => variant.id).flat(1)

  if (!variantIds.length) {
    return
  }

  if (!req.context?.stock_location_id?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Stock locations are required to compute inventory`
    )
  }

  const linkQuery = remoteQueryObjectFromString({
    entryPoint: "product_variant_inventory_item",
    variables: {
      filters: { variant_id: variantIds },
      inventory: {
        filters: {
          location_levels: {
            location_id: req.context?.stock_location_id || [],
          },
        },
      },
    },
    fields: [
      "variant_id",
      "variant.manage_inventory",
      "required_quantity",
      "inventory.*",
      "inventory.location_levels.*",
    ],
  })

  const links: VariantInventoryType[] = await remoteQuery(linkQuery)
  const variantInventoriesMap = new Map<string, VariantInventoryType[]>()

  links.forEach((link) => {
    const array: VariantInventoryType[] =
      variantInventoriesMap.get(link.variant_id) || []

    array.push(link)

    variantInventoriesMap.set(link.variant_id, array)
  })

  for (const variant of variants || []) {
    if (!variant.manage_inventory) {
      continue
    }

    const links = variantInventoriesMap.get(variant.id) || []
    const inventoryQuantities: number[] = []

    for (const link of links) {
      const requiredQuantity = link.required_quantity
      const availableQuantity = (link.inventory.location_levels || []).reduce(
        (sum, level) => sum + level.available_quantity || 0,
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
    variant.inventory_quantity = inventoryQuantities.length
      ? Math.min(...inventoryQuantities)
      : 0
  }
}
