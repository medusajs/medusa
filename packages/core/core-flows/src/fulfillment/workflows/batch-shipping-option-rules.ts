import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreateShippingOptionRuleDTO,
  ShippingOptionRuleDTO,
  UpdateShippingOptionRuleDTO,
} from "@medusajs/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import {
  createShippingOptionRulesStep,
  deleteShippingOptionRulesStep,
} from "../steps"
import { updateShippingOptionRulesStep } from "../steps/update-shipping-option-rules"

export const batchShippingOptionRulesWorkflowId = "batch-shipping-option-rules"
export const batchShippingOptionRulesWorkflow = createWorkflow(
  batchShippingOptionRulesWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<
        CreateShippingOptionRuleDTO,
        UpdateShippingOptionRuleDTO
      >
    >
  ): WorkflowData<BatchWorkflowOutput<ShippingOptionRuleDTO>> => {
    const actionInputs = transform({ input }, (data) => {
      const { create, update, delete: del } = data.input
      return {
        createInput: { data: create ?? [] },
        updateInput: { data: update ?? [] },
        deleteInput: { ids: del ?? [] },
      }
    })

    const [created, updated, deleted] = parallelize(
      createShippingOptionRulesStep(actionInputs.createInput),
      updateShippingOptionRulesStep(actionInputs.updateInput),
      deleteShippingOptionRulesStep(actionInputs.deleteInput)
    )

    return transform({ created, deleted, updated }, (data) => data)
  }
)
