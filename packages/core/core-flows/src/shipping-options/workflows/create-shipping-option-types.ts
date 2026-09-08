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
import { emitEventStep } from "../../common"
import { createShippingOptionTypesStep } from "../steps"

/**
 * The data to create one or more shipping option types, along with custom data that's passed to the workflow's hooks.
 */
export type CreateShippingOptionTypesWorkflowInput = {
  /**
   * The shipping option types to create.
   */
  shipping_option_types: FulfillmentTypes.CreateShippingOptionTypeDTO[]
} & AdditionalData

export const createShippingOptionTypesWorkflowId =
  "create-shipping-option-types"
/**
 * This workflow creates one or more shipping option types. It's used by the
 * [Create Shipping Option Type Admin API Route](https://docs.medusajs.com/api/admin/shipping-option-types/create-shipping-option-type).
 *
 * This workflow has a hook that allows you to perform custom actions on the created shipping option types. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the shipping option types.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around shipping option type creation.
 *
 * @since 2.10.0
 *
 * @example
 * const { result } = await createShippingOptionTypesWorkflow(container)
 * .run({
 *   input: {
 *     shipping_option_types: [
 *       {
 *         label: "Standard",
 *         code: "standard",
 *         description: "Ship in 2-3 days."
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
 * Create one or more shipping option types.
 *
 * @property hooks.shippingOptionTypesCreated - This hook is executed after the shipping option types are created. You can consume this hook to perform custom actions on the created shipping option types.
 */
export const createShippingOptionTypesWorkflow = createWorkflow(
  createShippingOptionTypesWorkflowId,
  (input: WorkflowData<CreateShippingOptionTypesWorkflowInput>) => {
    const shippingOptionTypes = createShippingOptionTypesStep(
      input.shipping_option_types
    )
    const shippingOptionTypesCreated = createHook(
      "shippingOptionTypesCreated",
      {
        shipping_option_types: shippingOptionTypes,
        additional_data: input.additional_data,
      }
    )

    const typeIdEvents = transform(
      { shippingOptionTypes },
      ({ shippingOptionTypes }) => {
        return shippingOptionTypes.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ShippingOptionTypeWorkflowEvents.CREATED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(shippingOptionTypes, {
      hooks: [shippingOptionTypesCreated],
    })
  }
)
