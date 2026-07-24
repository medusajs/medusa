import {
  MedusaError,
  Modules,
  ShippingOptionTypeWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteShippingOptionTypesStep } from "../steps"
import { useQueryGraphStep } from "../../common"

const validateDeleteShippingOptionTypesStep = createStep(
  "validate-delete-shipping-option-types",
  (input: { shippingOptions: { id: string }[] }) => {
    const shippingOptions = input.shippingOptions

    if (shippingOptions.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot delete shipping option type because some shipping options are using it."
      )
    }
  }
)

/**
 * The data to delete one or more shipping option types.
 */
export type DeleteShippingOptionTypesWorkflowInput = {
  /**
   * The IDs of the types to delete.
   */
  ids: string[]
}

export const deleteShippingOptionTypesWorkflowId =
  "delete-shipping-option-types"
/**
 * This workflow deletes one or more shipping-option types. It's used by the
 * [Delete Shipping Option Types Admin API Route](https://docs.medusajs.com/api/admin/shipping-option-types/delete-shipping-option-type).
 *
 * This workflow has a hook that allows you to perform custom actions after the shipping-option types are deleted. For example,
 * you can delete custom records linked to the shipping-option types.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around shipping option type deletion.
 * 
 * @since 2.10.0
 *
 * @example
 * const { result } = await deleteShippingOptionTypesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["sotype_123"],
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more shipping option types.
 *
 * @property hooks.shippingOptionTypesDeleted - This hook is executed after the types are deleted. You can consume this hook to perform custom actions on the deleted types.
 */
export const deleteShippingOptionTypesWorkflow = createWorkflow(
  deleteShippingOptionTypesWorkflowId,
  (input: WorkflowData<DeleteShippingOptionTypesWorkflowInput>) => {
    const shippingOptionsQuery = useQueryGraphStep({
      entity: "shipping_option",
      filters: { shipping_option_type_id: input.ids },
      pagination: { take: 1 },
      fields: ["id"],
    }).config({ name: "get-shipping-options" })

    const shippingOptions = transform(
      { shippingOptionsQuery },
      ({ shippingOptionsQuery }) =>
        shippingOptionsQuery.data as { id: string }[]
    )

    validateDeleteShippingOptionTypesStep({
      shippingOptions,
    })

    const deletedShippingOptionTypes = deleteShippingOptionTypesStep(input.ids)
    const shippingOptionTypesDeleted = createHook(
      "shippingOptionTypesDeleted",
      {
        ids: input.ids,
      }
    )

    const typeIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    parallelize(
      removeRemoteLinkStep({
        [Modules.FULFILLMENT]: { shipping_option_type_id: input.ids },
      }),
      emitEventStep({
        eventName: ShippingOptionTypeWorkflowEvents.DELETED,
        data: typeIdEvents,
      })
    )

    return new WorkflowResponse(deletedShippingOptionTypes, {
      hooks: [shippingOptionTypesDeleted],
    })
  }
)
