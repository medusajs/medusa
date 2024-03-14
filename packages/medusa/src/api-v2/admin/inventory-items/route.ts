import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { AdminPostInventoryItemsReq } from "./validators"
import { ManyToManyInventoryFeatureFlag } from "@medusajs/utils"
import { MedusaError } from "@medusajs/utils"
import { Modules } from "../../../../../modules-sdk/dist"
import { createInventoryItemsWorkflow } from "@medusajs/core-flows"
import { defaultAdminProductsVariantFields } from "../products/query-config"

// Create inventory-item
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostInventoryItemsReq>,
  res: MedusaResponse
) => {
  const featureFlagRouter = req.scope.resolve(
    ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
  )

  const { variant_id, ...inventoryItemInput } = req.validatedBody

  if (
    !variant_id &&
    !featureFlagRouter.isFeatureEnabled(ManyToManyInventoryFeatureFlag.key)
  ) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "variant_id is required"
    )
  }

  const { result } = await createInventoryItemsWorkflow(req.scope).run({
    input: { items: [{ ...inventoryItemInput, _associationTag: variant_id }] },
  })

  const inventory_item = result[0]

  res.status(200).json({ inventory_item })
}
