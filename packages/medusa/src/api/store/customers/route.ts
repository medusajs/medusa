import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { createCustomerAccountWorkflow } from "@medusajs/core-flows"
import { refetchCustomer } from "./helpers"
import { StoreCreateCustomerType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreateCustomerType>,
  res: MedusaResponse
) => {
  if (req.auth.actor_id) {
    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const query = remoteQueryObjectFromString({
      entryPoint: "customer",
      variables: { id: req.auth.actor_id },
      fields: [],
    })
    const [customer] = await remoteQuery(query)

    res.status(200).json({ customer })

    return
  }

  const createCustomers = createCustomerAccountWorkflow(req.scope)
  const customersData = req.validatedBody

  const { result } = await createCustomers.run({
    input: { customersData, authUserId: req.auth.auth_user_id },
  })

  // Set customer_id on session user if we are in session
  if (req.session.auth_user) {
    req.session.auth_user.app_metadata.customer_id = result.id
  }

  const customer = await refetchCustomer(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ customer })
}
