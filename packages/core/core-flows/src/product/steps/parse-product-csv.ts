import {
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { MedusaError, Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { normalizeForImport } from "../helpers/normalize-for-import"
import { normalizeV1Products } from "../helpers/normalize-v1-import"
import { convertCsvToJson } from "../utlils"

export const parseProductCsvStepId = "parse-product-csv"
/**
 * This step parses a CSV file holding products to import.
 */
export const parseProductCsvStep = createStep(
  parseProductCsvStepId,
  async (fileContent: string, { container }) => {
    const regionService = container.resolve<IRegionModuleService>(
      Modules.REGION
    )
    const productService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
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
