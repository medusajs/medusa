import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules, MedusaContainer } from "@medusajs/framework/utils"
import { EbaySyncService } from "../modules/marketplace-ebay/services/ebay-sync"
import { OttoSyncService } from "../modules/marketplace-otto/services/otto-sync"
import { AmazonSyncService } from "../modules/marketplace-amazon/services/amazon-sync"

type OrderShippedPayload = {
  id: string
  tracking_number?: string
  carrier?: string
  metadata?: Record<string, string>
}

// When an order is fulfilled in Medusa, push shipment confirmation to source marketplace
export default async function orderShippedSubscriber({
  event,
  container,
}: {
  event: { data: OrderShippedPayload }
  container: MedusaContainer
}) {
  const logger = (container as any).resolve?.("logger") || console
  const { id, tracking_number, carrier, metadata } = event.data

  if (!tracking_number) return

  const source = metadata?.marketplace_source
  if (!source) return  // Direct store order, no marketplace notification needed

  logger.info?.(`Notifying ${source} of shipment for order ${id}`)

  try {
    if (source === "ebay" && process.env.EBAY_CLIENT_ID) {
      const ebay = new EbaySyncService(container, {
        clientId:            process.env.EBAY_CLIENT_ID!,
        clientSecret:        process.env.EBAY_CLIENT_SECRET!,
        refreshToken:        process.env.EBAY_REFRESH_TOKEN!,
        sandbox:             process.env.NODE_ENV !== "production",
        fulfillmentPolicyId: process.env.EBAY_FULFILLMENT_POLICY_ID!,
        paymentPolicyId:     process.env.EBAY_PAYMENT_POLICY_ID!,
        returnPolicyId:      process.env.EBAY_RETURN_POLICY_ID!,
        merchantLocationKey: process.env.EBAY_MERCHANT_LOCATION_KEY!,
      })
      await ebay.confirmShipment(
        metadata.marketplace_order_id!,
        tracking_number,
        carrier || "ROYALMAIL"
      )
    }

    if (source === "otto" && process.env.OTTO_API_KEY) {
      const otto = new OttoSyncService(container, {
        apiKey:  process.env.OTTO_API_KEY!,
        sandbox: process.env.NODE_ENV !== "production",
      })
      await otto.markOttoOrderShipped(
        metadata.marketplace_order_id!,
        (metadata.marketplace_item_ids || "").split(","),
        tracking_number,
        carrier || "DPD"
      )
    }

    if (source === "amazon" && process.env.AMAZON_CLIENT_ID) {
      const amazon = new AmazonSyncService(container, {
        sellerId:      process.env.AMAZON_SELLER_ID!,
        marketplaceId: process.env.AMAZON_MARKETPLACE_ID || "A1F83G8C2ARO7P",
        clientId:      process.env.AMAZON_CLIENT_ID!,
        clientSecret:  process.env.AMAZON_CLIENT_SECRET!,
        refreshToken:  process.env.AMAZON_REFRESH_TOKEN!,
        region:        process.env.AMAZON_REGION || "eu-west-1",
      })
      await amazon.confirmShipment(
        metadata.marketplace_order_id!,
        metadata.marketplace_item_id!,
        tracking_number,
        carrier || "ROYAL_MAIL"
      )
    }
  } catch (err) {
    logger.error?.(`Failed to notify ${source} of shipment: ${err instanceof Error ? err.message : String(err)}`)
  }
}

export const config = {
  event: "order.shipment_created",
}
