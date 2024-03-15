import { addRulesToFulfillmentShippingOptionWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../../types/routing"
import {
  defaultAdminShippingOptionFields,
  defaultAdminShippingOptionRelations,
} from "../../../../../query-config"
import { AdminPostFulfillmentShippingOptionsRulesBatchAddReq } from "../../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostFulfillmentShippingOptionsRulesBatchAddReq>,
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

  const fulfillmentService: IFulfillmentModuleService = req.scope.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  const shippingOption = await fulfillmentService.retrieveShippingOption(id, {
    select: defaultAdminShippingOptionFields,
    relations: defaultAdminShippingOptionRelations,
  })

  res.status(200).json({ shipping_option: shippingOption })
}
