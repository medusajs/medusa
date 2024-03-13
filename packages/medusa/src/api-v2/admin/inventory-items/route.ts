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

// List invites
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory_items",
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: [...(req.listConfig.select as string[])],
  })

  const { rows: items, metadata } = await remoteQuery({
    ...query,
  })

  const inventory_items = items.map((i) => {
    const [stocked_quantity, reserved_quantity] = i.location_levels.reduce(
      ([stocked, reserved], level) => [
        stocked + level.stocked_quantity ?? 0,
        reserved + level.reserved_quantity ?? 0,
      ],
      [0, 0]
    )

    return {
      ...i,
      reserved_quantity,
      stocked_quantity,
    }
  })

  res.status(200).json({
    inventory_items,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

// // Create invite
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
