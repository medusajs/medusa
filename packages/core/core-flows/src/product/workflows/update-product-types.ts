import type { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductTypeWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateProductTypesStep } from "../steps"

/**
 * The data to update one or more product types, along with custom data that's passed to the workflow's hooks.
 */
type UpdateProductTypesWorkflowInput = {
  /**
   * The filters to select the product types to update.
   */
  selector: ProductTypes.FilterableProductTypeProps
  /**
   * The data to update in the product types.
   */
  update: ProductTypes.UpdateProductTypeDTO
} & AdditionalData

export const updateProductTypesWorkflowId = "update-product-types"
/**
 * This workflow updates one or more product types. It's used by the
 * [Update Product Type Admin API Route](https://docs.medusajs.com/api/admin/product-types/update-a-product-type).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated product types. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the product types.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-type updates.
 *
 * @example
 * const { result } = await updateProductTypesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "ptyp_123"
 *     },
 *     update: {
 *       value: "clothing"
 *     },
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more product types.
 *
 * @property hooks.productTypesUpdated - This hook is executed after the product types are updated. You can consume this hook to perform custom actions on the updated product types.
 */
export const updateProductTypesWorkflow = createWorkflow(
  updateProductTypesWorkflowId,
  (input: WorkflowData<UpdateProductTypesWorkflowInput>) => {
    const updatedProductTypes = updateProductTypesStep(input)
    const productTypesUpdated = createHook("productTypesUpdated", {
      product_types: updatedProductTypes,
      additional_data: input.additional_data,
    })

    const typeIdEvents = transform(
      { updatedProductTypes },
      ({ updatedProductTypes }) => {
        const arr = Array.isArray(updatedProductTypes)
          ? updatedProductTypes
          : [updatedProductTypes]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductTypeWorkflowEvents.UPDATED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(updatedProductTypes, {
      hooks: [productTypesUpdated],
    })
  }
)
