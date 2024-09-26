import { StoreDTO, StoreWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createStoresStep } from "../steps"
import { updatePricePreferencesAsArrayStep } from "../../pricing"

type CreateStoresWorkflowInput = {
  stores: StoreWorkflow.CreateStoreWorkflowInput[]
}

export const createStoresWorkflowId = "create-stores"
/**
 * This workflow creates one or more stores.
 */
export const createStoresWorkflow = createWorkflow(
  createStoresWorkflowId,
  (
    input: WorkflowData<CreateStoresWorkflowInput>
  ): WorkflowResponse<StoreDTO[]> => {
    const normalizedInput = transform({ input }, (data) => {
      return data.input.stores.map((store) => {
        return {
          ...store,
          supported_currencies: store.supported_currencies?.map((currency) => {
            return {
              currency_code: currency.currency_code,
              is_default: currency.is_default,
            }
          }),
        }
      })
    })

    const stores = createStoresStep(normalizedInput)

    const upsertPricePreferences = transform({ input }, (data) => {
      const toUpsert = new Map<
        string,
        { attribute: string; value: string; is_tax_inclusive?: boolean }
      >()

      data.input.stores.forEach((store) => {
        store.supported_currencies.forEach((currency) => {
          toUpsert.set(currency.currency_code, {
            attribute: "currency_code",
            value: currency.currency_code,
            is_tax_inclusive: currency.is_tax_inclusive,
          })
        })
      })

      return Array.from(toUpsert.values())
    })

    updatePricePreferencesAsArrayStep(upsertPricePreferences)
    return new WorkflowResponse(stores)
  }
)
