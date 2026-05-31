import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"
import { OttoSyncService } from "../../../modules/marketplace-otto/services/otto-sync"

function verifyOttoSignature(req: MedusaRequest): boolean {
  const secret = process.env.OTTO_WEBHOOK_SECRET
  if (!secret) return true

  const signature = req.headers["x-otto-signature"] as string
  if (!signature) return false

  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(JSON.stringify(req.body))
  const expected = `sha256=${hmac.digest("hex")}`
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (!verifyOttoSignature(req)) {
    return res.status(401).json({ error: "Invalid signature" })
  }

  const { event, payload } = req.body as { event?: string; payload?: unknown }

  try {
    const otto = new OttoSyncService(req.scope as any, {
      apiKey:  process.env.OTTO_API_KEY!,
      sandbox: process.env.NODE_ENV !== "production",
    })
    await otto.handleWebhook(event || "", payload)
    res.status(200).json({ received: true })
  } catch (err) {
    console.error("Otto webhook error:", err)
    res.status(200).json({ received: true })
  }
}
