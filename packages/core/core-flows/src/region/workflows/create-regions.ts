import { WorkflowTypes } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createRegionsStep } from "../steps"
import { setRegionsPaymentProvidersStep } from "../steps/set-regions-payment-providers"

export const createRegionsWorkflowId = "create-regions"
export const createRegionsWorkflow = createWorkflow(
  createRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowInput>
  ): WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const regionIndexToPaymentProviders = data.regions.map(
        (region, index) => {
          return {
            region_index: index,
            payment_providers: region.payment_providers,
          }
        }
      )

      return {
        regions: data.regions,
        regionIndexToPaymentProviders,
      }
    })

    const regions = createRegionsStep(data.regions)

    const normalizedRegionProviderData = transform(
      {
        regionIndexToPaymentProviders: data.regionIndexToPaymentProviders,
        regions,
      },
      (data) => {
        return data.regionIndexToPaymentProviders.map(
          ({ region_index, payment_providers }) => {
            return {
              id: data.regions[region_index].id,
              payment_providers,
            }
          }
        )
      }
    )

    setRegionsPaymentProvidersStep({
      input: normalizedRegionProviderData,
    })

    return regions
  }
)
