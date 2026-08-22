import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/core-flows"

export default async function deleteAllProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("🗑️  Fetching all products...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  })

  if (products.length === 0) {
    logger.info("No products found. Nothing to delete.")
    return
  }

  logger.info(`Found ${products.length} products. Deleting...`)

  const productIds = products.map((p) => p.id)

  await deleteProductsWorkflow(container).run({
    input: { ids: productIds },
  })

  logger.info(`✅ Successfully deleted ${products.length} products.`)
}
