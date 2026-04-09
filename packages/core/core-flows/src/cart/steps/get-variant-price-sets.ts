import { MedusaContainer, Query } from "@medusajs/framework"
import {
  CalculatedPriceSet,
  IPricingModuleService,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the variants to get price sets for.
 */
export interface GetVariantPriceSetsStepInput {
  /**
   * The IDs of the variants to get price sets for.
   */
  variantIds: string[]
  /**
   * The context to use when calculating the price sets.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/product/guides/price#retrieve-calculated-price-for-a-context).
   */
  context?: Record<string, unknown>
}

/**
 * The details of the variants to get price sets for.
 */
export interface GetVariantPriceSetsStepBulkInput {
  /**
   * The variants to get price sets for.
   */
  data: {
    /**
     * The ID of the item.
     */
    id?: string
    /**
     * The ID of the variant to get the price set for.
     */
    variantId: string
    /**
     * The context to use when calculating the price set.
     */
    context?: Record<string, unknown>
  }[]
}

interface VariantPriceSetData {
  id: string
  price_set?: { id: string }
}

interface PriceCalculationItem {
  /**
   * The ID of the item. In case of variants we wont have an item id
   */
  id?: string
  variantId: string
  priceSetId: string
  context?: Record<string, unknown>
}

export interface GetVariantPriceSetsStepOutput {
  [k: string]: CalculatedPriceSet
}

export const getVariantPriceSetsStepId = "get-variant-price-sets"

async function fetchVariantPriceSets(
  query: Query,
  variantIds: string[]
): Promise<VariantPriceSetData[]> {
  return (
    await query.graph(
      {
        entity: "variant",
        fields: ["id", "price_set.id"],
        filters: { id: variantIds },
      },
      {
        cache: {
          enable: true,
        },
      }
    )
  ).data
}

/**
 * Validates that all variants without a custom price have price sets and throws error for missing ones
 */
function validateVariantPriceSets(
  variantPriceSets: VariantPriceSetData[],
  variantsWithCustomPrice: string[] = []
): void {
  const variantsWithCustomPriceSet = new Set(variantsWithCustomPrice)
  const notFound = variantPriceSets
    .filter((v) => !v.price_set?.id && !variantsWithCustomPriceSet.has(v.id))
    .map((v) => v.id)

  if (notFound.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Variants with IDs ${notFound.join(", ")} do not have a price`
    )
  }
}

/**
 * Unified function to process variants with context grouping optimization
 * TODO: to be discussed, support batch calculation from the pricing module. Currently
 * trying to mitigate the impact by grouping items by exact same context.
 */
async function processVariantPriceSets(
  pricingService: IPricingModuleService,
  items: PriceCalculationItem[],
  container: MedusaContainer
): Promise<GetVariantPriceSetsStepOutput> {
  const result: GetVariantPriceSetsStepOutput = {}

  // Group items by their context to minimize API calls
  const contextGroups = groupItemsByContext(items)

  for (const [, groupItems] of contextGroups) {
    const priceSetIds = groupItems.map((item) => item.priceSetId)
    const context = groupItems[0].context // All items in group have same context

    const calculatedPriceSets = await pricingService.calculatePrices(
      { id: priceSetIds },
      { context: context as Record<string, string | number> }
    )

    // Map calculated prices back to variants
    const priceSetMap = new Map(
      calculatedPriceSets.map((priceSet) => [priceSet.id, priceSet])
    )

    for (const item of groupItems) {
      const calculatedPriceSet = priceSetMap.get(item.priceSetId)
      if (calculatedPriceSet) {
        result[item.id ?? item.variantId] = calculatedPriceSet
      }
    }
  }

  return result
}

function createContextKey(context?: Record<string, unknown>): string {
  if (!context || Object.keys(context).length === 0) {
    return "no-context"
  }

  // Sort keys to ensure consistent grouping regardless of key order
  const sortedEntries = Object.entries(context)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${JSON.stringify(value)}`)

  return sortedEntries.join("|")
}

/**
 * Groups calculation items by their context. It results in less API calls to the pricing module
 * if we are able to group multiple item with the exact same context
 */
function groupItemsByContext(
  items: PriceCalculationItem[]
): Map<string, PriceCalculationItem[]> {
  const groups = new Map<string, PriceCalculationItem[]>()

  for (const item of items) {
    const contextKey = createContextKey(item.context)
    const existingGroup = groups.get(contextKey)

    if (existingGroup) {
      existingGroup.push(item)
    } else {
      groups.set(contextKey, [item])
    }
  }

  return groups
}

/**
 * Converts shared context input to unified calculation items format
 */
function createCalculationItemsFromSharedContext(
  variantPriceSets: VariantPriceSetData[],
  sharedContext?: Record<string, unknown>
): PriceCalculationItem[] {
  return variantPriceSets
    .filter((v) => v.price_set?.id)
    .map((v) => ({
      variantId: v.id,
      priceSetId: v.price_set!.id,
      context: sharedContext,
    }))
}

/**
 * Converts individual context input to unified calculation items format
 */
function createCalculationItemsFromBulkData(
  bulkData: GetVariantPriceSetsStepBulkInput["data"],
  variantToPriceSetId: Map<string, string>
): PriceCalculationItem[] {
  const calculationItems: PriceCalculationItem[] = []
  for (const item of bulkData) {
    const priceSetId = variantToPriceSetId.get(item.variantId)
    if (priceSetId) {
      calculationItems.push({
        id: item.id,
        variantId: item.variantId,
        priceSetId,
        context: item.context,
      })
    }
  }
  return calculationItems
}

/**
 * This step retrieves the calculated price sets of the specified variants.
 *
 * @example
 * To retrieve variant price sets with shared context:
 *
 * ```ts
 * const data = getVariantPriceSetsStep({
 *   variantIds: ["variant_123"],
 *   context: { currency_code: "usd" }
 * })
 * ```
 *
 * To retrieve variant price sets with individual contexts:
 *
 * ```ts
 * const data = getVariantPriceSetsStep({
 *   data: [
 *     { variantId: "variant_123", context: { currency_code: "usd" } },
 *     { variantId: "variant_456", context: { currency_code: "usd" } }, // Same context - will be batched
 *     { variantId: "variant_789", context: { currency_code: "eur" } }
 *   ]
 * })
 * ```
 */
export const getVariantPriceSetsStep = createStep(
  getVariantPriceSetsStepId,
  async (
    data: GetVariantPriceSetsStepInput | GetVariantPriceSetsStepBulkInput,
    { container }
  ) => {
    const pricingModuleService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )
    const query = container.resolve<Query>(ContainerRegistrationKeys.QUERY)

    let calculationItems: PriceCalculationItem[]

    // Handle shared context variants (original input format)
    if ("variantIds" in data) {
      if (!data.variantIds.length) {
        return new StepResponse({})
      }

      const variantPriceSets = await fetchVariantPriceSets(
        query,
        data.variantIds
      )

      validateVariantPriceSets(variantPriceSets)

      calculationItems = createCalculationItemsFromSharedContext(
        variantPriceSets,
        data.context
      )
    } else {
      // Handle individual context variants (bulk input format)
      const bulkData = data.data
      if (!bulkData.length) {
        return new StepResponse({})
      }

      const variantIds = bulkData.map((item) => item.variantId)
      const variantPriceSets = await fetchVariantPriceSets(query, variantIds)

      const variantsWithCustomPrice = bulkData
        .filter((item) => !!item.context?.is_custom_price)
        .map((item) => item.variantId)
      validateVariantPriceSets(variantPriceSets, variantsWithCustomPrice)

      // Map variant IDs to price set IDs
      const variantToPriceSetId = new Map<string, string>()
      variantPriceSets.forEach((v) => {
        if (v.price_set?.id) {
          variantToPriceSetId.set(v.id, v.price_set.id)
        }
      })

      calculationItems = createCalculationItemsFromBulkData(
        bulkData,
        variantToPriceSetId
      )
    }

    // Use unified processing logic for both input types
    const result = await processVariantPriceSets(
      pricingModuleService,
      calculationItems,
      container
    )

    return new StepResponse(result)
  }
)
