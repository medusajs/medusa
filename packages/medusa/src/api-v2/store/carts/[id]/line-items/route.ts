import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // const updateCartWorkflow = updateCartsWorkflow(req.scope)

  // const workflowInput = req.validatedBody

  // const { result, errors } = await updateCartWorkflow.run({
  //   input: [workflowInput],
  //   throwOnError: false,
  // })

  // if (Array.isArray(errors) && errors[0]) {
  //   throw errors[0].error
  // }

  res.status(200).json({ cart: "result[0]" })
}
