import { MedusaRequest, MedusaResponse } from "../../../types/routing"

import { ContainerRegistrationKeys } from "@medusajs/utils"
import { CreateCustomerDTO } from "@medusajs/types"
import { createCustomerAccountWorkflow } from "@medusajs/core-flows"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.session.auth_user.app_metadata.customer_id) {
    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )
    const query = {
      customer: {
        __args: { id: req.session.auth_user.app_metadata.customer_id },
      },
    }

    const [customer] = await remoteQuery(query)

    res.status(200).json({ customer })

    return
  }

  const createCustomers = createCustomerAccountWorkflow(req.scope)
  const customersData = req.validatedBody as CreateCustomerDTO

  const { result } = await createCustomers.run({
    input: { customersData, authUserId: req.session.authUser!.id },
  })

  req.session.auth_user.app_metadata.customer_id = result.id
  res.status(200).json({ customer: result })
}
