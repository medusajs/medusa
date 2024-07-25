import { MedusaError, convertCsvToJson } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { normalizeForImport } from "../helpers/normalize-for-import"

export const parseProductCsvStepId = "parse-product-csv"
export const parseProductCsvStep = createStep(
  parseProductCsvStepId,
  async (fileContent: string) => {
    const csvProducts = convertCsvToJson(fileContent)

    csvProducts.forEach((product: any) => {
      if (!product["Product Handle"]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product handle is required when importing products"
        )
      }
    })

    const normalizedData = normalizeForImport(csvProducts)
    return new StepResponse(normalizedData)
  }
)
