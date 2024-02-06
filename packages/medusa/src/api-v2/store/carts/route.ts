import { createCartsWorkflow } from "@medusajs/core-flows"
import { CreateCartDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const createCartWorkflow = createCartsWorkflow(req.scope)
  const cartData = [
    {
      ...(req.validatedBody as CreateCartDTO),
    },
  ]

  const { result, errors } = await createCartWorkflow.run({
    input: { cartData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ cart: result[0] })
}
