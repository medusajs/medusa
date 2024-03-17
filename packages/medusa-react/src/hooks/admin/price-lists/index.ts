/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Price List API Routes](https://docs.medusajs.com/api/admin#price-lists).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A price list are special prices applied to products based on a set of conditions, such as customer group.
 *
 * Related Guide: [How to manage price lists](https://docs.medusajs.com/modules/price-lists/admin/manage-price-lists).
 *
 * @customNamespace Hooks.Admin.Price Lists
 */

export * from "./queries"
export * from "./mutations"
