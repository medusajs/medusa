import { CreateShippingOptionRuleDTO } from "./mutations"

export type AddFulfillmentShippingOptionRulesWorkflowDTO = {
  data: CreateShippingOptionRuleDTO[]
}

export type RemoveFulfillmentShippingOptionRulesWorkflowDTO = {
  ids: string[]
}
