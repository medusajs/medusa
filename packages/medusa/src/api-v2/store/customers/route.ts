import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { createCustomersWorkflow } from "@medusajs/core-flows"
import { CreateCustomerDTO } from "@medusajs/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.user?.customer_id) {
    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )
    const query = {
      customer: {
        __args: {
          id: req.user.customer_id,
        },
      },
    }

    const [customer] = await remoteQuery(query)

    res.status(200).json({ customer: customer })
    return
  }

  if (!req.user?.authUser?.id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Cannot create a customer without an authenticated user session"
    )
  }

  const createCustomers = createCustomersWorkflow(req.scope)
  const customersData = [req.validatedBody as CreateCustomerDTO]

  const { result } = await createCustomers.run({
    input: { customersData, authUserId: req.user.authUser.id },
  })

  res.status(200).json({ customer: result[0] })
}
