import { SettingsTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createPropertyLabelsStep } from "../steps"

export interface CreatePropertyLabelsWorkflowInput {
  property_labels: {
    entity: string
    property: string
    label: string
    description?: string
  }[]
}

export const createPropertyLabelsWorkflowId = "create-property-labels"

/**
 * @since 2.13.2
 * @featureFlag view_configurations
 */
export const createPropertyLabelsWorkflow = createWorkflow(
  createPropertyLabelsWorkflowId,
  (
    input: WorkflowData<CreatePropertyLabelsWorkflowInput>
  ): WorkflowResponse<SettingsTypes.PropertyLabelDTO[]> => {
    const propertyLabels = createPropertyLabelsStep(input)

    return new WorkflowResponse(propertyLabels)
  }
)
