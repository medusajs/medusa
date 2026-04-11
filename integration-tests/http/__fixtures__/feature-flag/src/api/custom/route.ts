import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { defineFileConfig, FeatureFlag } from "@medusajs/utils"

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ message: "Custom GET" })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ message: "Custom POST", body: req.validatedBody })
}
