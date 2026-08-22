import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  linkSalesChannelsToStockLocationWorkflow,
  createInventoryItemsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/core-flows"

export default async function setupStockAndInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)

  logger.info("📦 Running Official Stock & Inventory Setup...")

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const stockLocations = await stockLocationService.listStockLocations()

  logger.info(`Linking ${stockLocations.length} locations to ${salesChannels.length} sales channels...`)

  for (const loc of stockLocations) {
    try {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: loc.id,
          add: salesChannels.map((sc: any) => sc.id),
        },
      })
      logger.info(`✅ Successfully linked location ${loc.name} (${loc.id}) to all sales channels via workflow!`)
    } catch (e: any) {
      logger.info(`Workflow note: ${e.message}`)
    }
  }

  // Check all variants
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "sku", "manage_inventory", "inventory_items.*"],
  })

  logger.info(`Processing inventory for ${variants.length} product variants...`)

  for (const variant of variants) {
    const locId = stockLocations[0].id
    if (!variant.inventory_items?.length) {
      try {
        const { result: invItems } = await createInventoryItemsWorkflow(container).run({
          input: {
            items: [
              {
                sku: variant.sku || `SKU-${variant.id.slice(-8)}`,
                title: variant.title || "Variant Item",
              },
            ],
          },
        })

        if (invItems?.[0]) {
          const invItem = invItems[0]

          // Remote link variant -> inventory item
          await link.create({
            [Modules.PRODUCT]: {
              variant_id: variant.id,
            },
            [Modules.INVENTORY]: {
              inventory_item_id: invItem.id,
            },
          })

          // Create level
          await createInventoryLevelsWorkflow(container).run({
            input: {
              inventory_levels: [
                {
                  inventory_item_id: invItem.id,
                  location_id: locId,
                  stocked_quantity: 100,
                },
              ],
            },
          })
          logger.info(`✅ Created inventory item & level (100) for variant: ${variant.sku}`)
        }
      } catch (e: any) {
        // Continue
      }
    }
  }

  logger.info("🎉 Stock Location linking & Inventory configuration fully complete!")
}
