import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  updateProductVariantsWorkflow,
  createInventoryItemsWorkflow,
  createInventoryLevelsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/core-flows"

export default async function fixInventorySettings({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)

  logger.info("🔧 Fixing Variant Inventory Settings for Instant Purchasing...")

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "sku", "manage_inventory", "allow_backorder"],
  })

  logger.info(`Found ${variants.length} variants. Setting manage_inventory: false / allow_backorder: true...`)

  // Update all variants to allow backorder and not block purchases on warehouse sync
  const updatePayload = variants.map((v: any) => ({
    id: v.id,
    manage_inventory: false,
    allow_backorder: true,
  }))

  await updateProductVariantsWorkflow(container).run({
    input: {
      product_variants: updatePayload,
    },
  })

  logger.info("✅ Successfully updated all variants to allow direct seamless purchase!")
}
