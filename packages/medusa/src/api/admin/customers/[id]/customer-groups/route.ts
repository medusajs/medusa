import { linkCustomerGroupsToCustomerWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import { HttpTypes } from "@zjedene-medusa/framework/types"

import { refetchCustomer } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminCustomerResponse>
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody

  const workflow = linkCustomerGroupsToCustomerWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      add,
      remove,
    },
  })

  const customer = await refetchCustomer(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ customer: customer })
}
