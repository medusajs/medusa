import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddPriceListPricesDTO,
  CreatePriceListPriceDTO,
  CreatePriceListPriceWorkflowDTO,
  IPricingModuleService,
  PriceDTO,
  UpdatePriceListPriceDTO,
  UpdatePriceListPriceWorkflowDTO,
  UpdatePriceListPricesDTO,
  UpsertPriceListPricesWorkflowStepDTO,
} from "@medusajs/types"
import { buildPriceSetPricesForModule, promiseAll } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const upsertPriceListPricesStepId = "upsert-price-list-prices"
export const upsertPriceListPricesStep = createStep(
  upsertPriceListPricesStepId,
  async (stepInput: UpsertPriceListPricesWorkflowStepDTO, { container }) => {
    const { data, variant_price_map: variantPriceSetMap } = stepInput

    const priceListPricesToUpdate: UpdatePriceListPricesDTO[] = []
    const priceListPricesToAdd: AddPriceListPricesDTO[] = []
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    for (const upsertPriceListPricesData of data) {
      const { prices = [], id } = upsertPriceListPricesData

      const pricesToAdd: CreatePriceListPriceDTO[] = []
      const pricesToUpdate: UpdatePriceListPriceDTO[] = []

      for (const price of prices) {
        const priceSetId = variantPriceSetMap[price.variant_id!]

        if (isPriceUpdate(price)) {
          pricesToUpdate.push({ ...price, price_set_id: priceSetId })
        } else {
          pricesToAdd.push({ ...price, price_set_id: priceSetId })
        }
      }

      if (pricesToUpdate.length) {
        priceListPricesToUpdate.push({
          price_list_id: id,
          prices: pricesToUpdate,
        })
      }

      if (pricesToAdd.length) {
        priceListPricesToAdd.push({
          price_list_id: id,
          prices: pricesToAdd,
        })
      }
    }

    const updatedPrices = await pricingModule.listPrices(
      {
        id: priceListPricesToUpdate
          .map((priceListData) => priceListData.prices.map((price) => price.id))
          .filter(Boolean)
          .flat(1),
      },
      { relations: ["price_list"] }
    )

    const priceListPricesMap = new Map<string, PriceDTO[]>()
    const dataBeforePriceUpdate: UpdatePriceListPricesDTO[] = []

    for (const updatedPrice of updatedPrices) {
      const priceListId = updatedPrice.price_list!.id
      const prices = priceListPricesMap.get(priceListId) || []

      priceListPricesMap.set(priceListId, prices)
    }

    for (const [priceListId, prices] of Object.entries(priceListPricesMap)) {
      dataBeforePriceUpdate.push({
        price_list_id: priceListId,
        prices: buildPriceSetPricesForModule(prices),
      })
    }

    // TODO: `addPriceListPrices` will return a list of price lists
    // This should be reworked to return prices instead, as we need to
    // do a revert incase this step fails
    const [createdPriceListPrices, _] = await promiseAll([
      pricingModule.addPriceListPrices(priceListPricesToAdd),
      pricingModule.updatePriceListPrices(priceListPricesToUpdate),
    ])

    return new StepResponse(null, {
      createdPriceListPrices,
      updatedPriceListPrices: dataBeforePriceUpdate,
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const { createdPriceListPrices = [], updatedPriceListPrices = [] } = data
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    if (createdPriceListPrices.length) {
      await pricingModule.removePrices(createdPriceListPrices.map((p) => p.id))
    }

    if (updatedPriceListPrices.length) {
      await pricingModule.updatePriceListPrices(updatedPriceListPrices)
    }
  }
)

function isPriceUpdate(
  data: UpdatePriceListPriceWorkflowDTO | CreatePriceListPriceWorkflowDTO
): data is UpdatePriceListPriceWorkflowDTO {
  return "id" in data
}
