import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"

import { AdminPostCustomerGroupsGroupCustomersBatchReq } from "../../../validators"
import { deleteCustomerGroupCustomersWorkflow } from "@medusajs/core-flows"

export const POST = async (
  // eslint-disable-next-line max-len
  req: AuthenticatedMedusaRequest<AdminPostCustomerGroupsGroupCustomersBatchReq>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { customer_ids } = req.validatedBody

  const deleteCustomers = deleteCustomerGroupCustomersWorkflow(req.scope)

  const { errors } = await deleteCustomers.run({
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

  res.status(200).json({
    object: "customer_group_customers",
    deleted: true,
  })
}
