import { DeepPartial, EntityManager, Equal } from "typeorm"
import { MedusaError } from "medusa-core-utils"

import { FindConfig } from "../types/common"
import { buildQuery, isDefined, setMetadata } from "../utils"
import { PaymentCollectionRepository } from "../repositories/payment-collection"
import {
  Customer,
  Payment,
  PaymentCollection,
  PaymentCollectionStatus,
  PaymentSession,
  PaymentSessionStatus,
  Refund,
} from "../models"
import { TransactionBaseService } from "../interfaces"
import {
  CustomerService,
  EventBusService,
  PaymentProviderService,
} from "./index"

import {
  CreatePaymentCollectionInput,
  PaymentCollectionSessionInput,
  PaymentProviderDataInput,
} from "../types/payment-collection"

type InjectedDependencies = {
  manager: EntityManager
  paymentCollectionRepository: typeof PaymentCollectionRepository
  paymentProviderService: PaymentProviderService
  eventBusService: EventBusService
  customerService: CustomerService
}

export default class PaymentCollectionService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "payment-collection.created",
    UPDATED: "payment-collection.updated",
    DELETED: "payment-collection.deleted",
    PAYMENT_AUTHORIZED: "payment-collection.payment_authorized",
    PAYMENT_CAPTURED: "payment-collection.payment_captured",
    PAYMENT_CAPTURE_FAILED: "payment-collection.payment_capture_failed",
    REFUND_CREATED: "payment-collection.payment_refund_created",
    REFUND_FAILED: "payment-collection.payment_refund_failed",
  }

  protected readonly manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly eventBusService_: EventBusService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly customerService_: CustomerService
  // eslint-disable-next-line max-len
  protected readonly paymentCollectionRepository_: typeof PaymentCollectionRepository

  constructor({
    manager,
    paymentCollectionRepository,
    paymentProviderService,
    customerService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.paymentCollectionRepository_ = paymentCollectionRepository
    this.paymentProviderService_ = paymentProviderService
    this.eventBusService_ = eventBusService
    this.customerService_ = customerService
  }

  async retrieve(
    paymentCollectionId: string,
    config: FindConfig<PaymentCollection> = {}
  ): Promise<PaymentCollection> {
    const manager = this.transactionManager_ ?? this.manager_
    const paymentCollectionRepository = manager.getCustomRepository(
      this.paymentCollectionRepository_
    )

    const query = buildQuery({ id: paymentCollectionId }, config)

    const paymentCollection = await paymentCollectionRepository.find(query)

    if (!paymentCollection.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment collection with id ${paymentCollectionId} was not found`
      )
    }

    return paymentCollection[0]
  }

  async create(data: CreatePaymentCollectionInput): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepository = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      const paymentCollectionToCreate = paymentCollectionRepository.create({
        region_id: data.region_id,
        type: data.type,
        status: PaymentCollectionStatus.NOT_PAID,
        currency_code: data.currency_code,
        amount: data.amount,
        metadata: data.metadata,
        created_by: data.created_by,
        description: data.description,
      })

      const paymentCollection = await paymentCollectionRepository.save(
        paymentCollectionToCreate
      )

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentCollectionService.Events.CREATED, paymentCollection)

      return paymentCollection
    })
  }

  async update(
    paymentCollectionId: string,
    data: DeepPartial<PaymentCollection>
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepo = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      const paymentCollection = await this.retrieve(paymentCollectionId)

      for (const key of Object.keys(data)) {
        if (key === "metadata" && data.metadata) {
          paymentCollection[key] = setMetadata(paymentCollection, data.metadata)
        } else if (isDefined(data[key])) {
          paymentCollection[key] = data[key]
        }
      }

      const result = await paymentCollectionRepo.save(paymentCollection)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentCollectionService.Events.UPDATED, result)

      return result
    })
  }

  async delete(
    paymentCollectionId: string
  ): Promise<PaymentCollection | undefined> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepo = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      const paymentCollection = await this.retrieve(paymentCollectionId).catch(
        () => void 0
      )

      if (!paymentCollection) {
        return
      }

      if (
        [
          PaymentCollectionStatus.CANCELED,
          PaymentCollectionStatus.NOT_PAID,
        ].includes(paymentCollection.status) === false
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot delete payment collection with status ${paymentCollection.status}`
        )
      }

      await paymentCollectionRepo.remove(paymentCollection)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentCollectionService.Events.DELETED, paymentCollection)

      return paymentCollection
    })
  }

  private isValidTotalAmount(
    total: number,
    sessionsInput: PaymentCollectionSessionInput[]
  ): boolean {
    const sum = sessionsInput.reduce((cur, sess) => cur + sess.amount, 0)
    return total === sum
  }

  async setPaymentSessions(
    paymentCollectionId: string,
    sessions: PaymentCollectionSessionInput[] | PaymentCollectionSessionInput
  ): Promise<PaymentCollection> {
    let sessionsInput = Array.isArray(sessions) ? sessions : [sessions]

    return await this.atomicPhase_(async (manager: EntityManager) => {
      const paymentCollectionRepository = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      const payCol = await this.retrieve(paymentCollectionId, {
        relations: ["region", "region.payment_providers", "payment_sessions"],
      })

      if (payCol.status !== PaymentCollectionStatus.NOT_PAID) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot set payment sessions for a payment collection with status ${payCol.status}`
        )
      }

      sessionsInput = sessionsInput.filter((session) => {
        return !!payCol.region.payment_providers.find(({ id }) => {
          return id === session.provider_id
        })
      })

      if (!this.isValidTotalAmount(payCol.amount, sessionsInput)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `The sum of sessions is not equal to ${payCol.amount} on Payment Collection`
        )
      }

      let customer: Customer | undefined = undefined

      const selectedSessionIds: string[] = []
      const paymentSessions: PaymentSession[] = []

      for (const session of sessionsInput) {
        if (!customer) {
          customer = await this.customerService_
            .withTransaction(manager)
            .retrieve(session.customer_id, {
              select: ["id", "email", "metadata"],
            })
        }

        const existingSession = payCol.payment_sessions?.find(
          (sess) => session.session_id === sess?.id
        )

        const inputData: PaymentProviderDataInput = {
          resource_id: payCol.id,
          currency_code: payCol.currency_code,
          amount: session.amount,
          provider_id: session.provider_id,
          customer,
          metadata: {
            resource_id: payCol.id,
          },
        }

        if (existingSession) {
          const paymentSession = await this.paymentProviderService_
            .withTransaction(manager)
            .updateSessionNew(existingSession, inputData)

          selectedSessionIds.push(existingSession.id)
          paymentSessions.push(paymentSession)
        } else {
          const paymentSession = await this.paymentProviderService_
            .withTransaction(manager)
            .createSessionNew(inputData)

          selectedSessionIds.push(paymentSession.id)
          paymentSessions.push(paymentSession)
        }
      }

      if (payCol.payment_sessions?.length) {
        const removeIds: string[] = payCol.payment_sessions
          .map((sess) => sess.id)
          .filter((id) => !selectedSessionIds.includes(id))

        if (removeIds.length) {
          await paymentCollectionRepository.deleteMultiple(removeIds)
        }
      }

      payCol.payment_sessions = paymentSessions

      return await paymentCollectionRepository.save(payCol)
    })
  }

  async refreshPaymentSession(
    paymentCollectionId: string,
    sessionId: string,
    sessionInput: PaymentCollectionSessionInput
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const paymentCollectionRepository = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      const payCol =
        await paymentCollectionRepository.getPaymentCollectionIdBySessionId(
          sessionId,
          {
            relations: [
              "region",
              "region.payment_providers",
              "payment_sessions",
            ],
          }
        )

      if (paymentCollectionId !== payCol.id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Payment Session ${sessionId} does not belong to Payment Collection ${paymentCollectionId}`
        )
      }

      const session = payCol.payment_sessions.find(
        (sess) => sessionId === sess?.id
      )

      if (session?.amount !== sessionInput.amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "The amount has to be the same as the existing payment session"
        )
      }

      const customer = await this.customerService_
        .withTransaction(manager)
        .retrieve(sessionInput.customer_id, {
          select: ["id", "email", "metadata"],
        })

      const inputData: PaymentProviderDataInput = {
        resource_id: payCol.id,
        currency_code: payCol.currency_code,
        amount: session.amount,
        provider_id: session.provider_id,
        customer,
      }

      const sessionRefreshed = await this.paymentProviderService_
        .withTransaction(manager)
        .refreshSessionNew(session, inputData)

      payCol.payment_sessions = payCol.payment_sessions.map((sess) => {
        if (sess.id === sessionId) {
          return sessionRefreshed
        }
        return sess
      })

      if (session.payment_authorized_at) {
        payCol.authorized_amount -= session.amount
      }

      await paymentCollectionRepository.save(payCol)

      return sessionRefreshed
    })
  }

  async authorize(
    paymentCollectionId: string,
    context: Record<string, unknown> = {}
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const paymentCollectionRepository = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      const payCol = await this.retrieve(paymentCollectionId, {
        relations: ["payment_sessions", "payments"],
      })

      if (payCol.authorized_amount === payCol.amount) {
        return payCol
      }

      // If cart total is 0, we don't perform anything payment related
      if (payCol.amount <= 0) {
        payCol.authorized_amount = 0
        return await paymentCollectionRepository.save(payCol)
      }

      if (!payCol.payment_sessions?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You cannot complete a Payment Collection without a payment session."
        )
      }

      let authorizedAmount = 0
      for (const session of payCol.payment_sessions) {
        if (session.payment_authorized_at) {
          authorizedAmount += session.amount
          continue
        }

        const auth = await this.paymentProviderService_
          .withTransaction(manager)
          .authorizePayment(session, context)

        if (auth?.status === PaymentSessionStatus.AUTHORIZED) {
          authorizedAmount += session.amount

          const inputData: Omit<PaymentProviderDataInput, "customer"> = {
            amount: session.amount,
            currency_code: payCol.currency_code,
            provider_id: session.provider_id,
            resource_id: payCol.id,
          }

          payCol.payments.push(
            await this.paymentProviderService_
              .withTransaction(manager)
              .createPaymentNew(inputData)
          )
        }
      }

      if (authorizedAmount === 0) {
        payCol.status = PaymentCollectionStatus.AWAITING
      } else if (authorizedAmount < payCol.amount) {
        payCol.status = PaymentCollectionStatus.PARTIALLY_AUTHORIZED
      } else if (authorizedAmount === payCol.amount) {
        payCol.status = PaymentCollectionStatus.AUTHORIZED
      }

      payCol.authorized_amount = authorizedAmount
      const payColCopy = await paymentCollectionRepository.save(payCol)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentCollectionService.Events.PAYMENT_AUTHORIZED, payColCopy)

      return payCol
    })
  }

  private async capturePayment(
    payCol: PaymentCollection,
    payment: Payment
  ): Promise<Payment> {
    if (payment?.captured_at) {
      return payment
    }

    return await this.atomicPhase_(async (manager: EntityManager) => {
      const allowedStatuses = [
        PaymentCollectionStatus.AUTHORIZED,
        PaymentCollectionStatus.PARTIALLY_CAPTURED,
        PaymentCollectionStatus.REQUIRES_ACTION,
      ]

      if (!allowedStatuses.includes(payCol.status)) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `A Payment Collection with status ${payCol.status} cannot capture payment`
        )
      }

      let captureError: Error | null = null
      const capturedPayment = await this.paymentProviderService_
        .withTransaction(manager)
        .capturePayment(payment)
        .catch((err) => {
          captureError = err
        })

      payCol.captured_amount = payCol.captured_amount ?? 0
      if (capturedPayment) {
        payCol.captured_amount += payment.amount
      }

      if (payCol.captured_amount === 0) {
        payCol.status = PaymentCollectionStatus.REQUIRES_ACTION
      } else if (payCol.captured_amount === payCol.amount) {
        payCol.status = PaymentCollectionStatus.CAPTURED
      } else {
        payCol.status = PaymentCollectionStatus.PARTIALLY_CAPTURED
      }

      const paymentCollectionRepository = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      await paymentCollectionRepository.save(payCol)

      if (!capturedPayment) {
        await this.eventBusService_
          .withTransaction(manager)
          .emit(PaymentCollectionService.Events.PAYMENT_CAPTURE_FAILED, {
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
        .emit(PaymentCollectionService.Events.PAYMENT_CAPTURED, capturedPayment)

      return capturedPayment
    })
  }

  async capture(paymentId: string): Promise<Payment> {
    const manager = this.transactionManager_ ?? this.manager_
    const paymentCollectionRepository = manager.getCustomRepository(
      this.paymentCollectionRepository_
    )

    const payCol =
      await paymentCollectionRepository.getPaymentCollectionIdByPaymentId(
        paymentId,
        {
          relations: ["payments"],
        }
      )

    const payment = payCol.payments.find((payment) => paymentId === payment?.id)

    return await this.capturePayment(payCol, payment!)
  }

  async captureAll(paymentCollectionId: string): Promise<Payment[]> {
    const payCol = await this.retrieve(paymentCollectionId, {
      relations: ["payments"],
    })

    const allPayments: Payment[] = []
    for (const payment of payCol.payments) {
      const captured = await this.capturePayment(payCol, payment).catch(
        () => void 0
      )

      if (captured) {
        allPayments.push(captured)
      }
    }

    return allPayments
  }

  private async refundPayment(
    payCol: PaymentCollection,
    payment: Payment,
    amount: number,
    reason: string,
    note?: string
  ): Promise<Refund> {
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

      payCol.refunded_amount = payCol.refunded_amount ?? 0
      if (refund) {
        payCol.refunded_amount += refund.amount
      }

      if (payCol.refunded_amount === 0) {
        payCol.status = PaymentCollectionStatus.REQUIRES_ACTION
      } else if (payCol.refunded_amount === payCol.amount) {
        payCol.status = PaymentCollectionStatus.REFUNDED
      } else {
        payCol.status = PaymentCollectionStatus.PARTIALLY_REFUNDED
      }

      const paymentCollectionRepository = manager.getCustomRepository(
        this.paymentCollectionRepository_
      )

      await paymentCollectionRepository.save(payCol)

      if (!refund) {
        await this.eventBusService_
          .withTransaction(manager)
          .emit(PaymentCollectionService.Events.REFUND_FAILED, {
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
        .emit(PaymentCollectionService.Events.REFUND_CREATED, refund)

      return refund
    })
  }

  async refund(
    paymentId: string,
    amount: number,
    reason: string,
    note?: string
  ): Promise<Refund> {
    const manager = this.transactionManager_ ?? this.manager_
    const paymentCollectionRepository = manager.getCustomRepository(
      this.paymentCollectionRepository_
    )

    const payCol =
      await paymentCollectionRepository.getPaymentCollectionIdByPaymentId(
        paymentId
      )

    const payment = await this.paymentProviderService_.retrievePayment(
      paymentId
    )

    return await this.refundPayment(payCol, payment, amount, reason, note)
  }

  async refundAll(
    paymentCollectionId: string,
    reason: string,
    note?: string
  ): Promise<Refund[]> {
    const payCol = await this.retrieve(paymentCollectionId, {
      relations: ["payments"],
    })

    const allRefunds: Refund[] = []
    for (const payment of payCol.payments) {
      const refunded = await this.refundPayment(
        payCol,
        payment,
        payment.amount,
        reason,
        note
      ).catch(() => void 0)

      if (refunded) {
        allRefunds.push(refunded)
      }
    }

    return allRefunds
  }
}
