/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Customer Group API Routes](https://docs.medusajs.com/api/admin#customer-groups).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Customer Groups can be used to organize customers that share similar data or attributes into dedicated groups.
 * This can be useful for different purposes such as setting a different price for a specific customer group.
 *
 * Related Guide: [How to manage customer groups](https://docs.medusajs.com/modules/customers/admin/manage-customer-groups).
 *
 * @customNamespace Hooks.Admin.Customer Groups
 */

export * from "./queries"
export * from "./mutations"
