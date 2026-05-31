import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AmazonSyncService } from "../../../modules/marketplace-amazon/services/amazon-sync"

// Amazon SP-API delivers notifications via SNS → this endpoint is the SNS subscription target
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const messageType = req.headers["x-amz-sns-message-type"] as string

  // SNS subscription confirmation
  if (messageType === "SubscriptionConfirmation") {
    const { SubscribeURL } = req.body as { SubscribeURL: string }
    const { default: axios } = await import("axios")
    await axios.get(SubscribeURL)  // Confirm the subscription
    return res.status(200).json({ confirmed: true })
  }

  if (messageType === "Notification") {
    const { Message } = req.body as { Message: string }
    try {
      const notification = JSON.parse(Message)
      const { NotificationType, Payload } = notification

      const amazon = new AmazonSyncService(req.scope as any, {
        sellerId:      process.env.AMAZON_SELLER_ID!,
        marketplaceId: process.env.AMAZON_MARKETPLACE_ID || "A1F83G8C2ARO7P",
        clientId:      process.env.AMAZON_CLIENT_ID!,
        clientSecret:  process.env.AMAZON_CLIENT_SECRET!,
        refreshToken:  process.env.AMAZON_REFRESH_TOKEN!,
        region:        process.env.AMAZON_REGION || "eu-west-1",
      })

      await amazon.handleSnsNotification(NotificationType, Payload)
    } catch (err) {
      console.error("Amazon SNS notification error:", err)
    }
  }

  res.status(200).json({ received: true })
}
