import type { ConfirmVariantInventoryWorkflowInputDTO } from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@zjedene-medusa/framework/workflows-sdk"
import type { BigNumberInput } from "@zjedene-medusa/framework/types"
import { confirmInventoryStep } from "../steps"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"

/**
 * The details of the cart items with inventory result computed for the specified input.
 */
export interface ConfirmVariantInventoryWorkflowOutput {
  /**
   * The cart's line items with the computed inventory result.
   */
  items: {
    /**
     * The line item's ID.
     */
    id?: string
    /**
     * The ID of the inventory item used to retrieve the item's available quantity.
     */
    inventory_item_id: string
    /**
     * The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
     * value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
     */
    required_quantity: number
    /**
     * Whether the variant can be ordered even if it's out of stock. If a variant has this enabled, the workflow doesn't throw an error.
     */
    allow_backorder: boolean
    /**
     * The quantity in the cart. If you provided `itemsToUpdate` in the input, this will be the updated quantity.
     */
    quantity: BigNumberInput
    /**
     * The ID of the stock locations that the computed inventory quantity is available in.
     */
    location_ids: string[]
  }[]
}

export const confirmVariantInventoryWorkflowId = "confirm-item-inventory"
/**
 * This workflow validates that product variants are in-stock at the specified sales channel, before adding them or updating their quantity in the cart. If a variant doesn't have sufficient quantity in-stock,
 * the workflow throws an error. If all variants have sufficient inventory, the workflow returns the cart's items with their inventory details.
 *
 * This workflow is useful when confirming that a product variant has sufficient quantity to be added to or updated in the cart. It's executed
 * by other cart-related workflows, such as {@link addToCartWorkflow}, to confirm that a product variant can be added to the cart at the specified quantity.
 *
 * :::note
 *
 * Learn more about the links between the product variant and sales channels and inventory items in [this documentation](https://docs.medusajs.com/resources/commerce-modules/product/links-to-other-modules).
 *
 * :::
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to check whether a product variant has enough inventory quantity before adding them to the cart.
 *
 * @example
 * You can retrieve a variant's required details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query):
 *
 * ```ts workflow={false}
 * const { data: variants } = await query.graph({
 *   entity: "variant",
 *   fields: [
 *     "id",
 *     "manage_inventory",
 *     "inventory_items.inventory_item_id",
 *     "inventory_items.required_quantity",
 *     "inventory_items.inventory.requires_shipping",
 *     "inventory_items.inventory.location_levels.stocked_quantity",
 *     "inventory_items.inventory.location_levels.reserved_quantity",
 *     "inventory_items.inventory.location_levels.raw_stocked_quantity",
 *     "inventory_items.inventory.location_levels.raw_reserved_quantity",
 *     "inventory_items.inventory.location_levels.stock_locations.id",
 *     "inventory_items.inventory.location_levels.stock_locations.name",
 *     "inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
 *     "inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
 *   ],
 *   filters: {
 *     id: ["variant_123"]
 *   }
 * })
 * ```
 *
 * :::note
 *
 * In a workflow, use [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep) instead.
 *
 * :::
 *
 * Then, pass the variant's data with the other required data to the workflow:
 *
 * ```ts
 * const { result } = await confirmVariantInventoryWorkflow(container)
 *   .run({
 *     input: {
 *       sales_channel_id: "sc_123",
 *       // @ts-ignore
 *       variants,
 *       items: [
 *         {
 *           variant_id: "variant_123",
 *           quantity: 1
 *         }
 *       ]
 *     }
 *   })
 * ```
 *
 * When updating an item quantity:
 *
 * ```ts
 * const { result } = await confirmVariantInventoryWorkflow(container)
 *  .run({
 *    input: {
 *      sales_channel_id: "sc_123",
 *      // @ts-ignore
 *      variants,
 *      items: [
 *        {
 *          variant_id: "variant_123",
 *          quantity: 1
 *        }
 *      ],
 *      itemsToUpdate: [
 *        {
 *          data: {
 *            variant_id: "variant_123",
 *            quantity: 2
 *          }
 *        }
 *      ]
 *    }
 *  })
 * ```
 *
 * @summary
 *
 * Validate that a variant is in-stock before adding to the cart.
 */
export const confirmVariantInventoryWorkflow = createWorkflow(
  confirmVariantInventoryWorkflowId,
  (
    input: WorkflowData<ConfirmVariantInventoryWorkflowInputDTO>
  ): WorkflowResponse<ConfirmVariantInventoryWorkflowOutput> => {
    const confirmInventoryInput = transform(
      { input },
      prepareConfirmInventoryInput
    )

    confirmInventoryStep(confirmInventoryInput)

    return new WorkflowResponse(confirmInventoryInput)
  }
)
