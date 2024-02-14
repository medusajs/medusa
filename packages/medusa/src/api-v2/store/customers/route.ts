import { MedusaRequest, MedusaResponse } from "../../../types/routing"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { CreateCustomerDTO } from "@medusajs/types"
import { createCustomerAccountWorkflow } from "@medusajs/core-flows"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.auth_user?.app_metadata?.customer_id) {
    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const query = remoteQueryObjectFromString({
      entryPoint: "customer",
      variables: { id: req.auth_user.app_metadata.customer_id },
      fields: [],
    })
    const [customer] = await remoteQuery(query)

    res.status(200).json({ customer })

    return
  }

  const createCustomers = createCustomerAccountWorkflow(req.scope)
  const customersData = req.validatedBody as CreateCustomerDTO

  const { result } = await createCustomers.run({
    input: { customersData, authUserId: req.auth_user!.id },
  })

  // Set customer_id on session user if we are in session
  if (req.session.auth_user) {
    req.session.auth_user.app_metadata.customer_id = result.id
  }
  res.status(200).json({ customer: result })
}
