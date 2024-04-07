import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminShippingOptionRetrieveResponse } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {AdminUpdateShippingOptionType} from "../validators";
import {
  updateShippingOptionsWorkflow
} from "@medusajs/core-flows/dist/fulfillment/workflows/update-shipping-options";

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateShippingOptionType>,
  res: MedusaResponse<AdminShippingOptionRetrieveResponse>
) => {
  const shippingOptionPayload = req.validatedBody

  const workflow = updateShippingOptionsWorkflow(req.scope)

  const { result, errors } = await workflow.run({
    input: [shippingOptionPayload],
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const shippingOptionId = result[0].id

  const query = remoteQueryObjectFromString({
    entryPoint: "shipping_options",
    variables: {
      id: shippingOptionId,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const [shippingOption] = await remoteQuery(query)

  res.status(200).json({ shipping_option: shippingOption })
}
