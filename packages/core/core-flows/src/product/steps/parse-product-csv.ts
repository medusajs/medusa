import {
  IFulfillmentModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@zjedene-medusa/framework/types"
import { MedusaError, Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"
import { normalizeForImport } from "../helpers/normalize-for-import"
import { normalizeV1Products } from "../helpers/normalize-v1-import"
import { convertCsvToJson } from "../utils"

/**
 * The CSV file content to parse.
 */
export type ParseProductCsvStepInput = string

export const parseProductCsvStepId = "parse-product-csv"
/**
 * This step parses a CSV file holding products to import, returning the products as
 * objects that can be imported.
 *
 * @example
 * const data = parseProductCsvStep("products.csv")
 */
export const parseProductCsvStep = createStep(
  parseProductCsvStepId,
  async (fileContent: ParseProductCsvStepInput, { container }) => {
    const regionService = container.resolve<IRegionModuleService>(
      Modules.REGION
    )
    const productService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const csvProducts = convertCsvToJson(fileContent)

    const [productTypes, productCollections, salesChannels, shippingProfiles] =
      await Promise.all([
        productService.listProductTypes({}, {}),
        productService.listProductCollections({}, {}),
        salesChannelService.listSalesChannels({}, {}),
        fulfillmentService.listShippingProfiles({}, {}),
      ])

    const v1Normalized = normalizeV1Products(csvProducts, {
      productTypes,
      productCollections,
      salesChannels,
      shippingProfiles,
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
        { select: ["id", "name", "currency_code"] }
      ),
      productService.listProductTags({}, { select: ["id", "value"] }),
    ])

    const normalizedData = normalizeForImport(v1Normalized, {
      regions: allRegions,
      tags: allTags,
    })
    return new StepResponse(normalizedData)
  }
)
