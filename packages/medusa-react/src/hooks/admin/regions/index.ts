/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Region API Routes](https://docs.medusajs.com/api/admin#regions).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Regions are different countries or geographical regions that the commerce store serves customers in.
 * Admins can manage these regions, their providers, and more.
 *
 * Related Guide: [How to manage regions](https://docs.medusajs.com/modules/regions-and-currencies/admin/manage-regions).
 *
 * @customNamespace Hooks.Admin.Regions
 */

export * from "./queries"
export * from "./mutations"
