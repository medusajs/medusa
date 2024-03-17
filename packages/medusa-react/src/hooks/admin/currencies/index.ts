/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Currency API Routes](https://docs.medusajs.com/api/admin#currencies).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A store can use unlimited currencies, and each region must be associated with at least one currency.
 * Currencies are defined within the Medusa backend. The methods in this class allow admins to list and update currencies.
 *
 * Related Guide: [How to manage currencies](https://docs.medusajs.com/modules/regions-and-currencies/admin/manage-currencies).
 *
 * @customNamespace Hooks.Admin.Currencies
 */

export * from "./mutations"
export * from "./queries"
