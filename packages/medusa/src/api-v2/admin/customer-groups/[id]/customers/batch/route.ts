import { AdminCustomerGroupResponse, BatchMethodRequest } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminSetCustomersCustomerGroupType } from "../../../validators"
import {
  createCustomerGroupCustomersWorkflow,
  deleteCustomerGroupCustomersWorkflow,
} from "@medusajs/core-flows"
import { refetchCustomerGroup } from "../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<
      AdminSetCustomersCustomerGroupType,
      AdminSetCustomersCustomerGroupType
    >
  >,
  res: MedusaResponse<AdminCustomerGroupResponse>
) => {
  const { id } = req.params
  const { create, delete: toDelete } = req.validatedBody

  if (!!create && create?.length > 0) {
    const createCustomers = createCustomerGroupCustomersWorkflow(req.scope)
    const { errors } = await createCustomers.run({
      input: {
        groupCustomers: create.map((c) => ({
          customer_id: c,
          customer_group_id: id,
        })),
      },
      throwOnError: false,
    })

    if (Array.isArray(errors) && errors[0]) {
      throw errors[0].error
    }
  }

  if (!!toDelete && toDelete?.length > 0) {
    const deleteCustomers = deleteCustomerGroupCustomersWorkflow(req.scope)
    const { errors } = await deleteCustomers.run({
      input: {
        groupCustomers: toDelete.map((c) => ({
          customer_id: c,
          customer_group_id: id,
        })),
      },
      throwOnError: false,
    })

    if (Array.isArray(errors) && errors[0]) {
      throw errors[0].error
    }
  }

  const customerGroup = await refetchCustomerGroup(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer_group: customerGroup })
}
