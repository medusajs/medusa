import { dismissLinksWorkflow, updateLinksWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../../types/routing"
import { refetchVariant } from "../../../../../helpers"
import { AdminUpdateVariantInventoryItemType } from "../../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateVariantInventoryItemType>,
  res: MedusaResponse
) => {
  const variantId = req.params.variant_id
  const inventoryItemId = req.params.inventory_item_id

  await updateLinksWorkflow(req.scope).run({
    input: [
      {
        [Modules.PRODUCT]: { variant_id: variantId },
        [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
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

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const variantId = req.params.variant_id
  const inventoryItemId = req.params.inventory_item_id

  const {
    result: [deleted],
  } = await dismissLinksWorkflow(req.scope).run({
    input: [
      {
        [Modules.PRODUCT]: { variant_id: variantId },
        [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
      },
    ],
  })

  const parent = await refetchVariant(
    variantId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id: deleted,
    object: "variant-inventory-item-link",
    deleted: true,
    parent,
  })
}
