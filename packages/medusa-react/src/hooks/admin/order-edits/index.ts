/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Order Edit API Routes](https://docs.medusajs.com/api/admin#order-edits).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * An admin can edit an order to remove, add, or update an item's quantity. When an admin edits an order, they're stored as an `OrderEdit`.
 *
 * Related Guide: [How to edit an order](https://docs.medusajs.com/modules/orders/admin/edit-order).
 *
 * @customNamespace Hooks.Admin.Order Edits
 */

export * from "./queries"
export * from "./mutations"
