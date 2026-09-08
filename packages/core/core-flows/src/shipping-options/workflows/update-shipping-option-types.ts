import type {
  AdditionalData,
  FulfillmentTypes,
} from "@medusajs/framework/types"
import { ShippingOptionTypeWorkflowEvents } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateShippingOptionTypesStep } from "../steps"

/**
 * The data to update one or more shipping option types, along with custom data that's passed to the workflow's hooks.
 */
export type UpdateShippingOptionTypesWorkflowInput = {
  /**
   * The filters to select the shipping option types to update.
   */
  selector: FulfillmentTypes.FilterableShippingOptionTypeProps
  /**
   * The data to update in the shipping option types.
   */
  update: FulfillmentTypes.UpdateShippingOptionTypeDTO
} & AdditionalData

export const updateShippingOptionTypesWorkflowId =
  "update-shipping-option-types"
/**
 * This workflow updates one or more shipping option types. It's used by the
 * [Update Shipping Option Type Admin API Route](https://docs.medusajs.com/api/admin/shipping-option-types/update-a-shipping-option-type).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated shipping option types. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the shipping option types.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around shipping option type updates.
 *
 * @since 2.10.0
 *
 * @example
 * const { result } = await updateShippingOptionTypesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "sotype_123"
 *     },
 *     update: {
 *       label: "Standard"
 *     },
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more shipping option types.
 *
 * @property hooks.shippingOptionTypesUpdated - This hook is executed after the shipping option types are updated. You can consume this hook to perform custom actions on the updated shipping option types.
 */
export const updateShippingOptionTypesWorkflow = createWorkflow(
  updateShippingOptionTypesWorkflowId,
  (input: WorkflowData<UpdateShippingOptionTypesWorkflowInput>) => {
    const updatedShippingOptionTypes = updateShippingOptionTypesStep(input)
    const shippingOptionTypesUpdated = createHook(
      "shippingOptionTypesUpdated",
      {
        shipping_option_types: updatedShippingOptionTypes,
        additional_data: input.additional_data,
      }
    )

    const typeIdEvents = transform(
      { updatedShippingOptionTypes },
      ({ updatedShippingOptionTypes }) => {
        const arr = Array.isArray(updatedShippingOptionTypes)
          ? updatedShippingOptionTypes
          : [updatedShippingOptionTypes]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ShippingOptionTypeWorkflowEvents.UPDATED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(updatedShippingOptionTypes, {
      hooks: [shippingOptionTypesUpdated],
    })
  }
)
