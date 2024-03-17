/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Product Type API Routes](https://docs.medusajs.com/api/admin#product-types).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Product types are string values created when you create or update a product with a new type.
 * Products can have one type, and products can share types. This allows admins to associate products with a type that can be used to filter products.
 *
 * @customNamespace Hooks.Admin.Product Types
 */

export * from "./queries"
