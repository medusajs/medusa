/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Product API Routes](https://docs.medusajs.com/api/admin#products).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Products are saleable items in a store. This also includes [saleable gift cards](https://docs.medusajs.com/modules/gift-cards/admin/manage-gift-cards#manage-gift-card-product) in a store.
 *
 * Related Guide: [How to manage products](https://docs.medusajs.com/modules/products/admin/manage-products).
 *
 * @customNamespace Hooks.Admin.Products
 */

export * from "./queries"
export * from "./mutations"
