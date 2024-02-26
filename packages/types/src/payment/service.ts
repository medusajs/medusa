import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
} from "./mutations"
import {
  FilterablePaymentCollectionProps,
  PaymentCollectionDTO,
  PaymentDTO,
  PaymentSessionDTO,
} from "./common"
import { FindConfig } from "../common"

/**
 * The main service interface for the payment module.
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
   * {example-code}
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
   * {example-code}
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
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * {example-code}
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
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
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
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
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
   * This method updates existing payment collections.
   *
   * @param {UpdatePaymentCollectionDTO[]} data - The attributes to update in payment collections.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The updated payment collections.
   *
   * @example
   * {example-code}
   */
  updatePaymentCollections(
    data: UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /**
   * This method updates an existing payment collection.
   *
   * @param {UpdatePaymentCollectionDTO} data - The attributes to update in a payment collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The updated payment collection.
   *
   * @example
   * {example-code}
   */
  updatePaymentCollections(
    data: UpdatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method deletes a payment collection by its ID.
   *
   * @param {string[]} paymentCollectionId - The payment collection's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the payment collection is deleted.
   *
   * @example
   * {example-code}
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
   * @returns {Promise<void>} Resolves when the payment collection is deleted.
   *
   * @example
   * {example-code}
   */
  deletePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method completes a payment collection.
   *
   * @param {string} paymentCollectionId - The payment collection's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The payment collection's details.
   *
   * @example
   * {example-code}
   */
  completePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  /**
   * This method completes payment collections.
   *
   * @param {string[]} paymentCollectionId - The payment collections' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO[]>} The payment collections' details.
   *
   * @example
   * {example-code}
   */
  completePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /* ********** PAYMENT SESSION ********** */

  /**
   * This method creates a payment session for a payment collection.
   *
   * @param {string} paymentCollectionId - The ID of the payment collection to create the session for.
   * @param {CreatePaymentSessionDTO} data - The details of the payment session.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentCollectionDTO>} The payment collection's details.
   *
   * @example
   * {example-code}
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
   * {example-code}
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
   * @returns {Promise<void>} Resolves whent the payment session is deleted.
   *
   * @example
   * {example-code}
   */
  deletePaymentSession(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method authorizes a payment session.
   *
   * @param {string} id - The payment session's ID.
   * @param {Record<string, unknown>} context - The associated payment provider's context.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The details of the payment created from the authorized payment session.
   *
   * @example
   * {example-code}
   */
  authorizePaymentSession(
    id: string,
    context: Record<string, unknown>,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /* ********** PAYMENT ********** */

  /**
   * This method updates an existing payment.
   *
   * @param {UpdatePaymentDTO} data - The attributes to update in the payment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The updated payment.
   *
   * @example
   * {example-code}
   */
  updatePayment(
    data: UpdatePaymentDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method captures a payment.
   *
   * @param {CreateCaptureDTO} data - The payment capture to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The payment's details.
   *
   * @example
   * {example-code}
   */
  capturePayment(
    data: CreateCaptureDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method refunds a payment.
   *
   * @param {CreateRefundDTO} data - The refund to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The payment's details.
   *
   * @example
   * {example-code}
   */
  refundPayment(
    data: CreateRefundDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /**
   * This method cancels a payment
   *
   * @param {string} paymentId - The payment's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PaymentDTO>} The payment's details.
   *
   * @example
   * {example-code}
   */
  cancelPayment(paymentId: string, sharedContext?: Context): Promise<PaymentDTO>

  /**
   * This method creates providers on load.
   *
   * @example
   * {example-code}
   */
  createProvidersOnLoad(): Promise<void>
}
