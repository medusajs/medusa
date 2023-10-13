import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[]
}
type HandlerInput = {
  productsHandleVariantsIndexPricesMap: Map<
    ProductHandle,
    VariantIndexAndPrices[]
  >
  products: ProductTypes.ProductDTO[]
}

export async function updateProductsVariantsPrices({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>) {
  const { manager } = context
  const products = data.products
  const productsHandleVariantsIndexPricesMap =
    data.productsHandleVariantsIndexPricesMap

  const productVariantService = container.resolve("productVariantService")
  const regionService = container.resolve("regionService")
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const medusaApp = container.resolve("medusaApp")
  const productVariantServiceTx = productVariantService.withTransaction(manager)
  const variantIdsPricesData: any[] = []
  const variantPricesMap = new Map<string, any[]>()

  const productsMap = new Map<string, ProductTypes.ProductDTO>(
    products.map((p) => [p.handle!, p])
  )

  for (const mapData of productsHandleVariantsIndexPricesMap.entries()) {
    const [handle, variantData] = mapData

    const product = productsMap.get(handle)
    if (!product) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product with handle ${handle} not found`
      )
    }

    variantData.forEach((item, index) => {
      const variant = product.variants[index]
      variantIdsPricesData.push({
        variantId: variant.id,
        prices: item.prices,
      })

      variantPricesMap.set(variant.id, [])

      item.prices.forEach(async (price) => {
        const obj = {
          amount: price.amount,
          currency_code: price.currency_code,
          rules: {},
        }

        if (price.region_id) {
          const region = await regionService.retrieve(price.region_id)
          obj.currency_code = region.currency_code
          obj.rules = {
            region_id: price.region_id,
          }
        }

        const variantPrices = variantPricesMap.get(variant.id)
        variantPrices?.push(obj)
      })
    })
  }

  if (featureFlagRouter.isFeatureEnabled("pricing_integration")) {
    const pricingModuleService = container.resolve("pricingModuleService")

    for (let { variantId } of variantIdsPricesData) {
      const priceSet = await pricingModuleService.create({
        rules: [{ rule_attribute: "region_id" }],
        prices: variantPricesMap.get(variantId),
      })

      await medusaApp.link.create({
        productService: {
          variant_id: variantId,
        },
        pricingService: {
          price_set_id: priceSet.id,
        },
      })
    }
  } else {
    await productVariantServiceTx.updateVariantPrices(variantIdsPricesData)
  }
}

updateProductsVariantsPrices.aliases = {
  products: "products",
}
