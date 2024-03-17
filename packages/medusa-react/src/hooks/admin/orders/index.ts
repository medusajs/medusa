/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Order API Routes](https://docs.medusajs.com/api/admin#orders).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Orders are purchases made by customers, typically through a storefront using cart. Managing orders include managing fulfillment, payment, claims, reservations, and more.
 *
 * Related Guide: [How to manage orders](https://docs.medusajs.com/modules/orders/admin/manage-orders).
 *
 * @customNamespace Hooks.Admin.Orders
 */

export * from "./queries"
export * from "./mutations"
