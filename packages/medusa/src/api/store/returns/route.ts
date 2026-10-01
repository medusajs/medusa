import { createAndCompleteReturnOrderWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * This API route is intentionally unauthenticated as the order ID is a UUID that requires brute forcing to
 * gain access to. The order ID is used as the authentication mechanism to ensure that only the customer with the order ID can create the return for the order.
 *
 * To restrict access to this route, follow [this guide](https://docs.medusajs.com/resources/commerce-modules/order/secure-return-creation).
 *
 * @since 2.8.0
 */
export const POST = async (
  req: MedusaRequest<HttpTypes.StoreCreateReturn>,
  res: MedusaResponse<HttpTypes.StoreReturnResponse>
) => {
  const input = req.validatedBody as HttpTypes.StoreCreateReturn

  const workflow = createAndCompleteReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  res.status(200).json({ return: result as HttpTypes.StoreReturn })
}
