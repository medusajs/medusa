import { MedusaContainer } from "@medusajs/framework/utils"
import { EbaySyncService } from "../modules/marketplace-ebay/services/ebay-sync"
import { OttoSyncService } from "../modules/marketplace-otto/services/otto-sync"
import { AmazonSyncService } from "../modules/marketplace-amazon/services/amazon-sync"

// Runs every 4 hours — syncs products to all marketplaces and imports new orders
export default async function marketplaceSyncJob(container: MedusaContainer) {
  const logger = (container as any).resolve?.("logger") || console

  const ebayEnabled  = !!process.env.EBAY_CLIENT_ID
  const ottoEnabled  = !!process.env.OTTO_API_KEY
  const amazonEnabled = !!process.env.AMAZON_CLIENT_ID

  logger.info?.("🔄 Starting marketplace sync job")

  // ── eBay ─────────────────────────────────────────────────────────────────
  if (ebayEnabled) {
    const ebay = new EbaySyncService(container, {
      clientId:             process.env.EBAY_CLIENT_ID!,
      clientSecret:         process.env.EBAY_CLIENT_SECRET!,
      refreshToken:         process.env.EBAY_REFRESH_TOKEN!,
      sandbox:              process.env.NODE_ENV !== "production",
      fulfillmentPolicyId:  process.env.EBAY_FULFILLMENT_POLICY_ID!,
      paymentPolicyId:      process.env.EBAY_PAYMENT_POLICY_ID!,
      returnPolicyId:       process.env.EBAY_RETURN_POLICY_ID!,
      merchantLocationKey:  process.env.EBAY_MERCHANT_LOCATION_KEY!,
    })

    const [productResult, orderResult] = await Promise.allSettled([
      ebay.syncProductsToEbay(),
      ebay.importNewEbayOrders(),
    ])

    if (productResult.status === "fulfilled") {
      logger.info?.(`eBay products: ${productResult.value.synced} synced, ${productResult.value.errors.length} errors`)
    }
    if (orderResult.status === "fulfilled") {
      logger.info?.(`eBay orders: ${orderResult.value.imported} imported`)
    }
  }

  // ── Otto ──────────────────────────────────────────────────────────────────
  if (ottoEnabled) {
    const otto = new OttoSyncService(container, {
      apiKey:  process.env.OTTO_API_KEY!,
      sandbox: process.env.NODE_ENV !== "production",
    })

    const [productResult, orderResult] = await Promise.allSettled([
      otto.syncProductsToOtto(),
      otto.importNewOttoOrders(),
    ])

    if (productResult.status === "fulfilled") {
      logger.info?.(`Otto products: ${productResult.value.synced} synced`)
    }
    if (orderResult.status === "fulfilled") {
      logger.info?.(`Otto orders: ${orderResult.value.imported} imported`)
    }
  }

  // ── Amazon ────────────────────────────────────────────────────────────────
  if (amazonEnabled) {
    const amazon = new AmazonSyncService(container, {
      sellerId:      process.env.AMAZON_SELLER_ID!,
      marketplaceId: process.env.AMAZON_MARKETPLACE_ID || "A1F83G8C2ARO7P",
      clientId:      process.env.AMAZON_CLIENT_ID!,
      clientSecret:  process.env.AMAZON_CLIENT_SECRET!,
      refreshToken:  process.env.AMAZON_REFRESH_TOKEN!,
      region:        process.env.AMAZON_REGION || "eu-west-1",
    })

    const [productResult, orderResult] = await Promise.allSettled([
      amazon.syncProductsToAmazon(),
      amazon.importNewAmazonOrders(),
    ])

    if (productResult.status === "fulfilled") {
      logger.info?.(`Amazon products: ${productResult.value.synced} synced`)
    }
    if (orderResult.status === "fulfilled") {
      logger.info?.(`Amazon orders: ${orderResult.value.imported} imported`)
    }
  }

  logger.info?.("✅ Marketplace sync job complete")
}

export const config = {
  name: "marketplace-sync",
  schedule: "0 */4 * * *",  // every 4 hours
}
