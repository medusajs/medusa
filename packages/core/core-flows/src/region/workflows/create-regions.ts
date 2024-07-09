import { CreateRegionDTO, WorkflowTypes } from "@medusajs/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createRegionsStep } from "../steps"
import { setRegionsPaymentProvidersStep } from "../steps/set-regions-payment-providers"
import { createPricePreferencesWorkflow } from "../../pricing"

export const createRegionsWorkflowId = "create-regions"
export const createRegionsWorkflow = createWorkflow(
  createRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowInput>
  ): WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const regionIndexToAdditionalData = data.regions.map((region, index) => {
        return {
          region_index: index,
          payment_providers: region.payment_providers,
          is_tax_inclusive: region.is_tax_inclusive,
        }
      })

      return {
        regions: data.regions.map((r) => {
          const resp = { ...r }
          delete resp.is_tax_inclusive
          delete resp.payment_providers
          return resp
        }),
        regionIndexToAdditionalData,
      }
    })

    const regions = createRegionsStep(data.regions)

    const normalizedRegionProviderData = transform(
      {
        regionIndexToAdditionalData: data.regionIndexToAdditionalData,
        regions,
      },
      (data) => {
        return data.regionIndexToAdditionalData.map(
          ({ region_index, payment_providers }) => {
            return {
              id: data.regions[region_index].id,
              payment_providers,
            }
          }
        )
      }
    )

    const normalizedRegionPricePreferencesData = transform(
      {
        regionIndexToAdditionalData: data.regionIndexToAdditionalData,
        regions,
      },
      (data) => {
        return data.regionIndexToAdditionalData.map(
          ({ region_index, is_tax_inclusive }) => {
            return {
              attribute: "region_id",
              value: data.regions[region_index].id,
              is_tax_inclusive,
            } as WorkflowTypes.PricingWorkflow.CreatePricePreferencesWorkflowInput
          }
        )
      }
    )

    parallelize(
      setRegionsPaymentProvidersStep({
        input: normalizedRegionProviderData,
      }),
      createPricePreferencesWorkflow.runAsStep({
        input: normalizedRegionPricePreferencesData,
      })
    )

    return regions
  }
)
