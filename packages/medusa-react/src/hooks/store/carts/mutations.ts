import {
  StoreCartsRes,
  StoreCompleteCartRes,
  StorePostCartReq,
  StorePostCartsCartPaymentSessionReq,
  StorePostCartsCartPaymentSessionUpdateReq,
  StorePostCartsCartReq,
  StorePostCartsCartShippingMethodReq,
} from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"

/**
 * The details of the cart to create.
 */
export type CreateCartReq = StorePostCartReq | undefined

/**
 * This hook creates a Cart. Although optional, specifying the cart's region and sales channel can affect the cart's pricing and
 * the products that can be added to the cart respectively.
 * 
 * So, make sure to set those early on and change them if necessary, such as when the customer changes their region.
 * 
 * If a customer is logged in, make sure to pass its ID or email within the cart's details so that the cart is attached to the customer.
 * 
 * @example
 * import React from "react"
 * import { useCreateCart } from "medusa-react"
 * 
 * type Props = {
 *   regionId: string
 * }
 * 
 * const Cart = ({ regionId }: Props) => {
 *   const createCart = useCreateCart()
 * 
 *   const handleCreate = () => {
 *     createCart.mutate({
 *       region_id: regionId
 *       // creates an empty cart
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.items)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useCreateCart = (
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartReq | undefined
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    (data?: StorePostCartReq | undefined) => client.carts.create(data),
    options
  )
}

/**
 * This hook updates a Cart's details. If the cart has payment sessions and the region was not changed, 
 * the payment sessions are updated. The cart's totals are also recalculated.
 * 
 * @example
 * import React from "react"
 * import { useUpdateCart } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const updateCart = useUpdateCart(cartId)
 * 
 *   const handleUpdate = (
 *     email: string
 *   ) => {
 *     updateCart.mutate({
 *       email
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.email)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useUpdateCart = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error, StorePostCartsCartReq>
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCartsCartReq) => client.carts.update(cartId, data),
    options
  )
}

/**
 * This hook completes a cart and place an order or create a swap, based on the cart's type. This includes attempting to authorize the cart's payment.
 * If authorizing the payment requires more action, the cart will not be completed and the order will not be placed or the swap will not be created.
 * An idempotency key will be generated if none is provided in the header `Idempotency-Key` and added to
 * the response. If an error occurs during cart completion or the request is interrupted for any reason, the cart completion can be retried by passing the idempotency
 * key in the `Idempotency-Key` header.
 * 
 * @example
 * import React from "react"
 * import { useCompleteCart } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const completeCart = useCompleteCart(cartId)
 * 
 *   const handleComplete = () => {
 *     completeCart.mutate(void 0, {
 *       onSuccess: ({ data, type }) => {
 *         console.log(data.id, type)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useCompleteCart = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<StoreCompleteCartRes, Error>
) => {
  const { client } = useMedusa()
  return useMutation(() => client.carts.complete(cartId), options)
}

/**
 * This hook creates Payment Sessions for each of the available Payment Providers in the Cart's Region. If there's only one payment session created,
 * it will be selected by default. The creation of the payment session uses the payment provider and may require sending requests to third-party services.
 * 
 * @example
 * import React from "react"
 * import { useCreatePaymentSession } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const createPaymentSession = useCreatePaymentSession(cartId)
 * 
 *   const handleComplete = () => {
 *     createPaymentSession.mutate(void 0, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.payment_sessions)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useCreatePaymentSession = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<StoreCartsRes, Error>
) => {
  const { client } = useMedusa()
  return useMutation(() => client.carts.createPaymentSessions(cartId), options)
}

/**
 * The details of the payment session to update.
 */
export type UpdatePaymentSessionReq = StorePostCartsCartPaymentSessionUpdateReq & {
  /**
   * The payment provider's identifier.
   */
  provider_id: string
}

/**
 * This hook updates a Payment Session with additional data. This can be useful depending on the payment provider used.
 * All payment sessions are updated and cart totals are recalculated afterwards.
 * 
 * @example
 * import React from "react"
 * import { useUpdatePaymentSession } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const updatePaymentSession = useUpdatePaymentSession(cartId)
 * 
 *   const handleUpdate = (
 *     providerId: string,
 *     data: Record<string, unknown>
 *   ) => {
 *     updatePaymentSession.mutate({
 *       provider_id: providerId,
 *       data
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.payment_session)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useUpdatePaymentSession = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    UpdatePaymentSessionReq
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ data, provider_id }: UpdatePaymentSessionReq) =>
      client.carts.updatePaymentSession(cartId, provider_id, { data }),
    options
  )
}

/**
 * The details of the payment session to refresh.
 */
