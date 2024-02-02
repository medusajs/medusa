import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultStoreCartRemoteQueryObject } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const query = {
    cart: {
      __args: variables,
      ...defaultStoreCartRemoteQueryObject,
    },
  }

  const [cart] = await remoteQuery(query)

  res.json({ cart })
}
