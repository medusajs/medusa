import { addRulesToFulfillmentShippingOptionWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminShippingOptionRulesBatchAddType } from "../../../../../validators"
import {AdminShippingOptionRetrieveResponse} from "@medusajs/types";

export const POST = async (
  req: AuthenticatedMedusaRequest<
    AdminShippingOptionRulesBatchAddType,
    AdminShippingOptionRetrieveResponse
  >,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = addRulesToFulfillmentShippingOptionWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: {
      data: req.validatedBody.rules.map((rule) => ({
        ...rule,
        shipping_option_id: id,
      })),
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "shipping_options",
    variables: {
      id: req.params.id,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const [shippingOption] = await remoteQuery(query)

  res.status(200).json({ shipping_option: shippingOption })
}
