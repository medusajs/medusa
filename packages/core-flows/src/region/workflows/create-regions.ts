import { CreateRegionDTO, WorkflowTypes } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createRegionsStep } from "../steps"
import {
  upsertAndReplaceRegionPaymentProvidersStep,
  UpsertAndReplaceRegionPaymentProvidersStepInput,
} from "../steps/upsert-and-replace-region-payment-providers"

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
        const upsertAndReplaceProvidersInput: UpsertAndReplaceRegionPaymentProvidersStepInput["input"] =
          []

        for (const region of regions) {
          Object.entries(regions_providers_map).some(
            ([regionHash, providers]) => {
              const regionObj = JSON.parse(regionHash)
              const match = Object.keys(regionObj).every(
                (key) => regionObj[key] === region[key]
              )
              if (match) {
                upsertAndReplaceProvidersInput.push({
                  regions: [region],
                  payment_providers: providers as string[],
                })
                return true
              }
              return false
            }
          )
        }

        return upsertAndReplaceProvidersInput as UpsertAndReplaceRegionPaymentProvidersStepInput["input"]
      }
    )

    upsertAndReplaceRegionPaymentProvidersStep({
      input: normalizedRegionProviderData,
    })

    return regions
  }
)
