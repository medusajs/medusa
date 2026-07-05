import {
  CreatePriceListWorkflowInputDTO,
  PriceListDTO,
} from "@medusajs/framework/types"
import { PriceListWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { createPriceListsStep, validateVariantPriceLinksStep } from "../steps"

/**
 * The data to create price lists.
 */
export type CreatePriceListsWorkflowInput = {
  /**
   * The price lists to create.
   */
  price_lists_data: CreatePriceListWorkflowInputDTO[]
}

/**
 * The created price lists.
 */
export type CreatePriceListsWorkflowOutput = PriceListDTO[]

export const createPriceListsWorkflowId = "create-price-lists"
/**
 * This workflow creates one or more price lists. It's used by the
 * [Create Price List Admin API Route](https://docs.medusajs.com/api/admin#price-lists_postpricelists).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create price lists in your custom flows.
 * 
 * @example
 * const { result } = await createPriceListsWorkflow(container)
 * .run({
 *   input: {
 *     price_lists_data: [
 *       {
 *         title: "Price List 1",
 *         description: "Price List 1 Description",
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Create one or more price lists.
 */
export const createPriceListsWorkflow = createWorkflow(
  createPriceListsWorkflowId,
  (
    input: WorkflowData<CreatePriceListsWorkflowInput>
  ): WorkflowResponse<PriceListDTO[]> => {
    const variantPriceMap = validateVariantPriceLinksStep(
      input.price_lists_data
    )

    const createdPriceLists = createPriceListsStep({
      data: input.price_lists_data,
      variant_price_map: variantPriceMap,
    })

    const priceListIdEvents = transform(
      { createdPriceLists },
      ({ createdPriceLists }) =>
        createdPriceLists.map((pl) => ({ id: pl.id }))
    )

    emitEventStep({
      eventName: PriceListWorkflowEvents.CREATED,
      data: priceListIdEvents,
    })

    return new WorkflowResponse(createdPriceLists)
  }
)
