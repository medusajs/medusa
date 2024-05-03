import { ProductTypes, WorkflowTypes } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaError, MedusaV2Flag } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

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
  const productVariantServiceTx = productVariantService.withTransaction(manager)
  const variantIdsPricesData: any[] = []
  const variantPricesMap = new Map<string, any[]>()

  const productsMap = new Map<string, ProductTypes.ProductDTO>(
    products.map((p) => [p.handle!, p])
  )

  const regionIds = new Set()

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

      const prices: any[] = []
      variantPricesMap.set(variant.id, prices)

      item.prices.forEach((price) => {
        const obj = {
          amount: price.amount,
          currency_code: price.currency_code,
        }

        if (price.region_id) {
          regionIds.add(price.region_id)
          ;(obj as any).region_id = price.region_id
        }

        prices.push(obj)
      })
    })
  }

  if (regionIds.size) {
    const regions = await regionService.list({
      id: [...regionIds],
    })
    const regionMap = new Map<string, any>(regions.map((r) => [r.id, r]))

    for (const [, prices] of variantPricesMap.entries()) {
      prices.forEach((price) => {
        if (price.region_id) {
          const region = regionMap.get(price.region_id)
          price.currency_code = region?.currency_code
          price.rules = {
            region_id: price.region_id,
          }

          delete price.region_id
        }
      })
    }
  }

  if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    const remoteLink = container.resolve("remoteLink")
    const pricingModuleService = container.resolve(
      ModuleRegistrationName.PRICING
    )

    const priceSetsToCreate = variantIdsPricesData.map(({ variantId }) => ({
      rules: [{ rule_attribute: "region_id" }],
      prices: variantPricesMap.get(variantId),
    }))

    const priceSets = await pricingModuleService.create(priceSetsToCreate)

    const links = priceSets.map((priceSet, index) => ({
      productService: {
        variant_id: variantIdsPricesData[index].variantId,
      },
      pricingService: {
        price_set_id: priceSet.id,
      },
    }))

    await remoteLink.create(links)
  } else {
    await productVariantServiceTx.updateVariantPrices(variantIdsPricesData)
  }
}

updateProductsVariantsPrices.aliases = {
  products: "products",
}
