import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddPriceListPricesDTO,
  CreatePriceListPriceDTO,
  CreatePriceListPriceWorkflowDTO,
  IPricingModuleService,
  PriceSetMoneyAmountDTO,
  UpdatePriceListPriceDTO,
  UpdatePriceListPriceWorkflowDTO,
  UpdatePriceListPricesDTO,
  UpdatePriceListWorkflowInputDTO,
} from "@medusajs/types"
import { buildPriceSetPricesForModule } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type WorkflowStepInput = {
  data: Pick<UpdatePriceListWorkflowInputDTO, "id" | "prices">[]
  variant_price_map: Record<string, string>
}

export const upsertPriceListPricesStepId = "upsert-price-list-prices"
export const upsertPriceListPricesStep = createStep(
  upsertPriceListPricesStepId,
  async (stepInput: WorkflowStepInput, { container }) => {
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

    const updatedPriceSetMoneyAmounts =
      await pricingModule.listPriceSetMoneyAmounts(
        {
          id: priceListPricesToUpdate
            .map((priceListData) =>
              priceListData.prices.map((price) => price.id)
            )
            .filter(Boolean)
            .flat(1),
        },
        { relations: ["price_list"] }
      )

    const priceListPsmaMap = new Map<string, PriceSetMoneyAmountDTO[]>()
    const dataBeforePriceUpdate: UpdatePriceListPricesDTO[] = []

    for (const priceSetMoneyAmount of updatedPriceSetMoneyAmounts) {
      const priceListId = priceSetMoneyAmount.price_list!.id
      const psmas = priceListPsmaMap.get(priceListId) || []

      priceListPsmaMap.set(priceListId, psmas)
    }

    for (const [priceListId, psmas] of Object.entries(priceListPsmaMap)) {
      dataBeforePriceUpdate.push({
        price_list_id: priceListId,
        prices: buildPriceSetPricesForModule(psmas),
      })
    }

    // TODO: `addPriceListPrices` will return a list of price lists
    // This should be reworked to return prices instead, as we need to
    // do a revert incase this step fails
    const [createdPriceListPrices, _] = await Promise.all([
      pricingModule.addPriceListPrices(priceListPricesToAdd),
      pricingModule.updatePriceListPrices(priceListPricesToUpdate),
    ])

    return new StepResponse(null, {
      createdPriceListPrices,
      updatedPriceListPrices: dataBeforePriceUpdate,
    })
  },
  async (data, { container }) => {
    const { createdPriceListPrices = [], updatedPriceListPrices = [] } =
      data || {}

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    if (createdPriceListPrices.length) {
      pricingModule.removePrices(createdPriceListPrices.map((p) => p.id))
    }

    if (updatedPriceListPrices.length) {
      pricingModule.updatePriceListPrices(updatedPriceListPrices)
    }
  }
)

function isPriceUpdate(
  data: UpdatePriceListPriceWorkflowDTO | CreatePriceListPriceWorkflowDTO
): data is UpdatePriceListPriceWorkflowDTO {
  return "id" in data
}
