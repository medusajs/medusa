import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddPriceListPricesDTO,
  CreatePriceListPriceDTO,
  CreatePriceListPriceWorkflowDTO,
  IPricingModuleService,
  PriceListDTO,
  PriceSetMoneyAmountDTO,
  UpdatePriceListPriceDTO,
  UpdatePriceListPriceWorkflowDTO,
  UpdatePriceListPricesDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
  buildPriceSetPricesForModule,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type WorkflowStepInput = {
  id: string
  prices?: (UpdatePriceListPriceWorkflowDTO | CreatePriceListPriceWorkflowDTO)[]
}[]

export const upsertPriceListPricesStepId = "upsert-price-list-prices"
export const upsertPriceListPricesStep = createStep(
  upsertPriceListPricesStepId,
  async (data: WorkflowStepInput, { container }) => {
    if (!data.length) {
      return new StepResponse(null, {
        createdPriceListPrices: [],
        updatedPriceListPrices: [],
      })
    }

    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const priceListIds = data.map((d) => d.id)
    const priceLists = await pricingModule.listPriceLists({
      id: priceListIds,
    })

    const priceListMap: Map<string, PriceListDTO> = new Map(
      priceLists.map((priceList) => [priceList.id, priceList])
    )

    const diff = arrayDifference(
      priceListIds,
      priceLists.map((pl) => pl.id)
    )

    if (diff.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Price lists with id: ${diff.join(", ")} was not found`
      )
    }

    const variantIds: string[] = data
      .map((pl) => pl?.prices?.map((price) => price.variant_id!) || [])
      .filter(Boolean)
      .flat(1)

    const variantPricingLinkQuery = remoteQueryObjectFromString({
      entryPoint: "product_variant_price_set",
      fields: ["variant_id", "price_set_id"],
      variables: { variant_id: variantIds, take: null },
    })

    const links = await remoteQuery(variantPricingLinkQuery)
    const variantPriceSetMap: Map<string, string> = new Map(
      links.map((link) => [link.variant_id, link.price_set_id])
    )
    const withoutLinks = variantIds.filter((id) => !variantPriceSetMap.has(id!))

    if (withoutLinks.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No price set exist for variants: ${withoutLinks.join(", ")}`
      )
    }

    const priceListPricesToUpdate: UpdatePriceListPricesDTO[] = []
    const priceListPricesToAdd: AddPriceListPricesDTO[] = []

    for (const upsertPriceListPricesData of data) {
      const { prices, id: priceListId } = upsertPriceListPricesData
      const priceList = priceListMap.get(priceListId)!

      const pricesToAdd: CreatePriceListPriceDTO[] = []
      const pricesToUpdate: UpdatePriceListPriceDTO[] = []

      if (typeof prices === "undefined") {
        continue
      }

      for (const price of prices) {
        const priceSetId = variantPriceSetMap.get(price.variant_id!)!

        if (isPriceUpdate(price)) {
          pricesToUpdate.push({ ...price, price_set_id: priceSetId })
        } else {
          pricesToAdd.push({ ...price, price_set_id: priceSetId })
        }
      }

      if (pricesToUpdate.length) {
        priceListPricesToUpdate.push({
          price_list_id: priceList.id,
          prices: pricesToUpdate,
        })
      }

      if (pricesToAdd.length) {
        priceListPricesToAdd.push({
          price_list_id: priceList.id,
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
