/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Sales Channel API Routes](https://docs.medusajs.com/api/admin#sales-channels).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A sales channel indicates a channel where products can be sold in. For example, a webshop or a mobile app.
 * Admins can manage sales channels and the products available in them.
 *
 * Related Guide: [How to manage sales channels](https://docs.medusajs.com/modules/sales-channels/admin/manage).
 *
 * @customNamespace Hooks.Admin.Sales Channels
 */

export * from "./queries"
export * from "./mutations"
