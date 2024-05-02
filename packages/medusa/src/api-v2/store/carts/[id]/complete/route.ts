import { completeCartWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchOrder } from "../../../orders/helpers"
import { StoreCompleteCartType } from "../../validators"

export const POST = async (
  req: MedusaRequest<StoreCompleteCartType>,
  res: MedusaResponse
) => {
  const { errors } = await completeCartWorkflow(req.scope).run({
    input: { id: req.params.id },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const order = await refetchOrder(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ order })
}
