import { IFileModuleService, HttpTypes } from "@medusajs/types"
import { ModuleRegistrationName, convertJsonToCsv } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { normalizeForExport } from "../helpers/normalize-for-export"

export const generateProductCsvStepId = "generate-product-csv"
export const generateProductCsvStep = createStep(
  generateProductCsvStepId,
  async (products: HttpTypes.AdminProduct[], { container }) => {
    const normalizedData = normalizeForExport(products)
    const csvContent = convertJsonToCsv(normalizedData)

    const fileModule: IFileModuleService = container.resolve(
      ModuleRegistrationName.FILE
    )

    const file = await fileModule.createFiles({
      filename: `${Date.now()}-product-exports.csv`,
      mimeType: "text/csv",
      content: csvContent,
    })

    return new StepResponse(file.id, file.id)
  },
  async (fileId, { container }) => {
    if (!fileId) {
      return
    }

    const fileModule: IFileModuleService = container.resolve(
      ModuleRegistrationName.FILE
    )
    await fileModule.deleteFiles(fileId)
  }
)
