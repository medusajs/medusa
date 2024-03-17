/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Note API Routes](https://docs.medusajs.com/api/admin#notes).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Notes are created by admins and can be associated with any resource. For example, an admin can add a note to an order for additional details or remarks.
 *
 * @customNamespace Hooks.Admin.Notes
 */

export * from "./queries"
export * from "./mutations"
