import {
  IFileModuleService,
  HttpTypes,
  IRegionModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName, convertJsonToCsv } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { normalizeForExport } from "../helpers/normalize-for-export"

const prodColumnPositions = new Map([
  ["Product Id", 0],
  ["Product Handle", 1],
  ["Product Title", 2],
  ["Product Status", 3],
  ["Product Description", 4],
  ["Product Subtitle", 5],
  ["Product External Id", 6],
  ["Product Thumbnail", 7],
  ["Product Collection Id", 8],
  ["Product Type Id", 9],
])

const variantColumnPositions = new Map([
  ["Variant Id", 0],
  ["Variant Title", 1],
  ["Variant Sku", 3],
  ["Variant Upc", 4],
  ["Variant Ean", 5],
  ["Variant Hs Code", 6],
  ["Variant Mid Code", 7],
  ["Variant Manage Inventory", 8],
  ["Variant Allow Backorder", 9],
])

const comparator = (a: string, b: string, columnMap: Map<string, number>) => {
  if (columnMap.has(a) && columnMap.has(b)) {
    return columnMap.get(a)! - columnMap.get(b)!
  }
  if (columnMap.has(a)) {
    return -1
  }
  if (columnMap.has(b)) {
    return 1
  }
  return a.localeCompare(b)
}

const csvSortFunction = (a: string, b: string) => {
  if (a.startsWith("Product") && b.startsWith("Product")) {
    return comparator(a, b, prodColumnPositions)
  }

  if (a.startsWith("Variant") && b.startsWith("Variant")) {
    return comparator(a, b, variantColumnPositions)
  }

  return a.localeCompare(b)
}

export const generateProductCsvStepId = "generate-product-csv"
export const generateProductCsvStep = createStep(
  generateProductCsvStepId,
  async (products: HttpTypes.AdminProduct[], { container }) => {
    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    const regions = await regionService.listRegions(
      {},
      { select: ["id", "name", "currency_code"], take: null }
    )

    const normalizedData = normalizeForExport(products, { regions })
    const csvContent = convertJsonToCsv(normalizedData, {
      sortHeader: csvSortFunction,
    })

    const fileModule: IFileModuleService = container.resolve(
      ModuleRegistrationName.FILE
    )

    const filename = `${Date.now()}-product-exports.csv`
    const file = await fileModule.createFiles({
      filename,
      mimeType: "text/csv",
      content: csvContent,
    })

    return new StepResponse({ id: file.id, filename }, file.id)
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
