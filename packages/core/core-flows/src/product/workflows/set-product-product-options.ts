import type { ProductTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { isString } from "@medusajs/framework/utils"
import {
  addProductOptionsToProductStep,
  removeProductOptionsFromProductStep,
  updateProductOptionValuesOnProductStep,
} from "../steps"

export type SetProductProductOptionsWorkflowInput = {
  /**
   * The ID of the product to manage its options.
   */
  product_id: string
  /**
   * The product options to add to the product. You can pass an option ID
   * or an object with option value IDs.
   */
  add?: (string | Omit<ProductTypes.ProductOptionProductPair, "product_id">)[]
  /**
   * The product options to remove from the product.
   */
  remove?: string[]
  /**
   * The product option values to update for existing product options.
   */
  update?: Omit<ProductTypes.ProductOptionProductValueUpdate, "product_id">[]
}

export const setProductProductOptionsWorkflowId = "set-product-product-options"
/**
 * This workflow manages one or more product options of a product.
 *
 * @summary
 *
 * Manage product options and their values for a product.
 */
export const setProductProductOptionsWorkflow = createWorkflow(
  setProductProductOptionsWorkflowId,
  (input: WorkflowData<SetProductProductOptionsWorkflowInput>) => {
    const toAdd = transform({ input }, ({ input }) => {
      const options: ProductTypes.ProductOptionProductPair[] = []

      for (const option of input.add ?? []) {
        if (isString(option)) {
          options.push({
            product_option_id: option,
            product_id: input.product_id,
          })
        } else {
          options.push({
            product_option_id: option.product_option_id,
            product_id: input.product_id,
            product_option_value_ids: option.product_option_value_ids,
          })
        }
      }

      return options
    })

    const toRemove = transform({ input }, ({ input }) => {
      return (input.remove ?? []).map((optionId) => ({
        product_option_id: optionId,
        product_id: input.product_id,
      }))
    })

    const toUpdate = transform({ input }, ({ input }) => {
      return (input.update ?? []).map((update) => ({
        product_option_id: update.product_option_id,
        product_id: input.product_id,
        add: update.add,
        remove: update.remove,
      }))
    })

    when({ toAdd }, ({ toAdd }) => !!toAdd?.length).then(() =>
      addProductOptionsToProductStep(toAdd)
    )
    when({ toRemove }, ({ toRemove }) => !!toRemove?.length).then(() =>
      removeProductOptionsFromProductStep(toRemove)
    )
    when({ toUpdate }, ({ toUpdate }) => !!toUpdate?.length).then(() =>
      updateProductOptionValuesOnProductStep(toUpdate)
    )

    return new WorkflowResponse(void 0)
  }
)
