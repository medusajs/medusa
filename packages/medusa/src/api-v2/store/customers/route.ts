import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { createStoreCustomersWorkflow } from "@medusajs/core-flows"
import { CreateCustomerDTO } from "@medusajs/types"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const createCustomers = createStoreCustomersWorkflow(req.scope)
  const customersData = [req.validatedBody as CreateCustomerDTO]

  const { result } = await createCustomers.run({
    input: { customersData },
  })

  res.status(200).json({ customer: result[0] })
}
