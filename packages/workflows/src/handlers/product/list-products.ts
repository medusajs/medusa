import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function listProducts({
  container,
  context,
  data,
}: WorkflowArguments<{
  productIds: string[]
  config?: WorkflowTypes.CommonWorkflow.WorkflowInputConfig
  // TODO: should return product DTO or priced product but needs to be created in the types package
}>): Promise<ProductTypes.ProductDTO[]> {
  const { manager } = context

  const productIds = data.productIds
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

  const rawProducts = await productService
    .withTransaction(manager as any)
    .list({ id: productIds }, shouldUseConfig ? config : undefined)

  return await pricingService
    .withTransaction(manager as any)
    .setProductPrices(rawProducts)
}

listProducts.aliases = {
  productIds: "productIds",
}