export type RefreshPaymentSessionMutationData = {
  /**
   * The payment provider's identifier.
   */
  provider_id: string
}

/**
 * This hook refreshes a Payment Session to ensure that it is in sync with the Cart. This is usually not necessary, but is provided for edge cases.
 * 
 * @example
 * import React from "react"
 * import { useRefreshPaymentSession } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const refreshPaymentSession = useRefreshPaymentSession(cartId)
 * 
 *   const handleRefresh = (
 *     providerId: string
 *   ) => {
 *     refreshPaymentSession.mutate({
 *       provider_id: providerId,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.payment_sessions)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useRefreshPaymentSession = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    RefreshPaymentSessionMutationData
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ provider_id }: RefreshPaymentSessionMutationData) =>
      client.carts.refreshPaymentSession(cartId, provider_id),
    options
  )
}

/**
 * This hook selects the Payment Session that will be used to complete the cart. This is typically used when the customer chooses their preferred payment method during checkout.
 * The totals of the cart will be recalculated.
 * 
 * @example
 * import React from "react"
 * import { useSetPaymentSession } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const setPaymentSession = useSetPaymentSession(cartId)
 * 
 *   const handleSetPaymentSession = (
 *     providerId: string
 *   ) => {
 *     setPaymentSession.mutate({
 *       provider_id: providerId,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.payment_session)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useSetPaymentSession = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartsCartPaymentSessionReq
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCartsCartPaymentSessionReq) =>
      client.carts.setPaymentSession(cartId, data),
    options
  )
}

/**
 * This hook adds a shipping method to the cart. The validation of the `data` field is handled by the fulfillment provider of the chosen shipping option.
 * 
 * @example
 * import React from "react"
 * import { useAddShippingMethodToCart } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const addShippingMethod = useAddShippingMethodToCart(cartId)
 * 
 *   const handleAddShippingMethod = (
 *     optionId: string
 *   ) => {
 *     addShippingMethod.mutate({
 *       option_id: optionId,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.shipping_methods)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useAddShippingMethodToCart = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    StorePostCartsCartShippingMethodReq
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCartsCartShippingMethodReq) =>
      client.carts.addShippingMethod(cartId, data),
    options
  )
}

/**
 * The details of the payment session to delete.
 */
export type DeletePaymentSessionMutationData = {
  /**
   * The payment provider's identifier.
   */
  provider_id: string
}

/**
 * This hook deletes a Payment Session in a Cart. May be useful if a payment has failed. The totals will be recalculated.
 * 
 * @example
 * import React from "react"
 * import { useDeletePaymentSession } from "medusa-react"
 * 
 * type Props = {
 *   cartId: string
 * }
 * 
 * const Cart = ({ cartId }: Props) => {
 *   const deletePaymentSession = useDeletePaymentSession(cartId)
 * 
 *   const handleDeletePaymentSession = (
 *     providerId: string
 *   ) => {
 *     deletePaymentSession.mutate({
 *       provider_id: providerId,
 *     }, {
 *       onSuccess: ({ cart }) => {
 *         console.log(cart.payment_sessions)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Cart
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useDeletePaymentSession = (
  /**
   * The cart's ID.
   */
  cartId: string,
  options?: UseMutationOptions<
    StoreCartsRes,
    Error,
    DeletePaymentSessionMutationData
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ provider_id }: DeletePaymentSessionMutationData) =>
      client.carts.deletePaymentSession(cartId, provider_id),
    options
  )
}

/**
 * This hook allows you to create a cart and set its payment session as a preparation for checkout.
 * It performs the same actions as the {@link useCreateCart} and {@link useCreatePaymentSession} hooks.
 * 
 * @example
 * import React from "react"
 * import { useStartCheckout } from "medusa-react"
 * 
 * type Props = {
 *   regionId: string
 * }
 * 
 * const Checkout = ({ regionId }: Props) => {
 *   const startCheckout = useStartCheckout()
 * 
 *   const handleCheckout = () => {
 *     startCheckout.mutate({
 *       region_id: regionId,
 *     }, {
 *       onSuccess: (cart) => {
 *         console.log(cart.payment_sessions)
 *       }
 *     })
 *   }
 *   
 *   // ...
 * }
 * 
 * export default Checkout
 * 
 * @customNamespace Hooks.Store.Carts
 * @category Mutations
 */
export const useStartCheckout = (
  options?: UseMutationOptions<StoreCartsRes["cart"], Error, StorePostCartReq>
) => {
  const { client } = useMedusa()
  const mutation = useMutation(async (data?: StorePostCartReq) => {
    const { cart } = await client.carts.create(data)
    const res = await client.carts.createPaymentSessions(cart.id)
    return res.cart
  }, options)

  return mutation
}
