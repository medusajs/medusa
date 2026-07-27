import type { CreateLocationFulfillmentSetWorkflowInputDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createFulfillmentSets } from "../../fulfillment"
import { associateFulfillmentSetsWithLocationStep } from "../steps/associate-locations-with-fulfillment-sets"

export const createLocationFulfillmentSetWorkflowId =
  "create-location-fulfillment-set"
/**
 * This workflow adds a fulfillment set to a stock location. It's used by the
 * [Add Fulfillment Set to Stock Location Admin API Route](https://docs.medusajs.com/api/admin/stock-locations/add-fulfillment-set).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to add fulfillment sets to a stock location in your custom flows.
 *
 * @example
 * const { result } = await createLocationFulfillmentSetWorkflow(container)
 * .run({
 *   input: {
 *     location_id: "sloc_123",
 *     fulfillment_set_data: {
 *       name: "Shipping",
 *       type: "shipping",
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Add fulfillment set to a stock location.
 */
export const createLocationFulfillmentSetWorkflow = createWorkflow(
  createLocationFulfillmentSetWorkflowId,
  (input: WorkflowData<CreateLocationFulfillmentSetWorkflowInputDTO>) => {
    const fulfillmentSet = createFulfillmentSets([
      {
        name: input.fulfillment_set_data.name,
        type: input.fulfillment_set_data.type,
      },
    ])

    const data = transform({ input, fulfillmentSet }, (data) => [
      {
        location_id: data.input.location_id,
        fulfillment_set_ids: [data.fulfillmentSet[0].id],
      },
    ])

    associateFulfillmentSetsWithLocationStep({
      input: data,
    })
  }
)
