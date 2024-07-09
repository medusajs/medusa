import { PricingWorkflow, IPricingModuleService } from "@medusajs/types"
import {
  MedusaError,
  ModuleRegistrationName,
  arrayDifference,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = PricingWorkflow.UpdatePricePreferencesWorkflowInput["update"][]

export const updatePricePreferencesAsArrayStepId =
  "update-price-preferences-as-array"
export const updatePricePreferencesAsArrayStep = createStep(
  updatePricePreferencesAsArrayStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const prevData = await service.listPricePreferences({
      $or: input.map(
        (entry) => {
          if (!entry.attribute || !entry.value) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Attribute and value must be provided when updating price preferences"
            )
          }

          return { attribute: entry.attribute, value: entry.value }
        },
        { take: null }
      ),
    })

    const toUpsert = input.map((entry) => {
      const prevEntry = prevData.find(
        (prevEntry) =>
          prevEntry.attribute === entry.attribute &&
          prevEntry.value === entry.value
      )
      return {
        id: prevEntry?.id,
        attribute: entry.attribute,
        value: entry.value,
        is_tax_inclusive: entry.is_tax_inclusive ?? prevEntry?.is_tax_inclusive,
      }
    })

    const upsertedPricePreferences = await service.upsertPricePreferences(
      toUpsert
    )

    const newIds = arrayDifference(
      upsertedPricePreferences.map((p) => p.id),
      prevData.map((p) => p.id)
    )

    return new StepResponse(upsertedPricePreferences, {
      prevData,
      newDataIds: newIds,
    })
  },
  async (compensationData, { container }) => {
    if (!compensationData) {
      return
    }

    const service = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await service.upsertPricePreferences(compensationData.prevData)
    await service.deletePricePreferences(compensationData.newDataIds)
  }
)
