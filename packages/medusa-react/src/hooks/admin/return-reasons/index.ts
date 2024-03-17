/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Return Reason API Routes](https://docs.medusajs.com/api/admin#return-reasons).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Return reasons are key-value pairs that are used to specify why an order return is being created.
 * Admins can manage available return reasons, and they can be used by both admins and customers when creating a return.
 *
 * Related Guide: [How to manage return reasons](https://docs.medusajs.com/modules/orders/admin/manage-returns#manage-return-reasons).
 *
 * @customNamespace Hooks.Admin.Return Reasons
 */

export * from "./queries"
export * from "./mutations"
