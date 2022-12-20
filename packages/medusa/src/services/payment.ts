import { PaymentRepository } from "./../repositories/payment"
import { EntityManager } from "typeorm"
import { isDefined, MedusaError } from "medusa-core-utils"

import { Payment, Refund } from "../models"
import { TransactionBaseService } from "../interfaces"
import { EventBusService, PaymentProviderService } from "./index"
import { buildQuery } from "../utils"
import { FindConfig } from "../types/common"

type InjectedDependencies = {
  manager: EntityManager
  paymentProviderService: PaymentProviderService
  eventBusService: EventBusService
  paymentRepository: typeof PaymentRepository
}

export type PaymentDataInput = {
  currency_code: string
  provider_id: string
  amount: number
  data: Record<string, unknown>
}

export default class PaymentService extends TransactionBaseService {
  protected readonly manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly eventBusService_: EventBusService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly paymentRepository_: typeof PaymentRepository
  static readonly Events = {
    CREATED: "payment.created",
    UPDATED: "payment.updated",
    PAYMENT_CAPTURED: "payment.payment_captured",
    PAYMENT_CAPTURE_FAILED: "payment.payment_capture_failed",
    REFUND_CREATED: "payment.payment_refund_created",
    REFUND_FAILED: "payment.payment_refund_failed",
  }

  constructor({
    manager,
    paymentRepository,
    paymentProviderService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.paymentRepository_ = paymentRepository
    this.paymentProviderService_ = paymentProviderService
    this.eventBusService_ = eventBusService
  }

  /**
   * Retrieves a payment by id.
   * @param paymentId - the id of the payment
   * @param config - the config to retrieve the payment
   * @return the payment.
   */
  async retrieve(
    paymentId: string,
    config: FindConfig<Payment> = {}
  ): Promise<Payment> {
    if (!isDefined(paymentId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"paymentId" must be defined`
      )
    }

    const manager = this.transactionManager_ ?? this.manager_
    const paymentRepository = manager.getCustomRepository(
      this.paymentRepository_
    )

    const query = buildQuery({ id: paymentId }, config)

    const payment = await paymentRepository.find(query)

    if (!payment.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment with id ${paymentId} was not found`
      )
    }

    return payment[0]
  }

  /**
   * Created a new payment.
   * @param paymentInput - info to create the payment
   * @return the payment created.
   */
  async create(paymentInput: PaymentDataInput): Promise<Payment> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const { data, currency_code, amount, provider_id } = paymentInput

      const paymentRepository = manager.getCustomRepository(
        this.paymentRepository_
      )

      const created = paymentRepository.create({
        provider_id,
        amount,
        currency_code,
        data,
      })

      const saved = await paymentRepository.save(created)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentService.Events.CREATED, saved)

      return saved
    })
  }

  /**
   * Updates a payment in order to link it to an order or a swap.
   * @param paymentId - the id of the payment
   * @param data - order_id or swap_id to link the payment
   * @return the payment updated.
   */
  async update(
    paymentId: string,
    data: { order_id?: string; swap_id?: string }
  ): Promise<Payment> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const payment = await this.retrieve(paymentId)

      const paymentRepository = manager.getCustomRepository(
        this.paymentRepository_
      )

      if (data?.order_id) {
        payment.order_id = data.order_id
      }

      if (data?.swap_id) {
        payment.swap_id = data.swap_id
      }

      const updated = await paymentRepository.save(payment)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentService.Events.UPDATED, updated)

      return updated
    })
  }

  /**
   * Captures a payment.
   * @param paymentOrId - the id or the class instance of the payment
   * @return the payment captured.
   */
  async capture(paymentOrId: string | Payment): Promise<Payment> {
    const payment =
      typeof paymentOrId === "string"
        ? await this.retrieve(paymentOrId)
        : paymentOrId

    if (payment?.captured_at) {
      return payment
    }

    return await this.atomicPhase_(async (manager: EntityManager) => {
      let captureError: Error | null = null
      const capturedPayment = await this.paymentProviderService_
        .withTransaction(manager)
        .capturePayment(payment)
        .catch((err) => {
          captureError = err
        })

      if (!capturedPayment) {
        await this.eventBusService_
          .withTransaction(manager)
          .emit(PaymentService.Events.PAYMENT_CAPTURE_FAILED, {
            ...payment,
            error: captureError,
          })

        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to capture Payment ${payment.id}`
        )
      }

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentService.Events.PAYMENT_CAPTURED, capturedPayment)

      return capturedPayment
    })
  }

  /**
   * refunds a payment.
   * @param paymentOrId - the id or the class instance of the payment
   * @param amount - the amount to be refunded from the payment
   * @param reason - the refund reason
   * @param note - additional note of the refund
   * @return the refund created.
   */
  async refund(
    paymentOrId: string | Payment,
    amount: number,
    reason: string,
    note?: string
  ): Promise<Refund> {
    const payment =
      typeof paymentOrId === "string"
        ? await this.retrieve(paymentOrId)
        : paymentOrId

    return await this.atomicPhase_(async (manager: EntityManager) => {
      if (!payment.captured_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Payment ${payment.id} is not captured`
        )
      }

      const refundable = payment.amount - payment.amount_refunded
      if (amount > refundable) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Only ${refundable} can be refunded from Payment ${payment.id}`
        )
      }

      let refundError: Error | null = null
      const refund = await this.paymentProviderService_
        .withTransaction(manager)
        .refundFromPayment(payment, amount, reason, note)
        .catch((err) => {
          refundError = err
        })

      if (!refund) {
        await this.eventBusService_
          .withTransaction(manager)
          .emit(PaymentService.Events.REFUND_FAILED, {
            ...payment,
            error: refundError,
          })

        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to refund Payment ${payment.id}`
        )
      }

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentService.Events.REFUND_CREATED, refund)

      return refund
    })
  }
}
