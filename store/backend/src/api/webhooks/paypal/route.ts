import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import axios from "axios"
import crypto from "crypto"

async function verifyPayPalWebhook(req: MedusaRequest): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) return true // skip verification in dev

  const transmissionId   = req.headers["paypal-transmission-id"] as string
  const timestamp        = req.headers["paypal-transmission-time"] as string
  const webhookSignature = req.headers["paypal-transmission-sig"] as string
  const certUrl          = req.headers["paypal-cert-url"] as string
  const authAlgo         = req.headers["paypal-auth-algo"] as string

  try {
    const isSandbox = process.env.PAYPAL_SANDBOX === "true"
    const baseUrl = isSandbox
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com"

    const credentials = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64")

    const { data: tokenData } = await axios.post(
      `${baseUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      { headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" } }
    )

    const { data } = await axios.post(
      `${baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: webhookSignature,
        transmission_time: timestamp,
        webhook_id: webhookId,
        webhook_event: req.body,
      },
      { headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json" } }
    )

    return data.verification_status === "SUCCESS"
  } catch {
    return false
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const isValid = await verifyPayPalWebhook(req)
  if (!isValid) {
    return res.status(400).json({ error: "Invalid webhook signature" })
  }

  try {
    const paymentModule = req.scope.resolve("payment")
    await paymentModule.processEvent({
      provider: "paypal",
      payload: {
        data: req.body,
        rawData: req.body,
        headers: req.headers,
      },
    })
    res.status(200).json({ received: true })
  } catch (err) {
    console.error("PayPal webhook error:", err)
    res.status(200).json({ received: true })
  }
}
