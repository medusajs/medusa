/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Store Cart API Routes](https://docs.medusajs.com/api/store#carts).
 *
 * A cart is a virtual shopping bag that customers can use to add items they want to purchase.
 * A cart is then used to checkout and place an order.
 *
 * The hooks listed have general examples on how to use them, but it's highly recommended to use the {@link Providers.Cart.CartProvider | CartProvider} provider and
 * the {@link Providers.Cart.useCart | useCart} hook to manage your cart and access the current cart across your application.
 *
 * Related Guide: [How to implement cart functionality in your storefront](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-cart).
 *
 * @customNamespace Hooks.Store.Carts
 */

export * from "./queries"
export * from "./mutations"
