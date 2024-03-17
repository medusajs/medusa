/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Draft Order API Routes](https://docs.medusajs.com/api/admin#draft-orders).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A draft order is an order created manually by the admin. It allows admins to create orders without direct involvement from the customer.
 *
 * Related Guide: [How to manage draft orders](https://docs.medusajs.com/modules/orders/admin/manage-draft-orders).
 *
 * @customNamespace Hooks.Admin.Draft Orders
 */

export * from "./queries"
export * from "./mutations"
