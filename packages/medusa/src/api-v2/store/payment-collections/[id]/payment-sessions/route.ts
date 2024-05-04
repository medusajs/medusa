import { createPaymentSessionsWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { defaultStorePaymentCollectionFields } from "./query-config"
import { StorePostPaymentCollectionsPaymentSessionReq } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<StorePostPaymentCollectionsPaymentSessionReq>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { context = {}, provider_id, data } = req.body

  // If the customer is logged in, we auto-assign them to the payment collection
  if (req.auth?.actor_id) {
    context.customer = {
      ...context.customer,
      id: req.auth.actor_id,
    }
  }

  const workflowInput = {
    payment_collection_id: id,
    provider_id: provider_id,
    data,
    context,
  }

  const { errors } = await createPaymentSessionsWorkflow(req.scope).run({
    input: workflowInput as any,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const query = remoteQueryObjectFromString({
    entryPoint: "payment_collection",
    variables: { cart: { id } },
    fields: defaultStorePaymentCollectionFields,
  })

  const [result] = await remoteQuery(query)

  res.status(200).json({ payment_collection: result })
}
