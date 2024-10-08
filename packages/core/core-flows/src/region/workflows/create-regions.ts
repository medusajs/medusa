import { WorkflowTypes } from "@medusajs/framework/types"
import { RegionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createPricePreferencesWorkflow } from "../../pricing"
import { createRegionsStep } from "../steps"
import { setRegionsPaymentProvidersStep } from "../steps/set-regions-payment-providers"

export const createRegionsWorkflowId = "create-regions"
/**
 * This workflow creates one or more regions.
 */
export const createRegionsWorkflow = createWorkflow(
  createRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowInput>
  ): WorkflowResponse<WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowOutput> => {
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

    const regionsIdEvents = transform({ regions }, ({ regions }) => {
      return regions.map((v) => {
        return { id: v.id }
      })
    })

    parallelize(
      setRegionsPaymentProvidersStep({
        input: normalizedRegionProviderData,
      }),
      createPricePreferencesWorkflow.runAsStep({
        input: normalizedRegionPricePreferencesData,
      }),
      emitEventStep({
        eventName: RegionWorkflowEvents.CREATED,
        data: regionsIdEvents,
      })
    )

    return new WorkflowResponse(regions)
  }
)
