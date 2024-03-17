/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Store Order API Routes](https://docs.medusajs.com/api/store#orders).
 *
 * Orders are purchases made by customers, typically through a storefront.
 * Orders are placed and created using {@link Hooks.Store.Carts | cart} hooks. The listed hooks allow retrieving and claiming orders.
 *
 * Related Guide: [How to retrieve order details in a storefront](https://docs.medusajs.com/modules/orders/storefront/retrieve-order-details).
 *
 * @customNamespace Hooks.Store.Orders
 */

export * from "./queries"
export * from "./mutations"
