import { RemoteQueryFunction } from "@medusajs/types"

/**
 * The computed inventory availability for variants in a given sales channel.
 * The object's keys are the variant IDs.
 */
export type VariantAvailabilityResult = {
  [variant_id: string]: {
    /**
     * The available inventory quantity for the variant in the sales channel.
     */
    availability: number | null
    /**
     * The ID of the sales channel for which the availability was computed.
     */
    sales_channel_id: string
  }
}

/**
 * Computes the variant availability for a list of variants in a given sales channel
 *
 * The availability algorithm works as follows:
 * 1. For each variant, we retrieve its inventory items.
 * 2. We calculate the available quantity for each inventory item, considering only the stock locations associated with the given sales channel.
 * 3. For each inventory item, we calculate the maximum deliverable quantity by dividing the available quantity by the quantity required for the variant.
 * 4. We take the minimum of these maximum deliverable quantities across all inventory items for the variant.
 * 5. This minimum value represents the overall availability of the variant in the given sales channel.
 *
 * The algorithm takes into account:
 * - Variant inventory items: The inventory records associated with each variant.
 * - Required quantities: The quantity of each inventory item required to fulfill one unit of the variant.
 * - Sales channels: The specific sales channel for which we're calculating availability.
 * - Stock locations: The inventory locations associated with the sales channel.
 *
 * @param query - The Query function
 * @param data - An object containing the variant ids and the sales channel id to compute the availability for
 * @returns an object containing the variant ids and their availability
 */
export async function getVariantAvailability(
  query: Omit<RemoteQueryFunction, symbol>,
  data: VariantAvailabilityData
): Promise<VariantAvailabilityResult> {
  const { variantInventoriesMap, locationIds } = await getDataForComputation(
    query,
    data
  )

  return data.variant_ids.reduce((acc, variantId) => {
    const variantInventoryItems = variantInventoriesMap.get(variantId) || []
    acc[variantId] = {
      availability: computeVariantAvailability(
        variantInventoryItems,
        locationIds,
        { requireChannelCheck: true }
      ),
      sales_channel_id: data.sales_channel_id,
    }
    return acc
  }, {})
}

type TotalVariantAvailabilityData = {
  variant_ids: string[]
}

/**
 * Computes the total availability for a list of variants across all stock locations
 *
 * @param query - The Query function
 * @param data - An object containing the variant ids to compute the availability for
 * @returns the total availability for the given variants
 */
export async function getTotalVariantAvailability(
  query: Omit<RemoteQueryFunction, symbol>,
  data: TotalVariantAvailabilityData
): Promise<{
  [variant_id: string]: {
    availability: number | null
  }
}> {
  const { variantInventoriesMap, locationIds } = await getDataForComputation(
    query,
    data
  )

  return data.variant_ids.reduce((acc, variantId) => {
    const variantInventoryItems = variantInventoriesMap.get(variantId) || []
    acc[variantId] = {
      availability: computeVariantAvailability(
        variantInventoryItems,
        locationIds,
        { requireChannelCheck: false }
      ),
    }
    return acc
  }, {})
}

interface VariantItems {
  variant_id: string
  required_quantity: number
  variant: {
    manage_inventory: boolean
    allow_backorder: boolean
  }
  inventory: {
    location_levels: {
      location_id: string
      available_quantity: number
    }[]
  }
}

const computeVariantAvailability = (
  variantInventoryItems: VariantItems[],
  channelLocationsSet: Set<string>,
  { requireChannelCheck } = { requireChannelCheck: true }
): number | null => {
  const inventoryQuantities: number[] = []

  for (const link of variantInventoryItems) {
    const requiredQuantity = link.required_quantity
    const availableQuantity = (link.inventory?.location_levels || []).reduce(
      (sum, level) => {
        if (
          requireChannelCheck &&
          !channelLocationsSet.has(level.location_id)
        ) {
          return sum
        }

        return sum + (level?.available_quantity || 0)
      },
      0
    )

    // This will give us the maximum deliverable quantities for each inventory item
    const maxInventoryQuantity = Math.floor(
      availableQuantity / requiredQuantity
    )

    inventoryQuantities.push(maxInventoryQuantity)
  }

  return inventoryQuantities.length ? Math.min(...inventoryQuantities) : null
}

type VariantAvailabilityData = {
  variant_ids: string[]
  sales_channel_id: string
}

const getDataForComputation = async (
  query: Omit<RemoteQueryFunction, symbol>,
  data: { variant_ids: string[]; sales_channel_id?: string }
) => {
  const { data: variantInventoryItems } = await query.graph(
    {
      entity: "product_variant_inventory_items",
      fields: [
        "variant_id",
        "required_quantity",
        "variant.manage_inventory",
        "variant.allow_backorder",
        "inventory.*",
        "inventory.location_levels.*",
      ],
      filters: { variant_id: data.variant_ids },
    },
    {
      cache: {
        tags: [
          ...data.variant_ids.map((id) => `ProductVariant:${id}`),
          "InventoryItem:list:*",
        ],
      },
    }
  )

  const variantInventoriesMap = new Map()
  variantInventoryItems.forEach((link) => {
    const array = variantInventoriesMap.get(link.variant_id) || []
    array.push(link)
    variantInventoriesMap.set(link.variant_id, array)
  })

  const locationIds = new Set<string>()
  if (data.sales_channel_id) {
    const { data: channelLocations } = await query.graph(
      {
        entity: "sales_channel_locations",
        fields: ["stock_location_id"],
        filters: { sales_channel_id: data.sales_channel_id },
      },
      {
        cache: {
          tags: [
            `SalesChannel:${data.sales_channel_id}`,
            "StockLocation:list:*",
          ],
        },
      }
    )

    channelLocations.forEach((loc) => locationIds.add(loc.stock_location_id))
  }

  return { variantInventoriesMap, locationIds }
}
