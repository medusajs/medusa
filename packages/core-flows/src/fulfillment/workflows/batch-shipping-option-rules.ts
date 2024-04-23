import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreateShippingOptionRuleDTO,
  ShippingOptionRuleDTO,
  UpdateShippingOptionRuleDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createShippingOptionRulesStep,
  deleteShippingOptionRulesStep,
} from "../steps"

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
    const createInput = transform({ input }, (data) => ({
      data: data.input.create ?? [],
    }))

    const updateInput = transform({ input }, (data) => ({
      data: data.input.update ?? [],
    }))

    const deleteInput = transform({ input }, (data) => ({
      ids: data.input.delete ?? [],
    }))

    // TODO: Currently we don't support edits, add support for this.
    // We just call the steps directly here since there are no independent workflows, switch to CRUD workflows if they get added.
    const [created, deleted] = parallelize(
      createShippingOptionRulesStep(createInput),
      deleteShippingOptionRulesStep(deleteInput)
    )

    return transform({ created, deleted }, (data) => ({ ...data, updated: [] }))
  }
)
