/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Payment Collection API Routes](https://docs.medusajs.com/api/admin#payment-collections).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A payment collection is useful for managing additional payments, such as for Order Edits, or installment payments.
 *
 * @customNamespace Hooks.Admin.Payment Collections
 */

export * from "./queries"
export * from "./mutations"
