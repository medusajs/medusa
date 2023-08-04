import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function listProducts({
  container,
  context,
  data,
}: WorkflowArguments<{
  products: ProductTypes.ProductDTO[]
  config?: WorkflowTypes.CommonWorkflow.WorkflowInputConfig
}>): Promise<ProductTypes.ProductDTO[]> {
  const { manager } = context

  const products = data.products
  const listConfig = data.config?.listConfig ?? {}

  const productService = container.resolve("productService")
  const pricingService = container.resolve("pricingService")

  const config = {}
  let shouldUseConfig = false

  if (listConfig.select) {
    shouldUseConfig = !!listConfig.select.length
    Object.assign(config, { select: listConfig.select })
  }

  if (listConfig.relations) {
    shouldUseConfig = shouldUseConfig || !!listConfig.relations.length
    Object.assign(config, { relations: listConfig.relations })
  }

  const rawProduct = await productService
    .withTransaction(manager as any)
    .retrieve(products[0].id, shouldUseConfig ? config : undefined)

  return await pricingService
    .withTransaction(manager as any)
    .setProductPrices([rawProduct])
}

listProducts.aliases = {
  products: "products",
}
