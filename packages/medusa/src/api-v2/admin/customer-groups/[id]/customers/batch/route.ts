import { createCustomerGroupCustomersWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"
import { AdminPostCustomerGroupsGroupCustomersBatchReq } from "../../../validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { customer_ids } =
    req.validatedBody as AdminPostCustomerGroupsGroupCustomersBatchReq

  const createCustomers = createCustomerGroupCustomersWorkflow(req.scope)

  const { result, errors } = await createCustomers.run({
    input: {
      groupCustomers: customer_ids.map((c) => ({
        customer_id: c.id,
        customer_group_id: id,
      })),
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ customer_group_customers: result })
}
