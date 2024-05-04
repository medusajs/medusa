import {
  CreateShippingOptionRuleDTO,
  UpdateShippingOptionRuleDTO,
} from "./mutations"

export type AddFulfillmentShippingOptionRulesWorkflowDTO = {
  data: CreateShippingOptionRuleDTO[]
}

export type RemoveFulfillmentShippingOptionRulesWorkflowDTO = {
  ids: string[]
}

export type UpdateFulfillmentShippingOptionRulesWorkflowDTO = {
  data: UpdateShippingOptionRuleDTO[]
}
