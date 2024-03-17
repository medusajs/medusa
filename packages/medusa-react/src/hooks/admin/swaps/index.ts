/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Swap API Routes](https://docs.medusajs.com/api/admin#swaps).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A swap is created by a customer or an admin to exchange an item with a new one.
 * Creating a swap implicitely includes creating a return for the item being exchanged.
 *
 * Related Guide: [How to manage swaps](https://docs.medusajs.com/modules/orders/admin/manage-swaps)
 *
 * @customNamespace Hooks.Admin.Swaps
 */

export * from "./queries"
export * from "./mutations"
