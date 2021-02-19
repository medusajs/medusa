import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * Helps retrive payment providers
 */
class PaymentProviderService extends BaseService {
  constructor(container) {
    super()

    /** @private {logger} */
    this.container_ = container

    this.manager_ = container.manager

    this.paymentSessionRepository_ = container.paymentSessionRepository

    this.paymentRepository_ = container.paymentRepository

    this.refundRepository_ = container.refundRepository
  }

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new PaymentProviderService(this.container_)
    cloned.transactionManager_ = manager
    cloned.manager_ = manager

    return cloned
  }

  async registerInstalledProviders(providers) {
    const { manager, paymentProviderRepository } = this.container_
    const model = manager.getCustomRepository(paymentProviderRepository)
    model.update({}, { is_installed: false })
    for (const p of providers) {
      const n = model.create({ id: p, is_installed: true })
      await model.save(n)
    }
  }

  async list() {
    const { manager, paymentProviderRepository } = this.container_
    const ppRepo = manager.getCustomRepository(paymentProviderRepository)

    return ppRepo.find({})
  }

  async retrievePayment(id, relations = []) {
    const paymentRepo = this.manager_.getCustomRepository(
      this.paymentRepository_
    )
    const validatedId = this.validateId_(id)

    const query = {
      where: { id: validatedId },
    }

    if (relations.length) {
      query.relations = options.relations
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

  listPayments(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const payRepo = this.manager_.getCustomRepository(this.paymentRepository_)
    const query = this.buildQuery_(selector, config)
    return payRepo.find(query)
  }

  async retrieveSession(id, relations = []) {
    const sessionRepo = this.manager_.getCustomRepository(
      this.paymentSessionRepository_
    )
    const validatedId = this.validateId_(id)

    const query = {
      where: { id: validatedId },
    }

    if (relations.length) {
      query.relations = options.relations
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
   * @param {string} providerId - the id of the provider to create payment with
   * @param {Cart} cart - a cart object used to calculate the amount, etc. from
   * @return {Promise} the payment session
   */
  async createSession(providerId, cart) {
    return this.atomicPhase_(async manager => {
      const provider = this.retrieveProvider(providerId)
      const sessionData = await provider.createPayment(cart)

      const sessionRepo = manager.getCustomRepository(
        this.paymentSessionRepository_
      )

      const toCreate = {
        cart_id: cart.id,
        provider_id: providerId,
        data: sessionData,
        status: "pending",
      }

      const created = sessionRepo.create(toCreate)
      const result = await sessionRepo.save(created)

      return result
    })
  }

  /**
   * Refreshes a payment session with the given provider.
   * This means, that we delete the current one and create a new.
   * @param {string} providerId - the id of the provider to refresh payment for
   * @param {Cart} cart - a cart object used to calculate the amount, etc. from
   * @return {Promise} the payment session
   */
  async refreshSession(paymentSession, cart) {
    return this.atomicPhase_(async manager => {
      const session = await this.retrieveSession(paymentSession.id)

      const provider = this.retrieveProvider(paymentSession.provider_id)
      await provider.deletePayment(session)

      const sessionRepo = manager.getCustomRepository(
        this.paymentSessionRepository_
      )

      await sessionRepo.remove(session)

      const sessionData = await provider.createPayment(cart)
      const toCreate = {
        cart_id: cart.id,
        provider_id: session.provider_id,
        data: sessionData,
        is_selected: true,
        status: "pending",
      }

      const created = sessionRepo.create(toCreate)
      const result = await sessionRepo.save(created)

      return result
    })
  }

  /**
   * Updates an existing payment session.
   * @param {PaymentSession} paymentSession - the payment session object to
   *    update
   * @param {Cart} cart - the cart object to update for
   * @return {Promise} the updated payment session
   */
  updateSession(paymentSession, cart) {
    return this.atomicPhase_(async manager => {
      const session = await this.retrieveSession(paymentSession.id)

      const provider = this.retrieveProvider(paymentSession.provider_id)
      session.data = await provider.updatePayment(paymentSession.data, cart)

      const sessionRepo = manager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return sessionRepo.save(session)
    })
  }

  deleteSession(paymentSession) {
    return this.atomicPhase_(async manager => {
      const session = await this.retrieveSession(paymentSession.id).catch(
        _ => undefined
      )

      if (!session) {
        return Promise.resolve()
      }

      const provider = this.retrieveProvider(paymentSession.provider_id)
      await provider.deletePayment(paymentSession)

      const sessionRepo = manager.getCustomRepository(
        this.paymentSessionRepository_
      )

      return sessionRepo.remove(session)
    })
  }

  /**
   * Finds a provider given an id
   * @param {string} providerId - the id of the provider to get
   * @returns {PaymentService} the payment provider
   */
  retrieveProvider(providerId) {
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

  async createPayment(cart) {
    return this.atomicPhase_(async manager => {
      const { payment_session: paymentSession, region, total } = cart
      const provider = this.retrieveProvider(paymentSession.provider_id)
      const paymentData = await provider.getPaymentData(paymentSession)

      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)

      const created = paymentRepo.create({
        provider_id: paymentSession.provider_id,
        amount: total,
        currency_code: region.currency_code,
        data: paymentData,
      })

      return paymentRepo.save(created)
    })
  }

  async updatePayment(paymentId, update) {
    return this.atomicPhase_(async manager => {
      const payment = await this.retrievePayment(paymentId)

      if ("order_id" in update) {
        payment.order_id = update.order_id
      }

      if ("swap_id" in update) {
        payment.swap_id = update.swap_id
      }

      const payRepo = manager.getCustomRepository(this.paymentRepository_)
      return payRepo.save(payment)
    })
  }

  async authorizePayment(paymentSession, context) {
    return this.atomicPhase_(async manager => {
      const session = await this.retrieveSession(paymentSession.id).catch(
        _ => undefined
      )

      if (!session) {
        return Promise.resolve()
      }

      const provider = this.retrieveProvider(paymentSession.provider_id)
      const { status, data } = await provider
        .withTransaction(manager)
        .authorizePayment(session, context)

      session.data = data
      session.status = status

      const sessionRepo = manager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return sessionRepo.save(session)
    })
  }

  async updateSessionData(paySession, update) {
    return this.atomicPhase_(async manager => {
      const session = await this.retrieveSession(paySession.id)

      const provider = this.retrieveProvider(paySession.provider_id)

      session.data = await provider.updatePaymentData(paySession.data, update)
      session.status = paySession.status

      const sessionRepo = manager.getCustomRepository(
        this.paymentSessionRepository_
      )
      return sessionRepo.save(session)
    })
  }

  async cancelPayment(paymentObj) {
    return this.atomicPhase_(async manager => {
      const payment = await this.retrievePayment(paymentObj.id)

      const provider = this.retrieveProvider(payment.provider_id)
      payment.data = await provider.cancelPayment(payment)

      const now = new Date()
      payment.canceled_at = now.toISOString()

      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)
      return paymentRepo.save(payment)
    })
  }

  async getStatus(payment) {
    const provider = this.retrieveProvider(payment.provider_id)
    return provider.getStatus(payment.data)
  }

  async capturePayment(paymentObj) {
    return this.atomicPhase_(async manager => {
      const payment = await this.retrievePayment(paymentObj.id)

      const provider = this.retrieveProvider(payment.provider_id)
      payment.data = await provider.capturePayment(payment)

      const now = new Date()
      payment.captured_at = now.toISOString()

      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)
      return paymentRepo.save(payment)
    })
  }

  async refundPayment(payObjs, amount, reason, note) {
    return this.atomicPhase_(async manager => {
      const payments = await this.listPayments({ id: payObjs.map(p => p.id) })

      let order_id
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
          "Refund amount is too high"
        )
      }

      let balance = amount

      const used = []

      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)
      let toRefund = payments.find(p => p.amount - p.amount_refunded > 0)
      while (toRefund) {
        const currentRefundable = toRefund.amount - toRefund.amount_refunded

        const refundAmount = Math.min(currentRefundable, balance)

        const provider = this.retrieveProvider(toRefund.provider_id)
        toRefund.data = await provider.refundPayment(toRefund, refundAmount)
        toRefund.amount_refunded += refundAmount
        await paymentRepo.save(toRefund)

        balance -= refundAmount

        used.push(toRefund.id)

        if (balance > 0) {
          toRefund = payments.find(
            p => p.amount - p.amount_refunded > 0 && !used.includes(p.id)
          )
        } else {
          toRefund = null
        }
      }

      const refundRepo = manager.getCustomRepository(this.refundRepository_)
      const created = refundRepo.create({
        order_id,
        amount,
        reason,
        note,
      })

      return refundRepo.save(created)
    })
  }

  async retrieveRefund(id, config = {}) {
    const refRepo = this.manager_.getCustomRepository(this.refundRepository_)
    const query = this.buildQuery_({ id }, config)
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

export default PaymentProviderService
