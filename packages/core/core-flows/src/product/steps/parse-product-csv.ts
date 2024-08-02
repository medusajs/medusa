import {
  MedusaError,
  ModuleRegistrationName,
  convertCsvToJson,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { normalizeForImport } from "../helpers/normalize-for-import"
import {
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { normalizeV1Products } from "../helpers/normalize-v1-import"

export const parseProductCsvStepId = "parse-product-csv"
export const parseProductCsvStep = createStep(
  parseProductCsvStepId,
  async (fileContent: string, { container }) => {
    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )
    const productService = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    const csvProducts = convertCsvToJson(fileContent)

    const [productTypes, productCollections, salesChannels] = await Promise.all(
      [
        productService.listProductTypes({}, { take: null }),
        productService.listProductCollections({}, { take: null }),
        salesChannelService.listSalesChannels({}, { take: null }),
      ]
    )

    const v1Normalized = normalizeV1Products(csvProducts, {
      productTypes,
      productCollections,
      salesChannels,
    })

    // We use the handle to group products and variants correctly.
    v1Normalized.forEach((product: any) => {
      if (!product["Product Handle"]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product handle is required when importing products"
        )
      }
    })

    const [allRegions, allTags] = await Promise.all([
      regionService.listRegions(
        {},
        { select: ["id", "name", "currency_code"], take: null }
      ),
      productService.listProductTags(
        {},
        { select: ["id", "value"], take: null }
      ),
    ])

    const normalizedData = normalizeForImport(v1Normalized, {
      regions: allRegions,
      tags: allTags,
    })
    return new StepResponse(normalizedData)
  }
)
