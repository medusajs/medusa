import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"
import { EbaySyncService } from "../../../modules/marketplace-ebay/services/ebay-sync"

function verifyEbaySignature(req: MedusaRequest): boolean {
  const verificationToken = process.env.EBAY_WEBHOOK_VERIFICATION_TOKEN
  if (!verificationToken) return true

  const signature = req.headers["x-ebay-signature"] as string
  if (!signature) return false

  const hmac = crypto.createHmac("sha256", verificationToken)
  hmac.update(JSON.stringify(req.body))
  const expected = hmac.digest("base64")
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

// eBay endpoint validation (GET) and notification handling (POST)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { challenge_code } = req.query as { challenge_code?: string }
  if (!challenge_code) return res.status(400).json({ error: "Missing challenge_code" })

  const verificationToken = process.env.EBAY_WEBHOOK_VERIFICATION_TOKEN || ""
  const endpoint = `${process.env.MEDUSA_BACKEND_URL}/webhooks/ebay`
  const hash = crypto
    .createHash("sha256")
    .update(challenge_code + verificationToken + endpoint)
    .digest("hex")

  res.status(200).json({ challengeResponse: hash })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (!verifyEbaySignature(req)) {
    return res.status(401).json({ error: "Invalid signature" })
  }

  const { topic, notification } = req.body as { topic?: string; notification?: unknown }

  try {
    const ebay = new EbaySyncService(req.scope as any, {
      clientId:            process.env.EBAY_CLIENT_ID!,
      clientSecret:        process.env.EBAY_CLIENT_SECRET!,
      refreshToken:        process.env.EBAY_REFRESH_TOKEN!,
      sandbox:             process.env.NODE_ENV !== "production",
      fulfillmentPolicyId: process.env.EBAY_FULFILLMENT_POLICY_ID!,
      paymentPolicyId:     process.env.EBAY_PAYMENT_POLICY_ID!,
      returnPolicyId:      process.env.EBAY_RETURN_POLICY_ID!,
      merchantLocationKey: process.env.EBAY_MERCHANT_LOCATION_KEY!,
    })
    await ebay.handleWebhook(topic || "", notification)
    res.status(200).json({ received: true })
  } catch (err) {
    console.error("eBay webhook error:", err)
    res.status(200).json({ received: true })
  }
}
