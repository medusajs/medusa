import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.auth_user!.app_metadata.customer_id

  const customerModule = req.scope.resolve(ModuleRegistrationName.CUSTOMER)

  const customer = await customerModule.retrieve(id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  res.json({ customer })
}
