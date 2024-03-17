/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Store Swap API Routes](https://docs.medusajs.com/api/store#swaps).
 *
 * A swap is created by a customer or an admin to exchange an item with a new one.
 * Creating a swap implicitely includes creating a return for the item being exchanged.
 *
 * Related Guide: [How to create a swap in a storefront](https://docs.medusajs.com/modules/orders/storefront/create-swap)
 *
 * @customNamespace Hooks.Store.Swaps
 */

export * from "./queries"
export * from "./mutations"
