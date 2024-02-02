import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { createCustomerAccountWorkflow } from "@medusajs/core-flows"
import { CreateCustomerDTO } from "@medusajs/types"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const createCustomers = createCustomerAccountWorkflow(req.scope)
  const customersData = req.validatedBody as CreateCustomerDTO

  const { result } = await createCustomers.run({
    input: { customersData, authUserId: req.auth_user!.id },
  })

  res.status(200).json({ customer: result })
}
