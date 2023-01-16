import { isDefined, MedusaError } from "medusa-core-utils"
import { BasePaymentService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import {
  AbstractPaymentService,
  PaymentContext,
  PaymentSessionResponse,
  TransactionBaseService,
} from "../interfaces"
import {
  Cart,
  Payment,
  PaymentProvider,
  PaymentSession,
  PaymentSessionStatus,
  Refund,
} from "../models"
import { PaymentRepository } from "../repositories/payment"
import { PaymentProviderRepository } from "../repositories/payment-provider"
import { PaymentSessionRepository } from "../repositories/payment-session"
import { RefundRepository } from "../repositories/refund"
import { FindConfig, Selector } from "../types/common"
import { Logger } from "../types/global"
import { CreatePaymentInput, PaymentSessionInput } from "../types/payment"
import { buildQuery, isString } from "../utils"
import { FlagRouter } from "../utils/flag-router"
import { CustomerService } from "./index"
import PaymentService from "./payment"

type PaymentProviderKey = `pp_${string}` | "systemPaymentProviderService"
type InjectedDependencies = {
  manager: EntityManager
  paymentSessionRepository: typeof PaymentSessionRepository
  paymentProviderRepository: typeof PaymentProviderRepository
  paymentRepository: typeof PaymentRepository
  refundRepository: typeof RefundRepository
  paymentService: PaymentService
  customerService: CustomerService
  featureFlagRouter: FlagRouter
  logger: Logger
} & {
  [key in `${PaymentProviderKey}`]:
    | AbstractPaymentService
    | typeof BasePaymentService
}

/**
 * Helps retrieve payment providers
 */
export default class PaymentProviderService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly container_: InjectedDependencies
  protected readonly paymentSessionRepository_: typeof PaymentSessionRepository
  // eslint-disable-next-line max-len
  protected readonly paymentProviderRepository_: typeof PaymentProviderRepository
  protected readonly paymentRepository_: typeof PaymentRepository
  protected readonly refundRepository_: typeof RefundRepository
  protected readonly customerService_: CustomerService
  protected readonly logger_: Logger

  protected readonly featureFlagRouter_: FlagRouter

  constructor(container: InjectedDependencies) {
    super(container)

    this.container_ = container
    this.manager_ = container.manager
    this.paymentSessionRepository_ = container.paymentSessionRepository
    this.paymentProviderRepository_ = container.paymentProviderRepository
    this.paymentRepository_ = container.paymentRepository
    this.refundRepository_ = container.refundRepository
    this.customerService_ = container.customerService
    this.featureFlagRouter_ = container.featureFlagRouter
    this.logger_ = container.logger
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
   * @param providerIdOrSessionInput - the id of the provider to create payment with or the input data
   * @param cart - a cart object used to calculate the amount, etc. from
   * @return the payment session
   */
  async createSession<
    TInput extends string | PaymentSessionInput = string | PaymentSessionInput
  >(
    providerIdOrSessionInput: TInput,
    ...[cart]: TInput extends string ? [Cart] : [never?]
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const providerId = isString(providerIdOrSessionInput)
        ? providerIdOrSessionInput
        : providerIdOrSessionInput.provider_id
      const data = (
        isString(providerIdOrSessionInput) ? cart : providerIdOrSessionInput
      ) as Cart | PaymentSessionInput

      const provider = this.retrieveProvider<AbstractPaymentService>(providerId)
      const context = this.buildPaymentProcessorContext(data)

      if (!isDefined(context.currency_code) || !isDefined(context.amount)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "`currency_code` and `amount` are required to create payment session."
        )
      }

      const paymentResponse = await provider
        .withTransaction(transactionManager)
        .createPayment(context)

      const sessionData = paymentResponse.session_data ?? paymentResponse

      await this.processUpdateRequestsData(
        {
          customer: { id: context.customer?.id },
        },
        paymentResponse
      )

      return await this.saveSession(providerId, {
        payment_session_id: !isString(providerIdOrSessionInput)
          ? providerIdOrSessionInput.payment_session_id
          : undefined,
        cartId: context.id,
        sessionData,
        status: PaymentSessionStatus.PENDING,
        isInitiated: true,
        amount: context.amount,
      })
    })
  }

  /**
   * Refreshes a payment session with the given provider.
   * This means, that we delete the current one and create a new.
   * @param paymentSession - the payment session object to
   *    update
   * @param sessionInput
   * @return the payment session
   */
  async refreshSession(
    paymentSession: {
      id: string
      data: Record<string, unknown>
      provider_id: string
    },
    sessionInput: PaymentSessionInput
  ): Promise<PaymentSession> {
    return this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id)
      const provider = this.retrieveProvider<AbstractPaymentService>(
        paymentSession.provider_id
      )
      await provider.withTransaction(transactionManager).deletePayment(session)

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )

      await sessionRepo.remove(session)
      return await this.createSession(sessionInput)
    })
  }

  /**
   * Update a payment session with the given provider.
   * @param paymentSession - The paymentSession to update
   * @param sessionInput
   * @return the payment session
   */
  async updateSession(
    paymentSession: {
      id: string
      data: Record<string, unknown>
      provider_id: string
    },
    sessionInput: Cart | PaymentSessionInput
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const provider = this.retrieveProvider(paymentSession.provider_id)

      const context = this.buildPaymentProcessorContext(sessionInput)

      const paymentResponse = await provider
        .withTransaction(transactionManager)
        .updatePayment(paymentSession.data, context)

      const sessionData = paymentResponse.session_data ?? paymentResponse

      await this.processUpdateRequestsData(
        {
          customer: { id: context.customer?.id },
        },
        paymentResponse
      )

      return await this.saveSession(paymentSession.provider_id, {
        payment_session_id: paymentSession.id,
        sessionData,
        isInitiated: true,
        amount: context.amount,
      })
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

      return await sessionRepo.remove(session)
    })
  }

  /**
   * Finds a provider given an id
   * @param {string} providerId - the id of the provider to get
   * @return {PaymentService} the payment provider
   */
  retrieveProvider<
    TProvider extends AbstractPaymentService | typeof BasePaymentService
  >(
    providerId: string
  ): TProvider extends AbstractPaymentService
    ? AbstractPaymentService
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

  async createPayment(data: CreatePaymentInput): Promise<Payment> {
    return await this.atomicPhase_(async (transactionManager) => {
      const { payment_session, currency_code, amount, provider_id } = data
      const providerId = provider_id ?? payment_session.provider_id

      const provider = this.retrieveProvider<AbstractPaymentService>(providerId)
      const paymentData = await provider
        .withTransaction(transactionManager)
        .getPaymentData(payment_session)

      const paymentRepo = transactionManager.getCustomRepository(
        this.paymentRepository_
      )

      const created = paymentRepo.create({
        provider_id: providerId,
        amount,
        currency_code,
        data: paymentData,
        cart_id: data.cart_id,
      })

      return await paymentRepo.save(created)
    })
  }

  async updatePayment(
    paymentId: string,
    data: { order_id?: string; swap_id?: string }
  ): Promise<Payment> {
    return await this.atomicPhase_(async (transactionManager) => {
      const paymentService = this.container_.paymentService
      return await paymentService
        .withTransaction(transactionManager)
        .update(paymentId, data)
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

      if (status === PaymentSessionStatus.AUTHORIZED) {
        session.payment_authorized_at = new Date()
      }

      const sessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return await sessionRepo.save(session)
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
      return await sessionRepo.save(session)
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

  async getStatus(payment: Payment): Promise<PaymentSessionStatus> {
    const provider = this.retrieveProvider(payment.provider_id)
    return await provider.withTransaction(this.manager_).getStatus(payment.data)
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
      return await paymentRepo.save(payment)
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
          "Refund amount is greater that the refundable amount"
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
      return await refundRepo.save(created)
    })
  }

  async refundFromPayment(
    payment: Payment,
    amount: number,
    reason: string,
    note?: string
  ): Promise<Refund> {
    return await this.atomicPhase_(async (manager) => {
      const refundable = payment.amount - payment.amount_refunded

      if (refundable < amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Refund amount is greater that the refundable amount"
        )
      }

      const provider = this.retrieveProvider(payment.provider_id)
      payment.data = await provider
        .withTransaction(manager)
        .refundPayment(payment, amount)

      payment.amount_refunded += amount

      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)
      await paymentRepo.save(payment)

      const refundRepo = manager.getCustomRepository(this.refundRepository_)

      const toCreate = {
        payment_id: payment.id,
        amount,
        reason,
        note,
      }

      const created = refundRepo.create(toCreate)
      return await refundRepo.save(created)
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

  /**
   * Build the create session context for both legacy and new API
   * @param cartOrData
   * @protected
   */
  protected buildPaymentProcessorContext(
    cartOrData: Cart | PaymentSessionInput
  ): Cart & PaymentContext {
    const cart =
      "object" in cartOrData && cartOrData.object === "cart"
        ? cartOrData
        : ((cartOrData as PaymentSessionInput).cart as Cart)

    const context = {} as Cart & PaymentContext

    // TODO: only to support legacy API. Once we are ready to break the API, the cartOrData will only support PaymentSessionInput
    if ("object" in cartOrData && cartOrData.object === "cart") {
      context.cart = {
        context: cart.context,
        shipping_address: cart.shipping_address,
        id: cart.id,
        email: cart.email,
        shipping_methods: cart.shipping_methods,
      }
      context.amount = cart.total!
      context.currency_code = cart.region?.currency_code
      Object.assign(context, cart)
    } else {
      const data = cartOrData as PaymentSessionInput
      context.cart = data.cart
      context.amount = data.amount
      context.currency_code = data.currency_code
      context.resource_id = data.resource_id
      Object.assign(context, cart)
    }

    return context
  }

  /**
   * Create or update a Payment session data.
   * @param providerId
   * @param data
   * @protected
   */
  protected async saveSession(
    providerId: string,
    data: {
      payment_session_id?: string
      cartId?: string
      amount?: number
      sessionData: Record<string, unknown>
      isSelected?: boolean
      isInitiated?: boolean
      status?: PaymentSessionStatus
    }
  ): Promise<PaymentSession> {
    const manager = this.transactionManager_ ?? this.manager_

    const sessionRepo = manager.getCustomRepository(
      this.paymentSessionRepository_
    )

    // Update an existing session
    if (data.payment_session_id) {
      const session = await this.retrieveSession(data.payment_session_id)
      session.data = data.sessionData ?? session.data
      session.status = data.status ?? session.status
      session.amount = data.amount ?? session.amount
      session.is_initiated = data.isInitiated ?? session.is_initiated
      session.is_selected = data.isSelected ?? session.is_selected
      return await sessionRepo.save(session)
    }

    // Create a new session
    const toCreate: Partial<PaymentSession> = {
      cart_id: data.cartId || null,
      provider_id: providerId,
      data: data.sessionData,
      is_selected: data.isSelected,
      is_initiated: data.isInitiated,
      status: data.status,
      amount: data.amount,
    }

    const created = sessionRepo.create(toCreate)
    return await sessionRepo.save(created)
  }

  /**
   * Process the collected data. Can be used every time we need to process some collected data returned by the provider
   * @param data
   * @param paymentResponse
   * @protected
   */
  protected async processUpdateRequestsData(
    data: { customer?: { id?: string } } = {},
    paymentResponse: PaymentSessionResponse | Record<string, unknown>
  ): Promise<void> {
    const { update_requests } = paymentResponse as PaymentSessionResponse

    if (!update_requests) {
      return
    }

    const manager = this.transactionManager_ ?? this.manager_

    if (update_requests.customer_metadata && data.customer?.id) {
      await this.customerService_
        .withTransaction(manager)
        .update(data.customer.id, {
          metadata: update_requests.customer_metadata,
        })
    }
  }
}
