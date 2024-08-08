import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CaptureDTO,
  FilterableCaptureProps,
  FilterablePaymentCollectionProps,
  FilterablePaymentProps,
  FilterablePaymentProviderProps,
  FilterablePaymentSessionProps,
  FilterableRefundProps,
  FilterableRefundReasonProps,
  PaymentCollectionDTO,
  PaymentDTO,
  PaymentProviderDTO,
  PaymentSessionDTO,
  RefundDTO,
  RefundReasonDTO,
} from "./common"
import {
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  CreateRefundReasonDTO,
  PaymentCollectionUpdatableFields,
  ProviderWebhookPayload,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
  UpdateRefundReasonDTO,
  UpsertPaymentCollectionDTO,
} from "./mutations"

/**
 * The main service interface for the Payment Module.
 */
export interface IPaymentModuleService extends IModuleService {
  /* ********** PAYMENT COLLECTION ********** */

  /**
   * This method creates payment collections.
   *
   * @param {CreatePaymentCollectionDTO[]} data - The payment collections to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The created payment collections.
   *
   * @example
   * const paymentCollections =
   *   await paymentModuleService.createPaymentCollections([
   *     {
   *       region_id: "reg_123",
   *       currency_code: "usd",
   *       amount: 3000,
   *     },
   *     {
   *       region_id: "reg_321",
   *       currency_code: "eur",
   *       amount: 2000,
   *     },
   *   ])
   */
  createPaymentCollections(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /**
   * This method creates a payment collection.
   *
   * @param {CreatePaymentCollectionDTO} data - The payment collection to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The created payment collection.
   *
   * @example
   * const paymentCollection =
   *   await paymentModuleService.createPaymentCollections({
   *     region_id: "reg_123",
   *     currency_code: "usd",
   *     amount: 3000,
   *   })
   */
  createPaymentCollections(
    data: CreatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method retrieves a payment collection by its ID.
   *
   * @param {string} paymentCollectionId - The payment collection's ID.
   * @param {FindConfig<PaymentCollectionDTO>} config - The configurations determining how the payment collection is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a payment collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The retrieved payment collection.
   *
   * @example
   * A simple example that retrieves a {type name} by its ID:
   *
   * ```ts
   * const paymentCollection =
   *   await paymentModuleService.retrievePaymentCollection(
   *     "pay_col_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const paymentCollection =
   *   await paymentModuleService.retrievePaymentCollection(
   *     "pay_col_123",
   *     {
   *       relations: ["payment_sessions"],
   *     }
   *   )
   * ```
   *
   *
   */
  retrievePaymentCollection(
    paymentCollectionId: string,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method retrieves a paginated list of payment collections based on optional filters and configuration.
   *
   * @param {FilterablePaymentCollectionProps} filters - The filters to apply on the retrieved payment collection.
   * @param {FindConfig<PaymentCollectionDTO>} config - The configurations determining how the payment collection is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a payment collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The list of payment collections.
   *
   * @example
   * To retrieve a list of payment collections using their IDs:
   *
   * ```ts
   * const paymentCollections =
   *   await paymentModuleService.listPaymentCollections({
   *     id: ["pay_col_123", "pay_col_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the payment collection:
   *
   * ```ts
   * const paymentCollections =
   *   await paymentModuleService.listPaymentCollections(
   *     {
   *       id: ["pay_col_123", "pay_col_321"],
   *     },
   *     {
   *       relations: ["payment_sessions"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const paymentCollections =
   *   await paymentModuleService.listPaymentCollections(
   *     {
   *       id: ["pay_col_123", "pay_col_321"],
   *     },
   *     {
   *       relations: ["payment_sessions"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   *
   *
   */
  listPaymentCollections(
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /**
   * This method retrieves a paginated list of payment collections along with the total count of available payment collections satisfying the provided filters.
   *
   * @param {FilterablePaymentCollectionProps} filters - The filters to apply on the retrieved payment collection.
   * @param {FindConfig<PaymentCollectionDTO>} config - The configurations determining how the payment collection is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a payment collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PaymentCollectionDTO[], number]>} The list of payment collections along with their total count.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * const paymentCollections =
   *   await paymentModuleService.listAndCountPaymentCollections({
   *     id: ["pay_col_123", "pay_col_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * const paymentCollections =
   *   await paymentModuleService.listAndCountPaymentCollections(
   *     {
   *       id: ["pay_col_123", "pay_col_321"],
   *     },
   *     {
   *       relations: ["payment_sessions"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const paymentCollections =
   *   await paymentModuleService.listAndCountPaymentCollections(
   *     {
   *       id: ["pay_col_123", "pay_col_321"],
   *     },
   *     {
   *       relations: ["payment_sessions"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   *
   *
   */
  listAndCountPaymentCollections(
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<[PaymentCollectionDTO[], number]>

  /**
   * This method updates an existing payment collection.
   *
   * @param {string} paymentCollectionId - The payment collection's ID.
   * @param {PaymentCollectionUpdatableFields} data - The attributes to update in the payment collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The updated payment collection.
   *
   * @example
   * const paymentCollection =
   *   await paymentModuleService.updatePaymentCollections(
   *     "pay_col_123",
   *     {
   *       amount: 3000,
   *     }
   *   )
   */
  updatePaymentCollections(
    paymentCollectionId: string,
    data: PaymentCollectionUpdatableFields,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method updates existing payment collections matching the specified filters.
   *
   * @param {FilterablePaymentCollectionProps} selector - The filters specifying which payment collections to update.
   * @param {PaymentCollectionUpdatableFields} data - The attributes to update in the payment collections.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The updated payment collections.
   *
   * @example
   * const paymentCollections =
   *   await paymentModuleService.updatePaymentCollections(
   *     {
   *       id: ["pay_col_123", "pay_col_321"],
   *     },
   *     {
   *       currency_code: "usd",
   *     }
   *   )
   */
  updatePaymentCollections(
    selector: FilterablePaymentCollectionProps,
    data: PaymentCollectionUpdatableFields,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /**
   * This method updates or creates payment collections if they don't exist.
   *
   * @param {UpsertPaymentCollectionDTO[]} data - The attributes in the payment collections to be created or updated. If
   * the object includes the `id` field, then the payment collection is updated. Otherise, it's created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The created or updated payment collections.
   *
   * @example
   * const paymentCollections =
   *   await paymentModuleService.upsertPaymentCollections([
   *     {
   *       id: "pay_col_123",
   *       region_id: "reg_123",
   *     },
   *     {
   *       region_id: "reg_123",
   *       currency_code: "usd",
   *       amount: 3000,
   *     },
   *   ])
   */
  upsertPaymentCollections(
    data: UpsertPaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /**
   * This method updates or creates a payment collection if it doesn't exist.
   *
   * @param {UpsertPaymentCollectionDTO} data - The attributes in the payment collection to be created or updated. If the `id`
   * field is included, the payment collection is updated. Otherwise, it's created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The created or updated payment collection.
   *
   * @example
   * const paymentCollection =
   *   await paymentModuleService.upsertPaymentCollections({
   *     id: "pay_col_123",
   *     region_id: "reg_123",
   *   })
   */
  upsertPaymentCollections(
    data: UpsertPaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method deletes a payment collection by its ID.
   *
   * @param {string[]} paymentCollectionId - The payment collection's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the payment collection is deleted successfully.
   *
   * @example
   * await paymentModuleService.deletePaymentCollections([
   *   "pay_col_123",
   *   "pay_col_321",
   * ])
   */
  deletePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a payment collection by its ID.
   *
   * @param {string} paymentCollectionId - The payment collection's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the payment collection is deleted successfully.
   *
   * @example
   * await paymentModuleService.deletePaymentCollections(
   *   "pay_col_123"
   * )
   */
  deletePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method marks a payment collection as completed by settings its `completed_at` field to the current date and time.
   *
   * @param {string} paymentCollectionId - The payment collection's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The payment collection's details.
   *
   * @example
   * const paymentCollection =
   *   await paymentModuleService.completePaymentCollections(
   *     "pay_col_123"
   *   )
   */
  completePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method marks payment collections as completed by settings their `completed_at` field to the current date and time.
   *
   * @param {string[]} paymentCollectionId - The payment collections' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The payment collections' details.
   *
   * @example
   * const paymentCollection =
   *   await paymentModuleService.completePaymentCollections([
   *     "pay_col_123",
   *     "pay_col_321",
   *   ])
   */
  completePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  retrievePaymentSession(
    paymentSessionId: string,
    config?: FindConfig<PaymentSessionDTO>,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO>

  /* ********** PAYMENT SESSION ********** */

  /**
   * This method creates a payment session in a payment collection.
   *
   * @param {string} paymentCollectionId - The ID of the payment collection to create the session for.
   * @param {CreatePaymentSessionDTO} data - The details of the payment session.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The payment collection's details.
   *
   * @example
   * const paymentSession =
   *   await paymentModuleService.createPaymentSession(
   *     "pay_col_1",
   *     {
   *       provider_id: "stripe",
   *       currency_code: "usd",
   *       amount: 3000,
   *       data: {},
   *     }
   *   )
   */
  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO>

  /**
   * This method updates a payment session.
   *
   * @param {UpdatePaymentSessionDTO} data - The attributes to update in the payment session.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentSessionDTO>} The payment session's details.
   *
   * @example
   * const paymentSession =
   *   await paymentModuleService.updatePaymentSession({
   *     id: "payses_123",
   *     currency_code: "usd",
   *     amount: 3000,
   *     data: {},
   *   })
   */
  updatePaymentSession(
    data: UpdatePaymentSessionDTO,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO>

  /**
   * This method deletes a payment session.
   *
   * @param {string} id - The ID of the payment session.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves whent the payment session is deleted successfully.
   *
   * @example
   * await paymentModuleService.deletePaymentSession("payses_123")
   */
  deletePaymentSession(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method authorizes a payment session using its associated payment provider. This creates a payment that can later be captured.
   *
   * Learn more about the payment flow in [this guide](https://docs.medusajs.com/experimental/payment/payment-flow/)
   *
   * @param {string} id - The payment session's ID.
   * @param {Record<string, unknown>} context - Context data to pass to the associated payment provider.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The created payment.
   *
   * @example
   * const payment =
   *   await paymentModuleService.authorizePaymentSession(
   *     "payses_123",
   *     {}
   *   )
   */
  authorizePaymentSession(
    id: string,
    context: Record<string, unknown>,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method retrieves a paginated list of payment sessions based on optional filters and configuration.
   *
   * @param {FilterablePaymentSessionProps} filters - The filters to apply on the retrieved payment sessions.
   * @param {FindConfig<PaymentSessionDTO>} config - The configurations determining how the payment session is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a payment session.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentSessionDTO[]>} The list of payment sessions.
   *
   * @example
   * To retrieve a list of payment sessions using their IDs:
   *
   * ```ts
   * const paymentSessions =
   *   await paymentModuleService.listPaymentSessions({
   *     id: ["payses_123", "payses_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the payment session:
   *
   * ```ts
   * const paymentSessions =
   *   await paymentModuleService.listPaymentSessions(
   *     {
   *       id: ["payses_123", "payses_321"],
   *     },
   *     {
   *       relations: ["payment"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const paymentSessions =
   *   await paymentModuleService.listPaymentSessions(
   *     {
   *       id: ["payses_123", "payses_321"],
   *     },
   *     {
   *       relations: ["payment"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listPaymentSessions(
    filters?: FilterablePaymentSessionProps,
    config?: FindConfig<PaymentSessionDTO>,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO[]>

  /* ********** PAYMENT ********** */

  /**
   * This method retrieves a paginated list of payments based on optional filters and configuration.
   *
   * @param {FilterablePaymentProps} filters - The filters to apply on the retrieved payment.
   * @param {FindConfig<PaymentDTO>} config - The configurations determining how the payment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a payment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO[]>} A list of payment.
   *
   * @example
   * To retrieve a list of payments using their IDs:
   *
   * ```ts
   * const payments = await paymentModuleService.listPayments({
   *   id: ["pay_123", "pay_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the payment:
   *
   * ```ts
   * const payments = await paymentModuleService.listPayments(
   *   {
   *     id: ["pay_123", "pay_321"],
   *   },
   *   {
   *     relations: ["payment_session"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const payments = await paymentModuleService.listPayments(
   *   {
   *     id: ["pay_123", "pay_321"],
   *   },
   *   {
   *     relations: ["payment_session"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listPayments(
    filters?: FilterablePaymentProps,
    config?: FindConfig<PaymentDTO>,
    sharedContext?: Context
  ): Promise<PaymentDTO[]>

  /**
   * This method updates an existing payment.
   *
   * @param {UpdatePaymentDTO} data - The attributes to update in the payment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The updated payment.
   *
   * @example
   * const payment = await paymentModuleService.updatePayment({
   *   id: "pay_123",
   *   customer_id: "cus_123",
   * })
   */
  updatePayment(
    data: UpdatePaymentDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method captures a payment using its associated payment provider.
   *
   * Learn more about the payment flow in [this guide](https://docs.medusajs.com/experimental/payment/payment-flow/)
   *
   * @param {CreateCaptureDTO} data - The payment capture to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The payment's details.
   *
   * @example
   * const payment = await paymentModuleService.capturePayment({
   *   payment_id: "pay_123",
   * })
   */
  capturePayment(
    data: CreateCaptureDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method refunds a payment using its associated payment provider. An amount can only be refunded if it has been captured first.
   *
   * @param {CreateRefundDTO} data - The refund to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The payment's details.
   *
   * @example
   * const payment = await paymentModuleService.refundPayment({
   *   payment_id: "pay_123",
   *   amount: 300,
   * })
   */
  refundPayment(
    data: CreateRefundDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method cancels a payment.
   *
   * @param {string} paymentId - The payment's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The payment's details.
   *
   * @example
   * const payment =
   *   await paymentModuleService.cancelPayment("pay_123")
   */
  cancelPayment(paymentId: string, sharedContext?: Context): Promise<PaymentDTO>

  /**
   * This method retrieves a paginated list of payment providers based on optional filters and configuration.
   *
   * @param {FilterablePaymentProviderProps} filters - The filters to apply on the retrieved payment providers.
   * @param {FindConfig<PaymentProviderDTO>} config - The configurations determining how the payment provider is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a payment provider.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentProviderDTO[]>} The list of payment providers.
   *
   * @example
   * To retrieve a list of payment providers using their IDs:
   *
   * ```ts
   * const paymentProviders =
   *   await paymentModuleService.listPaymentProviders({
   *     id: ["stripe", "system"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const paymentProviders =
   *   await paymentModuleService.listPaymentProviders(
   *     {
   *       id: ["stripe", "system"],
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listPaymentProviders(
    filters?: FilterablePaymentProviderProps,
    config?: FindConfig<PaymentProviderDTO>,
    sharedContext?: Context
  ): Promise<PaymentProviderDTO[]>

  listAndCountPaymentProviders(
    filters?: FilterablePaymentProviderProps,
    config?: FindConfig<PaymentProviderDTO>,
    sharedContext?: Context
  ): Promise<[PaymentProviderDTO[], number]>

  /**
   * This method retrieves a paginated list of captures based on optional filters and configuration.
   *
   * @param {FilterableCaptureProps} filters - The filters to apply on the retrieved captures.
   * @param {FindConfig<CaptureDTO>} config - The configurations determining how the capture is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a capture.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CaptureDTO[]>} The list of captures.
   *
   * @example
   * To retrieve a list of captures using their IDs:
   *
   * ```ts
   * const captures = await paymentModuleService.listCaptures({
   *   id: ["capt_123", "capt_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the capture:
   *
   * ```ts
   * const captures = await paymentModuleService.listCaptures(
   *   {
   *     id: ["capt_123", "capt_321"],
   *   },
   *   {
   *     relations: ["payment"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const captures = await paymentModuleService.listCaptures(
   *   {
   *     id: ["capt_123", "capt_321"],
   *   },
   *   {
   *     relations: ["payment"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listCaptures(
    filters?: FilterableCaptureProps,
    config?: FindConfig<CaptureDTO>,
    sharedContext?: Context
  ): Promise<CaptureDTO[]>

  /**
   * This method retrieves a paginated list of refunds based on optional filters and configuration.
   *
   * @param {FilterableRefundProps} filters - The filters to apply on the retrieved refunds.
   * @param {FindConfig<RefundDTO>} config - The configurations determining how the refund is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a refund.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RefundDTO[]>} The list of refunds.
   *
   * @example
   * To retrieve a list of refunds using their IDs:
   *
   * ```ts
   * const refunds = await paymentModuleService.listRefunds({
   *   id: ["ref_123", "ref_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the refund:
   *
   * ```ts
   * const refunds = await paymentModuleService.listRefunds(
   *   {
   *     id: ["ref_123", "ref_321"],
   *   },
   *   {
   *     relations: ["payment"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const refunds = await paymentModuleService.listRefunds(
   *   {
   *     id: ["ref_123", "ref_321"],
   *   },
   *   {
   *     relations: ["payment"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listRefunds(
    filters?: FilterableRefundProps,
    config?: FindConfig<RefundDTO>,
    sharedContext?: Context
  ): Promise<RefundDTO[]>

  /**
   * This method creates refund reasons.
   *
   * @param {CreateRefundReasonDTO[]} data - The refund reasons to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RefundReasonDTO[]>} The created refund reasons.
   *
   * @example
   * const refundReasons =
   *   await paymentModuleService.createRefundReasons([
   *     {
   *       label: "Too big",
   *     },
   *     {
   *       label: "Too big",
   *     },
   *   ])
   */
  createRefundReasons(
    data: CreateRefundReasonDTO[],
    sharedContext?: Context
  ): Promise<RefundReasonDTO[]>

  /**
   * This method creates a refund reason.
   *
   * @param {CreateRefundReasonDTO} data - The refund reason to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RefundReasonDTO>} The created refund reason.
   *
   * @example
   * const refundReason =
   *   await paymentModuleService.createRefundReasons({
   *     label: "Too big",
   *   })
   */
  createRefundReasons(
    data: CreateRefundReasonDTO,
    sharedContext?: Context
  ): Promise<RefundReasonDTO>

  /**
   * This method deletes a refund reason by its ID.
   *
   * @param {string[]} refundReasonId - The refund reason's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the refund reason is deleted successfully.
   *
   * @example
   * await paymentModuleService.deleteRefundReasons([
   *   "refr_123",
   *   "refr_321",
   * ])
   */
  deleteRefundReasons(
    refundReasonId: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a refund reason by its ID.
   *
   * @param {string} refundReasonId - The refund reason's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the refund reason is deleted successfully.
   *
   * @example
   * await paymentModuleService.deleteRefundReasons(
   *   "refr_123"
   * )
   */
  deleteRefundReasons(
    refundReasonId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes refund reasons by their IDs.
   *
   * @param {string[]} refundReasonId - The IDs of refund reasons.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await paymentModule.softDeleteRefundReasons(["cus_123"])
   */
  softDeleteRefundReasons<TReturnableLinkableKeys extends string = string>(
    refundReasonId: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted refund reason by their IDs.
   *
   * @param {string[]} refundReasonId - The IDs of refund reasons.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the refund reason. You can pass to its `returnLinkableKeys`
   * property any of the refund reason's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await paymentModule.restoreRefundReasons(["cus_123"])
   */
  restoreRefundReasons<TReturnableLinkableKeys extends string = string>(
    refundReasonId: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method updates an existing refund reason.
   *
   * @param {UpdateRefundReasonDTO} data - The attributes to update in the refund reason.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RefundReasonDTO>} The updated refund reason.
   *
   * @example
   * const refundReason =
   *   await paymentModuleService.updateRefundReasons(
   *     [{
   *       id: "refr_test1",
   *       amount: 3000,
   *     }]
   *   )
   */
  updateRefundReasons(
    data: UpdateRefundReasonDTO[],
    sharedContext?: Context
  ): Promise<RefundReasonDTO[]>

  updateRefundReasons(
    data: UpdateRefundReasonDTO,
    sharedContext?: Context
  ): Promise<RefundReasonDTO>

  /**
   * This method retrieves a paginated list of refund reasons based on optional filters and configuration.
   *
   * @param {FilterableRefundReasonProps} filters - The filters to apply on the retrieved refund reason.
   * @param {FindConfig<RefundReasonDTO>} config - The configurations determining how the refund reason is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a refund reason.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RefundReasonDTO[]>} The list of refund reasons.
   *
   * @example
   * To retrieve a list of refund reasons using their IDs:
   *
   * ```ts
   * const refundReasons =
   *   await paymentModuleService.listRefundReasons({
   *     id: ["refr_123", "refr_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the refund :
   *
   * ```ts
   * const refundReasons =
   *   await paymentModuleService.listRefundReasons(
   *     {
   *       id: ["refr_123", "refr_321"],
   *     },
   *     {}
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const refundReasons =
   *   await paymentModuleService.listRefundReasons(
   *     {
   *       id: ["refr_123", "refr_321"],
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   *
   *
   */
  listRefundReasons(
    filters?: FilterableRefundReasonProps,
    config?: FindConfig<RefundReasonDTO>,
    sharedContext?: Context
  ): Promise<RefundReasonDTO[]>

  /* ********** HOOKS ********** */

  /**
   * This method handles a webhook event with the associated payment provider.
   *
   * Learn more about handling webhook events in [this guide](https://docs.medusajs.com/experimental/payment/webhook-events/)
   *
   * @param {ProviderWebhookPayload} data - The webhook event's details.
   * @returns {Promise<void>} Resolves when the webhook event is handled successfully.
   *
   * @example
   * In the following example, `req` is an instance of `MedusaRequest`:
   *
   * ```ts
   * await paymentModuleService.processEvent({
   *   provider: "stripe",
   *   payload: {
   *     data: req.body,
   *     rawData: req.rawBody,
   *     headers: req.headers,
   *   },
   * })
   * ```
   */
  processEvent(data: ProviderWebhookPayload): Promise<void>
}

/**
 * The options that the Payment Module accepts.
 */
export interface PaymentModuleOptions {
  /**
   * The delay in milliseconds before processing the webhook event.
   *
   * @defaultValue 5000
   */
  webhook_delay?: number

  /**
   * The number of times to retry the webhook event processing in case of an error.
   *
   * @defaultValue 3
   */
  webhook_retries?: number
}
