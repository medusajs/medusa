import { createPaymentCollectionForCartWorkflow, refreshPaymentCollectionForCartWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { Modules } from "@medusajs/utils"

const getPaymentCollectionForCart = async (req: AuthenticatedMedusaRequest<HttpTypes.StoreCreatePaymentCollection>) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const { cart_id } = req.body

  const [cartCollectionRelation] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "cart_payment_collection",
      variables: { filters: { cart_id } },
      fields: req.remoteQueryConfig.fields.map(
        (f) => `payment_collection.${f}`
      ) as any,
    })
  )
  return cartCollectionRelation?.payment_collection
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.StoreCreatePaymentCollection>,
  res: MedusaResponse<HttpTypes.StorePaymentCollectionResponse>
) => {
  const { cart_id } = req.body

  // We can potentially refactor the workflow to behave more like an upsert and return an existing collection if there is one.

  let paymentCollection = await getPaymentCollectionForCart(req)
  if (!paymentCollection) {
    const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)
    await we.run(createPaymentCollectionForCartWorkflowId, {
      input: req.body,
    })
    paymentCollection = await getPaymentCollectionForCart(req)
  } else {
    await refreshPaymentCollectionForCartWorkflow(req.scope).run({
      input: { cart_id },
    })
    paymentCollection = await getPaymentCollectionForCart(req)
  }

  res.status(200).json({ payment_collection: paymentCollection })
}