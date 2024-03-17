/**
 * @packageDocumentation
 *
 * @customNamespace Providers.Cart
 */

import React, { useState } from "react"
import {
  useAddShippingMethodToCart,
  useCompleteCart,
  useCreateCart,
  useSetPaymentSession,
  useUpdateCart,
  useCreatePaymentSession,
} from "../hooks/store/"
import { Cart } from "../types"
import { LineItem } from "@medusajs/medusa/dist"

interface CartState {
  /**
   * The currently-used cart.
   */
  cart?: Cart
}

/**
 * The cart context available if the {@link CartProvider} is used previously in the React components tree.
 */
export interface CartContext extends CartState {
  /**
   * A state function used to set the cart object.
   *
   * @param {Cart} cart - The new value of the cart.
   */
  setCart: (cart: Cart) => void
  /**
   * A mutation used to select a payment processor during checkout.
   * Using it is equivalent to using the {@link useSetPaymentSession} mutation.
   */
  pay: ReturnType<typeof useSetPaymentSession>
  /**
   * A mutation used to create a cart.
   * Using it is equivalent to using the {@link useCreateCart} mutation.
   */
  createCart: ReturnType<typeof useCreateCart>
  /**
   * A mutation used to initialize payment sessions during checkout.
   * Using it is equivalent to using the {@link useCreatePaymentSession} mutation.
   */
  startCheckout: ReturnType<typeof useCreatePaymentSession>
  /**
   * A mutation used to complete the cart and place the order.
   * Using it is equivalent to using the {@link useCompleteCart} mutation.
   */
  completeCheckout: ReturnType<typeof useCompleteCart>
  /**
   * A mutation used to update a cart’s details such as region, customer email, shipping address, and more.
   * Using it is equivalent to using the {@link useUpdateCart} mutation.
   */
  updateCart: ReturnType<typeof useUpdateCart>
  /**
   * A mutation used to add a shipping method to the cart during checkout.
   * Using it is equivalent to using the {@link useAddShippingMethodToCart} mutation.
   */
  addShippingMethod: ReturnType<typeof useAddShippingMethodToCart>
  /**
   * The number of items in the cart.
   */
  totalItems: number
}

const CartContext = React.createContext<CartContext | null>(null)

/**
 * This hook exposes the context of {@link CartProvider}.
 *
 * The context provides helper functions and mutations for managing the cart and checkout. You can refer to the following guides for examples on how to use them:
 *
 * - [How to Add Cart Functionality](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-cart)
 * - [How to Implement Checkout Flow](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-checkout-flow)
 *
 * @example
 * ```tsx title="src/Cart.ts"
 * import * as React from "react"
 *
 * import { useCart } from "medusa-react"
 *
 * const Cart = () => {
 *   const handleClick = () => {
 *     createCart.mutate({}) // create an empty cart
 *   }
 *
 *   const { cart, createCart } = useCart()
 *
 *   return (
 *     <div>
 *       {createCart.isLoading && <div>Loading...</div>}
 *       {!cart?.id && (
 *         <button onClick={handleClick}>
 *           Create cart
 *         </button>
 *       )}
 *       {cart?.id && (
 *         <div>Cart ID: {cart.id}</div>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Cart
 * ```
 *
 * In the example above, you retrieve the `createCart` mutation and `cart` state object using the `useCart` hook.
 * If the `cart` is not set, a button is shown. When the button is clicked, the `createCart` mutation is executed, which interacts with the backend and creates a new cart.
 *
 * After the cart is created, the `cart` state variable is set and its ID is shown instead of the button.
 *
 * :::note
 *
 * The example above does not store in the browser the ID of the cart created, so the cart’s data will be gone on refresh.
 * You would have to do that using the browser’s [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
 *
 * :::
 *
 * @customNamespace Providers.Cart
 */
export const useCart = () => {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export interface CartProps {
  /**
   * @ignore
   */
  children: React.ReactNode
  /**
   * An optional initial value to be used for the cart.
   */
  initialState?: Cart
}

const defaultInitialState = {
  id: "",
  items: [] as any,
} as Cart

/**
 * `CartProvider` makes use of some of the hooks already exposed by `medusa-react` to perform cart operations on the Medusa backend.
 * You can use it to create a cart, start the checkout flow, authorize payment sessions, and so on.
 *
 * It also manages one single global piece of state which represents a cart, exactly like the one created on your Medusa backend.
 *
 * To use `CartProvider`, you first have to insert it somewhere in your component tree below the {@link Providers.Medusa.MedusaProvider | MedusaProvider}. Then, in any of the child components,
 * you can use the {@link useCart} hook exposed by `medusa-react` to get access to cart operations and data.
 *
 * @param {CartProps} param0 - Props of the provider.
 *
 * @example
 * ```tsx title="src/App.ts"
 * import { CartProvider, MedusaProvider } from "medusa-react"
 * import Storefront from "./Storefront"
 * import { QueryClient } from "@tanstack/react-query"
 * import React from "react"
 *
 * const queryClient = new QueryClient()
 *
 * function App() {
 *   return (
 *     <MedusaProvider
 *       queryClientProviderProps={{ client: queryClient }}
 *       baseUrl="http://localhost:9000"
 *     >
 *       <CartProvider>
 *         <Storefront />
 *       </CartProvider>
 *     </MedusaProvider>
 *   )
 * }
 *
 * export default App
 * ```
 *
 * @customNamespace Providers.Cart
 */
export const CartProvider = ({
  children,
  initialState = defaultInitialState,
}: CartProps) => {
  const [cart, setCart] = useState<Cart>(initialState)

  const createCart = useCreateCart({
    onSuccess: ({ cart }) => setCart(cart),
  })

  const updateCart = useUpdateCart(cart?.id, {
    onSuccess: ({ cart }) => setCart(cart),
  })

  const addShippingMethod = useAddShippingMethodToCart(cart?.id, {
    onSuccess: ({ cart }) => setCart(cart),
  })

  const startCheckout = useCreatePaymentSession(cart?.id, {
    onSuccess: ({ cart }) => setCart(cart),
  })

  const pay = useSetPaymentSession(cart?.id, {
    onSuccess: ({ cart }) => {
      setCart(cart)
    },
  })

  const completeCheckout = useCompleteCart(cart?.id)

  const totalItems = cart?.items
    .map((i: LineItem) => i.quantity)
    .reduce((acc: number, curr: number) => acc + curr, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        createCart,
        pay,
        startCheckout,
        completeCheckout,
        updateCart,
        addShippingMethod,
        totalItems: totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
