import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreateShippingOptionRuleDTO,
  ShippingOptionRuleDTO,
  UpdateShippingOptionRuleDTO,
} from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createShippingOptionRulesStep,
  deleteShippingOptionRulesStep,
} from "../steps"
import { updateShippingOptionRulesStep } from "../steps/update-shipping-option-rules"

export const batchShippingOptionRulesWorkflowId = "batch-shipping-option-rules"
/**
 * This workflow manages shipping option rules by creating, updating, or deleting them.
 */
export const batchShippingOptionRulesWorkflow = createWorkflow(
  batchShippingOptionRulesWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<
        CreateShippingOptionRuleDTO,
        UpdateShippingOptionRuleDTO
      >
    >
  ): WorkflowResponse<BatchWorkflowOutput<ShippingOptionRuleDTO>> => {
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

    return new WorkflowResponse(
      transform({ created, deleted, updated }, (data) => data)
    )
  }
)
