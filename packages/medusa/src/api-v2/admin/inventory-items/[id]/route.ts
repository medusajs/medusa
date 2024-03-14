import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory",
    variables: {
      filters: { id },
      skip: 0,
      take: 1,
    },

    fields: req.retrieveConfig.select as string[],
  })

  const { rows } = await remoteQuery(query)

  const [inventory_item] = rows

  if (!inventory_item) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Inventory item  with id: ${id} was not found`
    )
  }

  res.status(200).json({
    inventory_item,
  })
}
