import type { StoreDTO, StoreWorkflow } from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@zjedene-medusa/framework/workflows-sdk"
import { createStoresStep } from "../steps"
import { updatePricePreferencesAsArrayStep } from "../../pricing"

/**
 * The data to create stores.
 */
export type CreateStoresWorkflowInput = {
  /**
   * The stores to create.
   */
  stores: StoreWorkflow.CreateStoreWorkflowInput[]
}

/**
 * The created stores.
 */
export type CreateStoresWorkflowOutput = StoreDTO[]

export const createStoresWorkflowId = "create-stores"
/**
 * This workflow creates one or more stores. By default, Medusa uses a single store. This is useful
 * if you're building a multi-tenant application or a marketplace where each tenant has its own store.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create stores within your custom flows.
 *
 * @example
 * const { result } = await createStoresWorkflow(container)
 * .run({
 *   input: {
 *     stores: [
 *       {
 *         name: "Acme",
 *         supported_currencies: [{
 *           currency_code: "usd",
 *           is_default: true
 *         }]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more stores.
 */
export const createStoresWorkflow = createWorkflow(
  createStoresWorkflowId,
  (
    input: WorkflowData<CreateStoresWorkflowInput>
  ): WorkflowResponse<CreateStoresWorkflowOutput> => {
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
