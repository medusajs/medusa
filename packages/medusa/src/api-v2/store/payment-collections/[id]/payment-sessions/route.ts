import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { createPaymentSessionsWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { defaultStorePaymentCollectionFields } from "./query-config"
import { StorePostPaymentCollectionsPaymentSessionReq } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<StorePostPaymentCollectionsPaymentSessionReq>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { context = {}, provider_id, data = {} } = req.body

  // If the customer is logged in, we auto-assign them to the payment collection
  if (req.auth?.actor_id) {
    context.customer = {
      ...context.customer,
      id: req.auth.actor_id,
    }
  }

  const paymentService = req.scope.resolve<IPaymentModuleService>(
    ModuleRegistrationName.PAYMENT
  )

  const paymentCollection = await paymentService.retrievePaymentCollection(id, {
    select: ["id", "amount", "currency_code"],
  })

  const workflowInput = {
    payment_collection_id: id,
    provider_id: provider_id,
    data,
    context,
    amount: paymentCollection.amount, // TODO: Should be calculated from something or use payment collection?
    currency_code: paymentCollection.currency_code,
  }

  const { errors } = await createPaymentSessionsWorkflow(req.scope).run({
    input: workflowInput as any,
    throwOnError: false,
  })

  console.log("Errors: ", errors)

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id }

  const query = remoteQueryObjectFromString({
    entryPoint: "payment_collection",
    fields: defaultStorePaymentCollectionFields,
  })

  const [result] = await remoteQuery(query, { cart: variables })

  console.log("Result: ", result)

  res.status(200).json({ payment_collection: result })
}
