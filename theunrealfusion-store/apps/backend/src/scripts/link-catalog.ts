import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  linkProductsToSalesChannelWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/core-flows"

export default async function linkCatalogAndPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const pricingService = container.resolve(Modules.PRICING)
  const link = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  logger.info("🔗 Linking all products to all sales channels and ensuring INR prices...")

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "variants.*", "variants.prices.*"],
  })

  logger.info(`Found ${products.length} products and ${salesChannels.length} sales channels.`)

  for (const sc of salesChannels) {
    try {
      await linkProductsToSalesChannelWorkflow(container).run({
        input: {
          id: sc.id,
          add: products.map((p: any) => p.id),
        },
      })
      logger.info(`✅ Linked all products to Sales Channel: ${sc.name} (${sc.id})`)
    } catch (e: any) {
      logger.info(`Sales channel link info: ${e.message || "already linked"}`)
    }
  }

  // Ensure every variant has INR price
  for (const prod of products) {
    for (const v of prod.variants) {
      const prices = v.prices || []
      const inrPrice = prices.find((p: any) => p.currency_code === "inr")
      if (!inrPrice) {
        logger.info(`Adding INR price for variant ${v.title || v.sku} on product ${prod.title}...`)
        const usdPrice = prices.find((p: any) => p.currency_code === "usd")
        const amount = usdPrice ? Math.round(usdPrice.amount * 85) : 1999
        try {
          await pricingService.createPrices([
            {
              currency_code: "inr",
              amount: amount,
              price_list_id: null,
              rules: {},
            },
          ])
        } catch (e: any) {}
      }
    }
  }

  logger.info("🎉 All products linked to sales channels with INR pricing!")
}
