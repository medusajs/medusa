import { createLinksWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { refetchVariant } from "../../../../helpers"
import { AdminCreateVariantInventoryItemType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateVariantInventoryItemType>,
  res: MedusaResponse
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
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ variant })
}
