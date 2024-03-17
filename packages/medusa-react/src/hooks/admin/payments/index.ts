/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Payment API Routes](https://docs.medusajs.com/api/admin#payments).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A payment can be related to an order, swap, return, or more. It can be captured or refunded.
 *
 * @customNamespace Hooks.Admin.Payments
 */

export * from "./queries"
export * from "./mutations"
