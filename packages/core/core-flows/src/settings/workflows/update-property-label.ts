import { SettingsTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updatePropertyLabelsStep } from "../steps"

export interface UpdatePropertyLabelsWorkflowInput {
  property_labels: {
    id: string
    label?: string
    description?: string
  }[]
}

export const updatePropertyLabelsWorkflowId = "update-property-labels"

/**
 * @since 2.13.2
 * @featureFlag view_configurations
 */
export const updatePropertyLabelsWorkflow = createWorkflow(
  updatePropertyLabelsWorkflowId,
  (
    input: WorkflowData<UpdatePropertyLabelsWorkflowInput>
  ): WorkflowResponse<SettingsTypes.PropertyLabelDTO[]> => {
    const propertyLabels = updatePropertyLabelsStep(input)

    return new WorkflowResponse(propertyLabels)
  }
)
