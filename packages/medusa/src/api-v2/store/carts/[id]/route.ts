import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartModuleService: ICartModuleService = req.scope.resolve(
    ModuleRegistrationName.CART
  )

  const cart = await cartModuleService.retrieve(req.params.id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  res.json({ cart })
}
