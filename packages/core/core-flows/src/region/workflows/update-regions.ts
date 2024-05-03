import { WorkflowTypes } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { updateRegionsStep } from "../steps"
import { setRegionsPaymentProvidersStep } from "../steps/set-regions-payment-providers"

export const updateRegionsWorkflowId = "update-regions"
export const updateRegionsWorkflow = createWorkflow(
  updateRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.RegionWorkflow.UpdateRegionsWorkflowInput>
  ): WorkflowData<WorkflowTypes.RegionWorkflow.UpdateRegionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const { selector, update } = data
      const { payment_providers = [], ...rest } = update
      return {
        selector,
        update: rest,
        payment_providers,
      }
    })

    const regions = updateRegionsStep(data)

    const upsertProvidersNormalizedInput = transform(
      { data, regions },
      (data) => {
        return data.regions.map((region) => {
          return {
            id: region.id,
            payment_providers: data.data.payment_providers,
          }
        })
      }
    )

    setRegionsPaymentProvidersStep({
      input: upsertProvidersNormalizedInput,
    })

    return regions
  }
)
