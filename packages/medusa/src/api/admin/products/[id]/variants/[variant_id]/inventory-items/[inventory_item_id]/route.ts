import { dismissLinksWorkflow, updateLinksWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchVariant } from "../../../../../helpers"
import { AdminUpdateVariantInventoryItemType } from "../../../../../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateVariantInventoryItemType>,
  res: MedusaResponse<HttpTypes.AdminProductVariantResponse>
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
  res: MedusaResponse<HttpTypes.AdminProductVariantInventoryLinkDeleteResponse>
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
    id: deleted as unknown as HttpTypes.AdminProductVariantInventoryLink,
    object: "variant-inventory-item-link",
    deleted: true,
    parent,
  })
}
