import { MedusaError } from "medusa-core-utils"
import { BasePaymentService } from "medusa-interfaces"
import { AbstractPaymentService, TransactionBaseService } from "../interfaces"
import { EntityManager } from "typeorm"
import { PaymentSessionRepository } from "../repositories/payment-session"
import { PaymentRepository } from "../repositories/payment"
import { RefundRepository } from "../repositories/refund"
import { PaymentProviderRepository } from "../repositories/payment-provider"
import { buildQuery } from "../utils"
import { FindConfig, Selector } from "../types/common"
import {
  Cart,
  Payment,
  PaymentProvider,
  PaymentSession,
  PaymentSessionStatus,
  Refund,
} from "../models"

type PaymentProviderKey = `pp_${string}` | "systemPaymentProviderService"
type InjectedDependencies = {
  manager: EntityManager
  paymentSessionRepository: typeof PaymentSessionRepository
  paymentProviderRepository: typeof PaymentProviderRepository
  paymentRepository: typeof PaymentRepository
  refundRepository: typeof RefundRepository
} & {
  [key in `${PaymentProviderKey}`]:
    | AbstractPaymentService<never>
    | typeof BasePaymentService
}

/**
 * Helps retrieve payment providers
 */
export default class PaymentProviderService extends TransactionBaseService<PaymentProviderService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly container_: InjectedDependencies
  protected readonly paymentSessionRepository_: typeof PaymentSessionRepository
  protected readonly paymentProviderRepository_: typeof PaymentProviderRepository
  protected readonly paymentRepository_: typeof PaymentRepository
  protected readonly refundRepository_: typeof RefundRepository

  constructor(container: InjectedDependencies) {
    super(container)

    this.container_ = container
    this.manager_ = container.manager
    this.paymentSessionRepository_ = container.paymentSessionRepository
    this.paymentProviderRepository_ = container.paymentProviderRepository
    this.paymentRepository_ = container.paymentRepository
    this.refundRepository_ = container.refundRepository
  }

  async registerInstalledProviders(providerIds: string[]): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const model = transactionManager.getCustomRepository(
        this.paymentProviderRepository_
      )
      await model.update({}, { is_installed: false })

      await Promise.all(
        providerIds.map(async (providerId) => {
          const provider = model.create({
            id: providerId,
            is_installed: true,
          })
          return await model.save(provider)
        })
      )
    })
  }

  async list(): Promise<PaymentProvider[]> {
    const ppRepo = this.manager_.getCustomRepository(
      this.paymentProviderRepository_
    )
    return await ppRepo.find()
  }

  async retrievePayment(
    id: string,
    relations: string[] = []
  ): Promise<Payment | never> {
    const paymentRepo = this.manager_.getCustomRepository(
      this.paymentRepository_
    )
    const query = {
      where: { id },
      relations: [] as string[],
    }

    if (relations.length) {
      query.relations = relations
    }

    const payment = await paymentRepo.findOne(query)

    if (!payment) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment with ${id} was not found`
      )
    }

    return payment
  }

  async listPayments(
    selector: Selector<Payment>,
    config: FindConfig<Payment> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<Payment[]> {
    const payRepo = this.manager_.getCustomRepository(this.paymentRepository_)
    const query = buildQuery(selector, config)
    return await payRepo.find(query)
  }

  async retrieveSession(
    id: string,
    relations: string[] = []
  ): Promise<PaymentSession | never> {
    const sessionRepo = this.manager_.getCustomRepository(
      this.paymentSessionRepository_
    )

    const query = {
      where: { id },
      relations: [] as string[],
    }

    if (relations.length) {
      query.relations = relations
    }

    const session = await sessionRepo.findOne(query)

    if (!session) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment Session with ${id} was not found`
      )
    }

    return session
  }

  /**
   * Creates a payment session with the given provider.
   * @param providerId - the id of the provider to create payment with
   * @param cart - a cart object used to calculate the amount, etc. from
   * @return the payment session
   */
  async createSession(providerId: string, cart: Cart): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const provider = this.retrieveProvider(providerId)
      const sessionData = await provider
        .withTransaction(transactionManager)
        .createPayment(cart)

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )

      const toCreate = {
        cart_id: cart.id,
        provider_id: providerId,
        data: sessionData,
        status: "pending",
      }

      const created = sessionRepo.create(toCreate)
      return await sessionRepo.save(created)
    })
  }

  /**
   * Refreshes a payment session with the given provider.
   * This means, that we delete the current one and create a new.
   * @param paymentSession - the payment session object to
   *    update
   * @param cart - a cart object used to calculate the amount, etc. from
   * @return the payment session
   */
  async refreshSession(
    paymentSession: PaymentSession,
    cart: Cart
  ): Promise<PaymentSession> {
    return this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id)
      const provider = this.retrieveProvider(paymentSession.provider_id)
      await provider.withTransaction(transactionManager).deletePayment(session)

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )

      await sessionRepo.remove(session)

      const sessionData = await provider
        .withTransaction(transactionManager)
        .createPayment(cart)

      const toCreate = {
        cart_id: cart.id,
        provider_id: session.provider_id,
        data: sessionData,
        is_selected: true,
        status: "pending",
      }

      const created = sessionRepo.create(toCreate)
      return await sessionRepo.save(created)
    })
  }

  /**
   * Updates an existing payment session.
   * @param paymentSession - the payment session object to
   *    update
   * @param cart - the cart object to update for
   * @return the updated payment session
   */
  async updateSession(
    paymentSession: PaymentSession,
    cart: Cart
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id)
      const provider = this.retrieveProvider(paymentSession.provider_id)
      session.data = await provider
        .withTransaction(transactionManager)
        .updatePayment(paymentSession.data, cart)

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return sessionRepo.save(session)
    })
  }

  async deleteSession(
    paymentSession: PaymentSession
  ): Promise<PaymentSession | undefined> {
    return await this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id).catch(
        () => void 0
      )

      if (!session) {
        return
      }

      const provider = this.retrieveProvider(paymentSession.provider_id)
      await provider
        .withTransaction(transactionManager)
        .deletePayment(paymentSession)

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )

      return sessionRepo.remove(session)
    })
  }

  /**
   * Finds a provider given an id
   * @param {string} providerId - the id of the provider to get
   * @return {PaymentService} the payment provider
   */
  retrieveProvider<
    TProvider extends AbstractPaymentService<never> | typeof BasePaymentService
  >(
    providerId: string
  ): TProvider extends AbstractPaymentService<never>
    ? AbstractPaymentService<never>
    : typeof BasePaymentService {
    try {
      let provider
      if (providerId === "system") {
        provider = this.container_[`systemPaymentProviderService`]
      } else {
        provider = this.container_[`pp_${providerId}`]
      }

      return provider
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a payment provider with id: ${providerId}`
      )
    }
  }

  async createPayment(
    cart: Cart & { payment_session: PaymentSession }
  ): Promise<Payment> {
    return await this.atomicPhase_(async (transactionManager) => {
      const { payment_session: paymentSession, region, total } = cart

      const provider = this.retrieveProvider(paymentSession.provider_id)
      const paymentData = await provider
        .withTransaction(transactionManager)
        .getPaymentData(paymentSession)

      const paymentRepo = transactionManager.getCustomRepository(
        this.paymentRepository_
      )

      const created = paymentRepo.create({
        provider_id: paymentSession.provider_id,
        amount: total,
        currency_code: region.currency_code,
        data: paymentData,
        cart_id: cart.id,
      })

      return paymentRepo.save(created)
    })
  }

  async updatePayment(
    paymentId: string,
    data: { order_id?: string; swap_id?: string }
  ): Promise<Payment> {
    return await this.atomicPhase_(async (transactionManager) => {
      const payment = await this.retrievePayment(paymentId)

      if (data?.order_id) {
        payment.order_id = data.order_id
      }

      if (data?.swap_id) {
        payment.swap_id = data.swap_id
      }

      const payRepo = transactionManager.getCustomRepository(
        this.paymentRepository_
      )
      return payRepo.save(payment)
    })
  }

  async authorizePayment(
    paymentSession: PaymentSession,
    context: Record<string, unknown>
  ): Promise<PaymentSession | undefined> {
    return await this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id).catch(
        () => void 0
      )

      if (!session) {
        return
      }

      const provider = this.retrieveProvider(paymentSession.provider_id)
      const { status, data } = await provider
        .withTransaction(transactionManager)
        .authorizePayment(session, context)

      session.data = data
      session.status = status

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return sessionRepo.save(session)
    })
  }

  async updateSessionData(
    paymentSession: PaymentSession,
    data: Record<string, unknown>
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id)

      const provider = this.retrieveProvider(paymentSession.provider_id)

      session.data = await provider
        .withTransaction(transactionManager)
        .updatePaymentData(paymentSession.data, data)
      session.status = paymentSession.status

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return sessionRepo.save(session)
    })
  }

  async cancelPayment(
    paymentObj: Partial<Payment> & { id: string }
  ): Promise<Payment> {
    return await this.atomicPhase_(async (transactionManager) => {
      const payment = await this.retrievePayment(paymentObj.id)
      const provider = this.retrieveProvider(payment.provider_id)
      payment.data = await provider
        .withTransaction(transactionManager)
        .cancelPayment(payment)

      const now = new Date()
      payment.canceled_at = now.toISOString()

      const paymentRepo = transactionManager.getCustomRepository(
        this.paymentRepository_
      )
      return await paymentRepo.save(payment)
    })
  }

  async getStatus(
    paymentSession: PaymentSession
  ): Promise<PaymentSessionStatus> {
    const provider = this.retrieveProvider(paymentSession.provider_id)
    return await provider
      .withTransaction(this.manager_)
      .getStatus(paymentSession.data)
  }

  async capturePayment(
    paymentObj: Partial<Payment> & { id: string }
  ): Promise<Payment> {
    return await this.atomicPhase_(async (transactionManager) => {
      const payment = await this.retrievePayment(paymentObj.id)
      const provider = this.retrieveProvider(payment.provider_id)
      payment.data = await provider
        .withTransaction(transactionManager)
        .capturePayment(payment)

      const now = new Date()
      payment.captured_at = now.toISOString()

      const paymentRepo = transactionManager.getCustomRepository(
        this.paymentRepository_
      )
      return paymentRepo.save(payment)
    })
  }

  async refundPayment(
    payObjs: Payment[],
    amount: number,
    reason: string,
    note?: string
  ): Promise<Refund> {
    return await this.atomicPhase_(async (transactionManager) => {
      const payments = await this.listPayments({
        id: payObjs.map((p) => p.id),
      })

      let order_id!: string
      const refundable = payments.reduce((acc, next) => {
        order_id = next.order_id
        if (next.captured_at) {
          return (acc += next.amount - next.amount_refunded)
        }

        return acc
      }, 0)

      if (refundable < amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Refund amount is higher that the refundable amount"
        )
      }

      let balance = amount

      const used: string[] = []

      const paymentRepo = transactionManager.getCustomRepository(
        this.paymentRepository_
      )
      let paymentToRefund = payments.find(
        (payment) => payment.amount - payment.amount_refunded > 0
      )

      while (paymentToRefund) {
        const currentRefundable =
          paymentToRefund.amount - paymentToRefund.amount_refunded

        const refundAmount = Math.min(currentRefundable, balance)

        const provider = this.retrieveProvider(paymentToRefund.provider_id)
        paymentToRefund.data = await provider
          .withTransaction(transactionManager)
          .refundPayment(paymentToRefund, refundAmount)

        paymentToRefund.amount_refunded += refundAmount
        await paymentRepo.save(paymentToRefund)

        balance -= refundAmount

        used.push(paymentToRefund.id)

        if (balance > 0) {
          paymentToRefund = payments.find(
            (payment) =>
              payment.amount - payment.amount_refunded > 0 &&
              !used.includes(payment.id)
          )
        } else {
          paymentToRefund = undefined
        }
      }

      const refundRepo = transactionManager.getCustomRepository(
        this.refundRepository_
      )

      const toCreate = {
        order_id,
        amount,
        reason,
        note,
      }

      const created = refundRepo.create(toCreate)
      return refundRepo.save(created)
    })
  }

  async retrieveRefund(
    id: string,
    config: FindConfig<Refund> = {}
  ): Promise<Refund | never> {
    const refRepo = this.manager_.getCustomRepository(this.refundRepository_)
    const query = buildQuery({ id }, config)
    const refund = await refRepo.findOne(query)

    if (!refund) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `A refund with ${id} was not found`
      )
    }

    return refund
  }
}
