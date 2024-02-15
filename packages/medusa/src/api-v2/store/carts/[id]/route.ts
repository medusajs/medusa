import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultStoreCartRemoteQueryObject } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const query = {
    cart: {
      ...defaultStoreCartRemoteQueryObject,
    },
  }

  const [cart] = await remoteQuery(query, { cart: variables })

  res.json({ cart })
}
