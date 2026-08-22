import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/core-flows"

export default async function publishAllProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("📢 Publishing all products for store visibility...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status", "handle"],
  })

  logger.info(`Found ${products.length} products. Checking status...`)

  for (const prod of products) {
    if (prod.status !== "published") {
      logger.info(`Publishing product: ${prod.title} (current status: ${prod.status})...`)
      await updateProductsWorkflow(container).run({
        input: {
          products: [
            {
              id: prod.id,
              status: "published" as any,
            },
          ],
        },
      })
    }
  }

  logger.info("🎉 All products are now PUBLISHED and live in the storefront!")
}
