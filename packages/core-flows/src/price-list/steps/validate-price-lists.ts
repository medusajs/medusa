import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IPricingModuleService,
  PriceListDTO,
  UpdatePriceListDTO,
} from "@medusajs/types"
import { MedusaError, arrayDifference } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const validatePriceListsStepId = "validate-price-lists"
export const validatePriceListsStep = createStep(
  validatePriceListsStepId,
  async (data: Pick<UpdatePriceListDTO, "id">[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

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
