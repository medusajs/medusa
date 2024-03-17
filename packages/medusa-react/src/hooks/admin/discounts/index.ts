/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Discount API Routes](https://docs.medusajs.com/api/admin#discounts).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Admins can create discounts with conditions and rules, providing them with advanced settings for variety of cases.
 * The methods in this class can be used to manage discounts, their conditions, resources, and more.
 *
 * Related Guide: [How to manage discounts](https://docs.medusajs.com/modules/discounts/admin/manage-discounts).
 *
 * @customNamespace Hooks.Admin.Discounts
 */

export * from "./queries"
export * from "./mutations"
