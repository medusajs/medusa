import type { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductOptionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateProductOptionsStep } from "../steps"

/**
 * The data to update one or more product options, along with custom data that's passed to the workflow's hooks.
 */
export type UpdateProductOptionsWorkflowInput = {
  /**
   * The filters to select the product options to update.
   */
  selector: ProductTypes.FilterableProductOptionProps
  /**
   * The data to update in the product options.
   */
  update: ProductTypes.UpdateProductOptionDTO
} & AdditionalData

export const updateProductOptionsWorkflowId = "update-product-options"
/**
 * This workflow updates one or more product options. It's used by the [Update Product Option Admin API Route](https://docs.medusajs.com/api/admin#product-options_postproductoptionsid).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated product options. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the product options.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around product-option update.
 *
 * @example
 * const { result } = await updateProductOptionsWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       title: "Color"
 *     },
 *     update: {
 *       values: ["Red", "Blue", "Green"]
 *     },
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more product options.
 *
 * @property hooks.productOptionsUpdated - This hook is executed after the product options are updated. You can consume this hook to perform custom actions on the updated product options.
 */
export const updateProductOptionsWorkflow = createWorkflow(
  updateProductOptionsWorkflowId,
  (input: WorkflowData<UpdateProductOptionsWorkflowInput>) => {
    const updatedProductOptions = updateProductOptionsStep(input)
    const productOptionsUpdated = createHook("productOptionsUpdated", {
      product_options: updatedProductOptions,
      additional_data: input.additional_data,
    })

    const optionIdEvents = transform(
      { updatedProductOptions },
      ({ updatedProductOptions }) => {
        const arr = Array.isArray(updatedProductOptions)
          ? updatedProductOptions
          : [updatedProductOptions]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductOptionWorkflowEvents.UPDATED,
      data: optionIdEvents,
    })

    return new WorkflowResponse(updatedProductOptions, {
      hooks: [productOptionsUpdated],
    })
  }
)
