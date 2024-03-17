import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  StorePaymentCollectionSessionsReq,
  StorePaymentCollectionsRes,
  StorePaymentCollectionsSessionRes,
  StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
  StorePostPaymentCollectionsBatchSessionsReq,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { paymentCollectionQueryKeys } from "./queries"

/**
 * This hook creates, updates, or deletes a list of payment sessions of a Payment Collections. If a payment session is not provided in the `sessions` array, it's deleted.
 *
 * @example
 * To add two new payment sessions:
 *
 * ```tsx
 * import React from "react"
 * import { useManageMultiplePaymentSessions } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const managePaymentSessions = useManageMultiplePaymentSessions(
 *     paymentCollectionId
 *   )
 *
 *   const handleManagePaymentSessions = () => {
 *     managePaymentSessions.mutate({
 *       // Total amount = 10000
 *       sessions: [
 *         {
 *           provider_id: "stripe",
 *           amount: 5000,
 *         },
 *         {
 *           provider_id: "manual",
 *           amount: 5000,
 *         },
 *       ]
 *     }, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.payment_sessions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 * ```
 *
 * To update a payment session and another one by not including it in the payload:
 *
 * ```tsx
 * import React from "react"
 * import { useManageMultiplePaymentSessions } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const managePaymentSessions = useManageMultiplePaymentSessions(
 *     paymentCollectionId
 *   )
 *
 *   const handleManagePaymentSessions = () => {
 *     managePaymentSessions.mutate({
 *       // Total amount = 10000
 *       sessions: [
 *         {
 *           provider_id: "stripe",
 *           amount: 10000,
 *           session_id: "ps_123456"
 *         },
 *       ]
 *     }, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.payment_sessions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 * ```
 *
 * @customNamespace Hooks.Store.Payment Collections
 * @category Mutations
 */
export const useManageMultiplePaymentSessions = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    StorePostPaymentCollectionsBatchSessionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePostPaymentCollectionsBatchSessionsReq) =>
      client.paymentCollections.managePaymentSessionsBatch(id, payload),
    ...buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    ),
  })
}

/**
 * This hook creates a Payment Session for a payment provider in a Payment Collection.
 *
 * @example
 * import React from "react"
 * import { useManagePaymentSession } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const managePaymentSession = useManagePaymentSession(
 *     paymentCollectionId
 *   )
 *
 *   const handleManagePaymentSession = (
 *     providerId: string
 *   ) => {
 *     managePaymentSession.mutate({
 *       provider_id: providerId
 *     }, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.payment_sessions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Store.Payment Collections
 * @category Mutations
 */
export const useManagePaymentSession = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    StorePaymentCollectionSessionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePaymentCollectionSessionsReq) =>
      client.paymentCollections.managePaymentSession(id, payload),
    ...buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    ),
  })
}

/**
 * This hook authorizes a Payment Session of a Payment Collection.
 *
 * @typeParamDefinition string - The payment session's ID.
 *
 * @example
 * import React from "react"
 * import { useAuthorizePaymentSession } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const authorizePaymentSession = useAuthorizePaymentSession(
 *     paymentCollectionId
 *   )
 *   // ...
 *
 *   const handleAuthorizePayment = (paymentSessionId: string) => {
 *     authorizePaymentSession.mutate(paymentSessionId, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.payment_sessions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Store.Payment Collections
 * @category Mutations
 */
export const useAuthorizePaymentSession = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    /**
     * The payment session's ID.
     */
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (session_id: string) =>
      client.paymentCollections.authorizePaymentSession(id, session_id),
    ...buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    ),
  })
}

/**
 * This hook authorize the Payment Sessions of a Payment Collection.
 *
 * @example
 * import React from "react"
 * import { useAuthorizePaymentSessionsBatch } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const authorizePaymentSessions = useAuthorizePaymentSessionsBatch(
 *     paymentCollectionId
 *   )
 *   // ...
 *
 *   const handleAuthorizePayments = (paymentSessionIds: string[]) => {
 *     authorizePaymentSessions.mutate({
 *       session_ids: paymentSessionIds
 *     }, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.payment_sessions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Store.Payment Collections
 * @category Mutations
 */
export const useAuthorizePaymentSessionsBatch = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    StorePostPaymentCollectionsBatchSessionsAuthorizeReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) =>
      client.paymentCollections.authorizePaymentSessionsBatch(id, payload),
    ...buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    ),
  })
}

/**
 * This hook refreshes a Payment Session's data to ensure that it is in sync with the Payment Collection.
 *
 * @typeParamDefinition string - The payment session's ID.
 *
 * @example
 * import React from "react"
 * import { usePaymentCollectionRefreshPaymentSession } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const refreshPaymentSession = usePaymentCollectionRefreshPaymentSession(
 *     paymentCollectionId
 *   )
 *   // ...
 *
 *   const handleRefreshPaymentSession = (paymentSessionId: string) => {
 *     refreshPaymentSession.mutate(paymentSessionId, {
 *       onSuccess: ({ payment_session }) => {
 *         console.log(payment_session.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Store.Payment Collections
 * @category Mutations
 */
export const usePaymentCollectionRefreshPaymentSession = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsSessionRes>,
    Error,
    /**
     * The payment session's ID.
     */
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (session_id: string) =>
      client.paymentCollections.refreshPaymentSession(id, session_id),
    ...buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    ),
  })
}
