import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreatePriceListDTO,
  CreatePriceListWorkflowInputDTO,
  IPricingModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createPriceListsStepId = "create-price-lists"
export const createPriceListsStep = createStep(
  createPriceListsStepId,
  async (data: CreatePriceListWorkflowInputDTO[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const variantIds: string[] = data
      .map((pl) => pl?.prices?.map((price) => price.variant_id) || [])
      .flat(1)

    const variantPricingLinkQuery = remoteQueryObjectFromString({
      entryPoint: "product_variant_price_set",
      fields: ["variant_id", "price_set_id"],
      variables: {
        variant_id: variantIds,
        take: null,
      },
    })

    const links = await remoteQuery(variantPricingLinkQuery)
    const variantPriceSetMap: Map<string, string> = new Map(
      links.map((link) => [link.variant_id, link.price_set_id])
    )
    const withoutLinks = variantIds.filter((id) => !variantPriceSetMap.has(id!))

    if (withoutLinks.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No priceSet exist for variants: ${withoutLinks.join(", ")}`
      )
    }

    const createData = data.map((priceListDTO) => {
      const { prices = [], ...rest } = priceListDTO
      const createPriceListData: CreatePriceListDTO = { ...rest }

      createPriceListData.prices = prices.map((price) => ({
        currency_code: price.currency_code,
        amount: price.amount,
        min_quantity: price.min_quantity,
        max_quantity: price.max_quantity,
        price_set_id: variantPriceSetMap.get(price.variant_id)!,
        rules: price.rules,
      }))

      return createPriceListData
    })

    const createdPriceLists = await pricingModule.createPriceLists(createData)

    return new StepResponse(
      createdPriceLists,
      createdPriceLists.map((createdPriceLists) => createdPriceLists.id)
    )
  },
  async (createdPriceListIds, { container }) => {
    if (!createdPriceListIds?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.deletePriceLists(createdPriceListIds)
  }
)
