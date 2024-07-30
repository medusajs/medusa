import { WorkflowTypes } from "@medusajs/types"
import {
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { updateRegionsStep } from "../steps"
import { setRegionsPaymentProvidersStep } from "../steps/set-regions-payment-providers"
import { updatePricePreferencesWorkflow } from "../../pricing"

export const updateRegionsWorkflowId = "update-regions"
export const updateRegionsWorkflow = createWorkflow(
  updateRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.RegionWorkflow.UpdateRegionsWorkflowInput>
  ): WorkflowResponse<WorkflowTypes.RegionWorkflow.UpdateRegionsWorkflowOutput> => {
    const normalizedInput = transform(input, (data) => {
      const { selector, update } = data
      const { payment_providers = [], is_tax_inclusive, ...rest } = update
      return {
        selector,
        update: rest,
        payment_providers,
        is_tax_inclusive,
      }
    })

    const regions = updateRegionsStep(normalizedInput)

    const upsertProvidersNormalizedInput = transform(
      { normalizedInput, regions },
      (data) => {
        return data.regions.map((region) => {
          return {
            id: region.id,
            payment_providers: data.normalizedInput.payment_providers,
          }
        })
      }
    )

    when({ normalizedInput }, (data) => {
      return data.normalizedInput.is_tax_inclusive !== undefined
    }).then(() => {
      const updatePricePreferencesInput = transform(
        { normalizedInput, regions },
        (data) => {
          return {
            selector: {
              $or: data.regions.map((region) => {
                return {
                  attribute: "region_id",
                  value: region.id,
                }
              }),
            },
            update: {
              is_tax_inclusive: data.normalizedInput.is_tax_inclusive,
            },
          } as WorkflowTypes.PricingWorkflow.UpdatePricePreferencesWorkflowInput
        }
      )

      updatePricePreferencesWorkflow.runAsStep({
        input: updatePricePreferencesInput,
      })
    })

    setRegionsPaymentProvidersStep({
      input: upsertProvidersNormalizedInput,
    })

    return new WorkflowResponse(regions)
  }
)
