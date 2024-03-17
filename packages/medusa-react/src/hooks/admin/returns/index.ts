/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Return API Routes](https://docs.medusajs.com/api/admin#returns).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A return can be created by a customer or an admin to return items in an order.
 * Admins can manage these returns and change their state.
 *
 * Related Guide: [How to manage returns](https://docs.medusajs.com/modules/orders/admin/manage-returns).
 *
 * @customNamespace Hooks.Admin.Returns
 */

export * from "./queries"
export * from "./mutations"
