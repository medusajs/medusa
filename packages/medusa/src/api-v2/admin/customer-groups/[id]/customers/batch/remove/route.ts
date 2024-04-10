import { deleteCustomerGroupCustomersWorkflow } from "@medusajs/core-flows"
import { AdminCustomerGroupResponse } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminPostCustomerGroupsGroupCustomersBatchReq } from "../../../../validators"

export const POST = async (
  // eslint-disable-next-line max-len
  req: AuthenticatedMedusaRequest<AdminPostCustomerGroupsGroupCustomersBatchReq>,
  res: MedusaResponse<AdminCustomerGroupResponse>
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

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer_group",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [customer_group] = await remoteQuery(queryObject)

  res.status(200).json({ customer_group })
}
