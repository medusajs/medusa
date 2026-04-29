import { createPaymentSessionsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"

/**
 * @since 2.14.2
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminInitializePaymentSession,
    HttpTypes.AdminGetPaymentCollectionParams
  >,
  res: MedusaResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { id } = req.params
  const { provider_id, data } = req.validatedBody

  await createPaymentSessionsWorkflow(req.scope).run({
    input: {
      payment_collection_id: id,
      provider_id,
      data,
    },
  })

  const paymentCollection = await refetchEntity({
    entity: "payment_collection",
    idOrFilter: id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ payment_collection: paymentCollection })
}
