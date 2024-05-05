import { completeCartWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchOrder } from "../../../orders/helpers"
import { StoreCompleteCartType } from "../../validators"

export const POST = async (
  req: MedusaRequest<StoreCompleteCartType>,
  res: MedusaResponse
) => {
  const cart_id = req.params.id

  // If the idempotencyKey is present:
  //  - is workflow is running?
  //    = throw error
  //  - else
  //   - re-run the workflow at the failed step

  const { errors, result } = await completeCartWorkflow(req.scope).run({
    input: { id: req.params.id },
    context: {
      transactionId: cart_id,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const order = await refetchOrder(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ order })
}
