import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  SettingsTypes,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { createPropertyLabelsWorkflow } from "./create-property-label"
import { deletePropertyLabelsWorkflow } from "./delete-property-labels"
import { updatePropertyLabelsWorkflow } from "./update-property-label"

/**
 * Input type for creating a property label in batch.
 */
export interface BatchPropertyLabelCreateInput {
  entity: string
  property: string
  label: string
  description?: string
}

/**
 * Input type for updating a property label in batch.
 */
export interface BatchPropertyLabelUpdateInput {
  id: string
  label?: string
  description?: string
}

/**
 * The property labels to manage.
 */
export interface BatchPropertyLabelsWorkflowInput
  extends BatchWorkflowInput<
    BatchPropertyLabelCreateInput,
    BatchPropertyLabelUpdateInput
  > {}

export type BatchPropertyLabelsWorkflowOutput =
  BatchWorkflowOutput<SettingsTypes.PropertyLabelDTO>

const conditionallyCreatePropertyLabels = (
  input: BatchPropertyLabelsWorkflowInput
) =>
  when({ input }, ({ input }) => !!input.create?.length).then(() =>
    createPropertyLabelsWorkflow.runAsStep({
      input: { property_labels: input.create! },
    })
  )

const conditionallyUpdatePropertyLabels = (
  input: BatchPropertyLabelsWorkflowInput
) =>
  when({ input }, ({ input }) => !!input.update?.length).then(() =>
    updatePropertyLabelsWorkflow.runAsStep({
      input: { property_labels: input.update! },
    })
  )

const conditionallyDeletePropertyLabels = (
  input: BatchPropertyLabelsWorkflowInput
) =>
  when({ input }, ({ input }) => !!input.delete?.length).then(() =>
    deletePropertyLabelsWorkflow.runAsStep({
      input: { ids: input.delete! },
    })
  )

export const batchPropertyLabelsWorkflowId = "batch-property-labels"

/**
 * This workflow creates, updates, or deletes property labels in batch.
 *
 * @since 2.13.2
 * @featureFlag view_configurations
 */
export const batchPropertyLabelsWorkflow = createWorkflow(
  batchPropertyLabelsWorkflowId,
  (
    input: WorkflowData<BatchPropertyLabelsWorkflowInput>
  ): WorkflowResponse<BatchPropertyLabelsWorkflowOutput> => {
    const res = parallelize(
      conditionallyCreatePropertyLabels(input),
      conditionallyUpdatePropertyLabels(input),
      conditionallyDeletePropertyLabels(input)
    )

    return new WorkflowResponse(
      transform({ res, input }, (data) => {
        return {
          created: data.res[0] ?? [],
          updated: data.res[1] ?? [],
          deleted: data.input.delete ?? [],
        }
      })
    )
  }
)
