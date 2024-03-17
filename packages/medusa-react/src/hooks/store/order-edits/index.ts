/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Store Order Edits API Routes](https://docs.medusajs.com/api/store#order-edits).
 *
 * Order edits are changes made to items in an order such as adding, updating their quantity, or deleting them. Order edits are created by the admin.
 * A customer can review order edit requests created by an admin and confirm or decline them.
 *
 * Related Guide: [How to handle order edits in a storefront](https://docs.medusajs.com/modules/orders/storefront/handle-order-edits).
 *
 * @customNamespace Hooks.Store.Order Edits
 */

export * from "./queries"
export * from "./mutations"
