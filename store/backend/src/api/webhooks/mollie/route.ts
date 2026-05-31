import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Mollie sends a POST with only `id` in the body — we then fetch the payment status
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.body as { id?: string }

  if (!id) {
    return res.status(400).json({ error: "Missing payment id" })
  }

  try {
    const paymentModule = req.scope.resolve("payment")
    await paymentModule.processEvent({
      provider: "mollie",
      payload: {
        data: { id },
        rawData: req.body,
        headers: req.headers,
      },
    })

    // Mollie expects a 200 OK with empty body to acknowledge
    res.status(200).send("")
  } catch (err) {
    // Still return 200 to prevent Mollie from retrying (log the error internally)
    console.error("Mollie webhook error:", err)
    res.status(200).send("")
  }
}
