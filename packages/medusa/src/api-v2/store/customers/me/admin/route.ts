import {
  defaultStoreCustomersFields,
  defaultStoreCustomersRelations,
} from "../../../../../api"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.user!.customer_id

  const customerModule = req.scope.resolve(ModuleRegistrationName.CUSTOMER)

  const customer = await customerModule.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.json({ customer })
}
