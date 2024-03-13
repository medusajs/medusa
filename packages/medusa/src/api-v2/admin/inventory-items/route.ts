import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

// List inventory-items
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
