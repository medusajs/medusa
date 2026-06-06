import {
  IPricingModuleService,
  PriceListDTO,
  UpdatePriceListDTO,
} from "@zjedene-medusa/framework/types"
import {
  MedusaError,
  Modules,
  arrayDifference,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of price lists to validate that they exist.
 */
export type ValidatePriceListsStepInput = Pick<UpdatePriceListDTO, "id">[]

export const validatePriceListsStepId = "validate-price-lists"
/**
 * This step validates that the specified price lists exist.
 * If not valid, the step throws an error.
 */
export const validatePriceListsStep = createStep(
  validatePriceListsStepId,
  async (data: ValidatePriceListsStepInput, { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    if (!data.length) {
      return new StepResponse(void 0)
    }

    const priceListIds = data.map((d) => d.id)
    const priceLists = await pricingModule.listPriceLists({ id: priceListIds })

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

    const priceListMap: Record<string, PriceListDTO> = {}

    for (const priceList of priceLists) {
      priceListMap[priceList.id] = priceList
    }

    return new StepResponse(priceListMap)
  }
)
