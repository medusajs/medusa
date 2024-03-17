/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Product Tag API Routes](https://docs.medusajs.com/api/admin#product-tags).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Product tags are string values created when you create or update a product with a new tag.
 * Products can have more than one tag, and products can share tags. This allows admins to associate products to similar tags that can be used to filter products.
 *
 * @customNamespace Hooks.Admin.Product Tags
 */

export * from "./queries"
