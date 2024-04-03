import { CreateRegionDTO, WorkflowTypes } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createRegionsStep } from "../steps"
import { setRegionsPaymentProvidersStep } from "../steps/set-regions-payment-providers"
import { remapRegionToPaymentProviders } from "../utils"

export const createRegionsWorkflowId = "create-regions"
export const createRegionsWorkflow = createWorkflow(
  createRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowInput>
  ): WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const regionsData: CreateRegionDTO[] = []
      const regionsProvidersMap: { [key: string]: string[] } = {}

      for (const region of data.regions) {
        const { payment_providers, ...rest } = region
        regionsData.push(rest)

        if (payment_providers?.length) {
          regionsProvidersMap[JSON.stringify(rest)] = payment_providers
        }
      }

      return {
        regions: regionsData,
        regions_providers_map: regionsProvidersMap,
      }
    })

    const regions = createRegionsStep(data.regions)

    const normalizedRegionProviderData = transform(
      { regions_providers_map: data.regions_providers_map, regions },
      (data) => {
        const { regions_providers_map, regions } = data
        return remapRegionToPaymentProviders(regions, regions_providers_map)
      }
    )

    setRegionsPaymentProvidersStep({
      input: normalizedRegionProviderData,
    })

    return regions
  }
)
