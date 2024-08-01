import { StoreDTO, StoreWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { updateStoresStep } from "../steps"
import { updatePricePreferencesAsArrayStep } from "../../pricing"

type WorkflowInputData = StoreWorkflow.UpdateStoreWorkflowInput

export const updateStoresWorkflowId = "update-stores"
export const updateStoresWorkflow = createWorkflow(
  updateStoresWorkflowId,
  (input: WorkflowData<WorkflowInputData>): WorkflowResponse<StoreDTO[]> => {
    const normalizedInput = transform({ input }, (data) => {
      if (!data.input.update.supported_currencies?.length) {
        return data.input
      }

      return {
        selector: data.input.selector,
        update: {
          ...data.input.update,
          supported_currencies: data.input.update.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default,
              }
            }
          ),
        },
      }
    })

    const stores = updateStoresStep(normalizedInput)

    when({ input }, (data) => {
      return !!data.input.update.supported_currencies?.length
    }).then(() => {
      const upsertPricePreferences = transform({ input }, (data) => {
        return data.input.update.supported_currencies!.map((currency) => {
          return {
            attribute: "currency_code",
            value: currency.currency_code,
            is_tax_inclusive: currency.is_tax_inclusive,
          }
        })
      })

      updatePricePreferencesAsArrayStep(upsertPricePreferences)
    })

    return new WorkflowResponse(stores)
  }
)
