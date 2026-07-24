import type { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductTagWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createProductTagsStep } from "../steps"

/**
 * The data to create one or more product tags, along with custom data that's passed to the workflow's hooks.
 */
export type CreateProductTagsWorkflowInput = {
  /**
   * The product tags to create.
   */
  product_tags: ProductTypes.CreateProductTagDTO[]
} & AdditionalData

export const createProductTagsWorkflowId = "create-product-tags"
/**
 * This workflow creates one or more product tags. It's used by the
 * [Create Product Tag Admin API Route](https://docs.medusajs.com/api/admin/product-tags/create-product-tag).
 *
 * This workflow has a hook that allows you to perform custom actions on the created product tags. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the product tags.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-tag creation.
 *
 * @example
 * const { result } = await createProductTagsWorkflow(container)
 * .run({
 *   input: {
 *     product_tags: [
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
 * Create one or more product tags.
 *
 * @property hooks.productTagsCreated - This hook is executed after the product tags are created. You can consume this hook to perform custom actions on the created product tags.
 */
export const createProductTagsWorkflow = createWorkflow(
  createProductTagsWorkflowId,
  (input: WorkflowData<CreateProductTagsWorkflowInput>) => {
    const productTags = createProductTagsStep(input.product_tags)
    const productTagsCreated = createHook("productTagsCreated", {
      product_tags: productTags,
      additional_data: input.additional_data,
    })

    const tagIdEvents = transform({ productTags }, ({ productTags }) => {
      return productTags.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductTagWorkflowEvents.CREATED,
      data: tagIdEvents,
    })

    return new WorkflowResponse(productTags, {
      hooks: [productTagsCreated],
    })
  }
)
