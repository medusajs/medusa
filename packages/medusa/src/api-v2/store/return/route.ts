import { CreateOrderReturnDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const input = [req.validatedBody as CreateOrderReturnDTO]

  const { result, errors } = await createReturnsWorkflow(req.scope).run({
    input: { products: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ return: result })
}
