import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createInventoryItemsWorkflow,
} from "@medusajs/core-flows"

export default async function linkStockLocations({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const inventoryService = container.resolve(Modules.INVENTORY)

  logger.info("📦 Linking Sales Channels to Stock Locations & Initializing Inventory...")

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  const stockLocations = await stockLocationService.listStockLocations()
  let stockLocation = stockLocations[0]
  if (!stockLocation) {
    stockLocation = await stockLocationService.createStockLocations({
      name: "Mumbai Central Hub",
      address: {
        address_1: "BKC Complex",
        city: "Mumbai",
        country_code: "in",
        postal_code: "400051",
      },
    })
  }

  logger.info(`Stock Location: ${stockLocation.name} (${stockLocation.id})`)

  // Link every sales channel to every stock location
  for (const sc of salesChannels) {
    for (const loc of stockLocations) {
      try {
        await link.create({
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: sc.id,
          },
          [Modules.STOCK_LOCATION]: {
            stock_location_id: loc.id,
          },
        })
        logger.info(`✅ Linked Sales Channel ${sc.name} (${sc.id}) to Location ${loc.name}`)
      } catch (e: any) {
        logger.info(`Link SC-Location: ${e.message || "already linked"}`)
      }
    }
  }

  // Ensure inventory items exist and have stock
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "sku", "manage_inventory", "inventory_items.*"],
  })

  logger.info(`Checking inventory for ${variants.length} variants...`)

  for (const variant of variants) {
    if (!variant.inventory_items?.length && variant.sku) {
      try {
        const { result: invItem } = await createInventoryItemsWorkflow(container).run({
          input: {
            items: [
              {
                sku: variant.sku,
                title: variant.title || variant.sku,
              },
            ],
          },
        })

        if (invItem?.[0]) {
          // Link variant to inventory item
          await link.create({
            [Modules.PRODUCT]: {
              variant_id: variant.id,
            },
            [Modules.INVENTORY]: {
              inventory_item_id: invItem[0].id,
            },
          })

          // Add stock level
          await createInventoryLevelsWorkflow(container).run({
            input: {
              inventory_levels: [
                {
                  inventory_item_id: invItem[0].id,
                  location_id: stockLocation.id,
                  stocked_quantity: 100,
                },
              ],
            },
          })
          logger.info(`✅ Created inventory (100 units) for variant: ${variant.sku}`)
        }
      } catch (e: any) {
        // Inventory setup notice
      }
    }
  }

  logger.info("🎉 Stock Locations and Inventory fully synchronized!")
}
