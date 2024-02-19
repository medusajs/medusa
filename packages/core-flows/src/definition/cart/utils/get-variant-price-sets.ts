import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CalculatedPriceSet,
  ICustomerModuleService,
  IPricingModuleService,
  MedusaContainer,
  MoneyAmountDTO,
} from "@medusajs/types"

/**
 * Pricing fields for product variants.
 */
export type ProductVariantPricing = {
  /**
   * The list of prices.
   */
  prices: MoneyAmountDTO[]
  /**
   * The original price of the variant.
   */
  original_price: number | null
  /**
   * The lowest price among the retrieved prices.
   */
  calculated_price: number | null
  /**
   * Whether the `original_price` field includes taxes.
   *
   * @featureFlag tax_inclusive_pricing
   */
  original_price_includes_tax?: boolean | null
  /**
   * Whether the `calculated_price` field includes taxes.
   *
   * @featureFlag tax_inclusive_pricing
   */
  calculated_price_includes_tax?: boolean | null
  /**
   * Either `default` if the `calculated_price` is the original price, or the type of the price list applied, if any.
   */
  calculated_price_type?: string | null
} & TaxedPricing

/**
 * Pricing fields related to taxes.
 */
export type TaxedPricing = {
  /**
   * The price after applying the tax amount on the original price.
   */
  original_price_incl_tax: number | null
  /**
   * The price after applying the tax amount on the calculated price.
   */
  calculated_price_incl_tax: number | null
  /**
   * The tax amount applied to the original price.
   */
  original_tax: number | null
  /**
   * The tax amount applied to the calculated price.
   */
  calculated_tax: number | null
}

export async function getPricingModuleVariantMoneyAmounts(
  variantPriceData: {
    variantId: string
    quantity?: number
  }[],
  container: MedusaContainer
): Promise<Map<string, MoneyAmountDTO[]>> {
  const variables = {
    variant_id: variantPriceData.map((pricedata) => pricedata.variantId),
    take: null,
  }

  const query = {
    product_variant_price_set: {
      fields: ["variant_id", "price_set_id"],
    },
  }

  const remoteQuery = container.resolve("remoteQuery")

  const variantPriceSets = await remoteQuery(query, {
    product_variant_price_set: variables,
  })

  const variantIdToPriceSetIdMap: Map<string, string> = new Map(
    variantPriceSets.map((variantPriceSet) => [
      variantPriceSet.variant_id,
      variantPriceSet.price_set_id,
    ])
  )

  const priceSetIds: string[] = variantPriceSets.map(
    (variantPriceSet) => variantPriceSet.price_set_id
  )

  const queryContext: {
    customer_id?: string
    customer_group_id?: string[]
    currency_code?: string
  } = {}

  const customerService = container.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )
  const pricingService = container.resolve<IPricingModuleService>(
    ModuleRegistrationName.PRICING
  )

  if (queryContext.customer_id) {
    const { groups } = await customerService.retrieve(
      queryContext.customer_id,
      { relations: ["groups"] }
    )

    if (groups?.length) {
      queryContext.customer_group_id = groups.map((group) => group.id)
    }
  }

  let calculatedPrices: CalculatedPriceSet[] = []

  if (queryContext.currency_code) {
    calculatedPrices = (await pricingService.calculatePrices(
      { id: priceSetIds },
      {
        context: queryContext as any,
      }
    )) as unknown as CalculatedPriceSet[]
  }

  const calculatedPriceMap = new Map<string, CalculatedPriceSet>(
    calculatedPrices.map((priceSet) => [priceSet.id, priceSet])
  )

  const pricingResultMap = new Map()

  variantPriceData.forEach(({ variantId }) => {
    const priceSetId = variantIdToPriceSetIdMap.get(variantId)

    const pricingResult: ProductVariantPricing = {
      prices: [] as MoneyAmountDTO[],
      original_price: null,
      calculated_price: null,
      calculated_price_type: null,
      original_price_includes_tax: null,
      calculated_price_includes_tax: null,
      original_price_incl_tax: null,
      calculated_price_incl_tax: null,
      original_tax: null,
      calculated_tax: null,
    }

    if (priceSetId) {
      const calculatedPrices: CalculatedPriceSet | undefined =
        calculatedPriceMap.get(priceSetId)

      if (calculatedPrices) {
        pricingResult.prices.push({
          id: calculatedPrices?.original_price?.money_amount_id,
          currency_code: calculatedPrices.currency_code,
          amount: calculatedPrices.original_amount,
          min_quantity: calculatedPrices.original_price?.min_quantity,
          max_quantity: calculatedPrices.original_price?.max_quantity,
          price_list_id: calculatedPrices.original_price?.price_list_id,
        } as unknown as MoneyAmountDTO)

        if (
          calculatedPrices.calculated_price?.money_amount_id !==
          calculatedPrices.original_price?.money_amount_id
        ) {
          pricingResult.prices.push({
            id: calculatedPrices.calculated_price?.money_amount_id,
            currency_code: calculatedPrices.currency_code,
            amount: calculatedPrices.calculated_amount,
            min_quantity: calculatedPrices.calculated_price?.min_quantity,
            max_quantity: calculatedPrices.calculated_price?.max_quantity,
            price_list_id: calculatedPrices.calculated_price?.price_list_id,
          } as unknown as MoneyAmountDTO)
        }

        pricingResult.original_price = calculatedPrices?.original_amount
        pricingResult.calculated_price = calculatedPrices?.calculated_amount
        pricingResult.calculated_price_type =
          calculatedPrices?.calculated_price?.price_list_type
      }
    }

    pricingResultMap.set(variantId, pricingResult)
  })

  return pricingResultMap
}
