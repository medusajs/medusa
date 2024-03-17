/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Product Category API Routes](https://docs.medusajs.com/api/admin#product-categories).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Products can be categoriezed into categories. A product can be added into more than one category.
 *
 * Related Guide: [How to manage product categories](https://docs.medusajs.com/modules/products/admin/manage-categories).
 *
 * @featureFlag product_categories
 *
 * @customNamespace Hooks.Admin.Product Categories
 */

export * from "./queries"
export * from "./mutations"
