import { PriceListPriceDTO, PriceSetMoneyAmountDTO } from "@medusajs/types"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"

type wfInput = {
  priceListId: string
  operations: Record<string, string | number | (string | number | object)[]>[]
}
type prepOutput = {
  priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
  variantIdToPriceSetIdMap: Record<string, string>
}

const prepareImportPriceListPrices = createStep<wfInput, prepOutput, undefined>(
  "prepare-import-price-list-prices",
  async (data, context) => {
    const { operations, priceListId } = data
    const pricingModuleService = context.container.resolve(
      ModuleRegistrationName.PRICING
    )
    const remoteQuery = context.container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const priceSetMoneyAmounts =
      await pricingModuleService.listPriceSetMoneyAmounts(
        {
          price_list_id: [priceListId],
        },
        { take: null, relations: ["money_amount", "price_rules"] }
      )

    const variables = {
      variant_id: operations.map((op) => op.variant_id),
      take: null,
    }

    const query = {
      product_variant_price_set: {
        __args: variables,
        fields: ["variant_id", "price_set_id"],
      },
    }

    const variantPriceSets = await remoteQuery(query)

    const variantIdToPriceSetIdMap: Record<string, string> =
      variantPriceSets.reduce((acc, variantPriceSet) => {
        acc[variantPriceSet.variant_id] = variantPriceSet.price_set_id
        return acc
      }, {})

    return new StepResponse({
      priceSetMoneyAmounts,
      variantIdToPriceSetIdMap,
    })
  }
)

const deletePriceListPrices = createStep<
  prepOutput,
  undefined,
  {
    priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
  }
>(
  "delete-price-list-prices",
  async ({ priceSetMoneyAmounts }, context) => {
    const pricingModuleService = context.container.resolve(
      ModuleRegistrationName.PRICING
    )

    await pricingModuleService.deleteMoneyAmounts(
      priceSetMoneyAmounts.map((psma) => psma.money_amount?.id || "")
    )

    return new StepResponse(undefined, { priceSetMoneyAmounts })
  }
  // function (input) {} // TODO: fix this
)

const createPriceListPrices = createStep<
  {
    input: wfInput
    prep: prepOutput
  },
  void,
  undefined
>("create-price-list-prices", async (data, context) => {
  const { input, prep } = data

  const pricingModuleService = context.container.resolve(
    ModuleRegistrationName.PRICING
  )

  const priceInput = {
    priceListId: input.priceListId,
    prices: input.operations
      .map((op) =>
        (
          op.prices as {
            region_id?: string
            currency_code?: string
            variant_id: string
            amount: number
            min_quantity?: number
            max_quantity?: number
          }[]
        ).map((p) => {
          const rules: Record<string, string> = {}
          if (p.region_id) {
            rules.region_id = p.region_id
          }
          return {
            ...p,
            rules,
            price_set_id:
              prep.variantIdToPriceSetIdMap[op.variant_id as string],
          } as PriceListPriceDTO
        })
      )
      .flat(),
  }

  await pricingModuleService.addPriceListPrices([priceInput])
})

export const importPriceListWorkflow = createWorkflow<wfInput, void>(
  "import-price-list",
  function (input) {
    const prep = prepareImportPriceListPrices(input)

    deletePriceListPrices(prep)

    createPriceListPrices({
      input,
      prep,
    })
  }
)
