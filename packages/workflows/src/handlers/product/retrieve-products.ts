import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function retrieveProducts({
  container,
  context,
  data,
}: WorkflowArguments<{
  products: ProductTypes.ProductDTO[]
  payload: {
    retrieveProductsConfig: {
      select: string[]
      relations: string[]
    }
  }
}>): Promise<ProductTypes.ProductDTO[]> {
  const { manager } = context

  const products = data.products
  const retrieveProductsConfig = data.payload.retrieveProductsConfig

  const productService = container.resolve("productService")
  const pricingService = container.resolve("pricingService")

  const config = {}
  let shouldUseConfig = false

  if (retrieveProductsConfig.select) {
    shouldUseConfig = !!retrieveProductsConfig.select.length
    Object.assign(config, { select: retrieveProductsConfig.select })
  }

  if (retrieveProductsConfig.relations) {
    shouldUseConfig =
      shouldUseConfig || !!retrieveProductsConfig.relations.length
    Object.assign(config, { relations: retrieveProductsConfig.relations })
  }

  const rawProduct = await productService
    .withTransaction(manager as any)
    .retrieve(products[0].id, shouldUseConfig ? config : undefined)

  return await pricingService
    .withTransaction(manager as any)
    .setProductPrices([rawProduct])
}

retrieveProducts.aliases = {
  products: "products",
  inputData: "payload",
}
