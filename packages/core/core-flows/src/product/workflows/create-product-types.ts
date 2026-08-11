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
import { createProductTypesStep } from "../steps"

/**
 * The data to create one or more product types, along with custom data that's passed to the workflow's hooks.
 */
export type CreateProductTypesWorkflowInput = {
  /**
   * The product types to create.
   */
  product_types: ProductTypes.CreateProductTypeDTO[]
} & AdditionalData

export const createProductTypesWorkflowId = "create-product-types"
/**
 * This workflow creates one or more product types. It's used by the
 * [Create Product Type Admin API Route](https://docs.medusajs.com/api/admin/product-types/create-product-type).
 *
 * This workflow has a hook that allows you to perform custom actions on the created product types. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the product types.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-type creation.
 *
 * @example
 * const { result } = await createProductTypesWorkflow(container)
 * .run({
 *   input: {
 *     product_types: [
 *       {
 *         value: "clothing"
 *       }
 *     ],
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create one or more product types.
 *
 * @property hooks.productTypesCreated - This hook is executed after the product types are created. You can consume this hook to perform custom actions on the created product types.
 */
export const createProductTypesWorkflow = createWorkflow(
  createProductTypesWorkflowId,
  (input: WorkflowData<CreateProductTypesWorkflowInput>) => {
    const productTypes = createProductTypesStep(input.product_types)
    const productTypesCreated = createHook("productTypesCreated", {
      product_types: productTypes,
      additional_data: input.additional_data,
    })

    const typeIdEvents = transform({ productTypes }, ({ productTypes }) => {
      return productTypes.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductTypeWorkflowEvents.CREATED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(productTypes, {
      hooks: [productTypesCreated],
    })
  }
)
