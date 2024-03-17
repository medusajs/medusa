/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Tax Rate API Routes](https://docs.medusajs.com/api/admin#tax-rates).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Each region has at least a default tax rate. Admins can create and manage additional tax rates that can be applied for certain conditions, such as for specific product types.
 *
 * Related Guide: [How to manage tax rates](https://docs.medusajs.com/modules/taxes/admin/manage-tax-rates).
 *
 * @customNamespace Hooks.Admin.Tax Rates
 */

export * from "./queries"
export * from "./mutations"
