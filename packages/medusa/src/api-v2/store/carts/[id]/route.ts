import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartModuleService: ICartModuleService = req.scope.resolve(
    ModuleRegistrationName.CART
  )

  // TODO: Replace with remoteQuery
  const cart = await cartModuleService.retrieve(req.params.id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  // const remoteQuery = req.scope.resolve("remoteQuery")

  // const variables = { id: req.params.id }

  // const query = {
  //   cart: {
  //     __args: variables,
  //     ...defaultStoreCartRemoteQueryObject,
  //   },
  // }

  // const [cart] = await remoteQuery(query)

  res.json({ cart })
}
