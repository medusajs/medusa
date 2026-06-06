import { createLinksWorkflow } from "@zjedene-medusa/core-flows"
import { Modules } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchVariant } from "../../../../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateVariantInventoryItem,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductVariantResponse>
) => {
  const variantId = req.params.variant_id

  await createLinksWorkflow(req.scope).run({
    input: [
      {
        [Modules.PRODUCT]: { variant_id: variantId },
        [Modules.INVENTORY]: {
          inventory_item_id: req.validatedBody.inventory_item_id,
        },
        data: { required_quantity: req.validatedBody.required_quantity },
      },
    ],
  })

  const variant = await refetchVariant(
    variantId,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ variant })
}
