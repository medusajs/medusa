import { RegionDTO } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { updateRegionsStep } from "../steps"
import { UpdateRegionsWorkflowInput } from "@medusajs/types/dist/workflow/region"
import { upsertAndReplaceRegionPaymentProvidersStep } from "../steps/upsert-and-replace-region-payment-providers"

export const updateRegionsWorkflowId = "update-regions"
export const updateRegionsWorkflow = createWorkflow(
  updateRegionsWorkflowId,
  (
    input: WorkflowData<UpdateRegionsWorkflowInput>
  ): WorkflowData<RegionDTO[]> => {
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

    upsertAndReplaceRegionPaymentProvidersStep({
      input: {
        regions,
        payment_providers: data.payment_providers,
      },
    })

    return regions
  }
)
