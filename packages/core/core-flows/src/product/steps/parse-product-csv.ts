import {
  MedusaError,
  ModuleRegistrationName,
  convertCsvToJson,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { normalizeForImport } from "../helpers/normalize-for-import"
import { IRegionModuleService } from "@medusajs/types"

export const parseProductCsvStepId = "parse-product-csv"
export const parseProductCsvStep = createStep(
  parseProductCsvStepId,
  async (fileContent: string, { container }) => {
    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )
    const csvProducts = convertCsvToJson(fileContent)

    csvProducts.forEach((product: any) => {
      if (!product["Product Handle"]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product handle is required when importing products"
        )
      }
    })

    const allRegions = await regionService.listRegions(
      {},
      { select: ["id", "currency_code"], take: null }
    )

    const normalizedData = normalizeForImport(csvProducts, allRegions)
    return new StepResponse(normalizedData)
  }
)
