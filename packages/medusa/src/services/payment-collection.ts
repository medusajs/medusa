import { isDefined, MedusaError } from "medusa-core-utils"
import { DeepPartial, EntityManager } from "typeorm"

import {
  PaymentCollection,
  PaymentCollectionStatus,
  PaymentSession,
  PaymentSessionStatus,
} from "../models"
import { PaymentCollectionRepository } from "../repositories/payment-collection"
import { FindConfig } from "../types/common"
import { buildQuery, isString, setMetadata } from "../utils"
import { CustomerService, PaymentProviderService } from "./index"

import { TransactionBaseService } from "../interfaces"
import { CreatePaymentInput, PaymentSessionInput } from "../types/payment"
import {
  CreatePaymentCollectionInput,
  PaymentCollectionsSessionsBatchInput,
  PaymentCollectionsSessionsInput,
} from "../types/payment-collection"
import EventBusService from "./event-bus"

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
  }

  protected readonly eventBusService_: EventBusService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly customerService_: CustomerService
  // eslint-disable-next-line max-len
  protected readonly paymentCollectionRepository_: typeof PaymentCollectionRepository

  constructor({
    paymentCollectionRepository,
    paymentProviderService,
    customerService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.paymentCollectionRepository_ = paymentCollectionRepository
    this.paymentProviderService_ = paymentProviderService
    this.eventBusService_ = eventBusService
    this.customerService_ = customerService
  }

  /**
   * Retrieves a payment collection by id.
   * @param paymentCollectionId - the id of the payment collection
   * @param config - the config to retrieve the payment collection
   * @return the payment collection.
   */
  async retrieve(
    paymentCollectionId: string,
    config: FindConfig<PaymentCollection> = {}
  ): Promise<PaymentCollection> {
    if (!isDefined(paymentCollectionId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"paymentCollectionId" must be defined`
      )
    }

    const paymentCollectionRepository = this.activeManager_.withRepository(
      this.paymentCollectionRepository_
    )

    let paymentCollection: PaymentCollection[] = []
    if (paymentCollectionId) {
      const query = buildQuery({ id: paymentCollectionId }, config)
      paymentCollection = await paymentCollectionRepository.find(query)
    }

    if (!paymentCollection.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment collection with id ${paymentCollectionId} was not found`
      )
    }

    return paymentCollection[0]
  }

  /**
   * Creates a new payment collection.
   * @param data - info to create the payment collection
   * @return the payment collection created.
   */
  async create(data: CreatePaymentCollectionInput): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepository = manager.withRepository(
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

  /**
   * Updates a payment collection.
   * @param paymentCollectionId - the id of the payment collection to update
   * @param data - info to be updated
   * @return the payment collection updated.
   */
  async update(
    paymentCollectionId: string,
    data: DeepPartial<PaymentCollection>
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepo = manager.withRepository(
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

  /**
   * Deletes a payment collection.
   * @param paymentCollectionId - the id of the payment collection to be removed
   * @return the payment collection removed.
   */
  async delete(
    paymentCollectionId: string
  ): Promise<PaymentCollection | undefined> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepo = manager.withRepository(
        this.paymentCollectionRepository_
      )

      const paymentCollection = await this.retrieve(paymentCollectionId).catch(
        () => void 0
      )

      if (!paymentCollection) {
        return
      }

      if (
        ![
          PaymentCollectionStatus.CANCELED,
          PaymentCollectionStatus.NOT_PAID,
        ].includes(paymentCollection.status)
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
    sessionsInput: PaymentCollectionsSessionsBatchInput[]
  ): boolean {
    const sum = sessionsInput.reduce((cur, sess) => cur + sess.amount, 0)
    return total === sum
  }

  /**
   * Manages multiple payment sessions of a payment collection.
   * @param paymentCollectionOrId - the id of the payment collection
   * @param sessionsInput - array containing payment session info
   * @param customerId - the id of the customer
   * @return the payment collection and its payment sessions.
   */
  async setPaymentSessionsBatch(
    paymentCollectionOrId: string | PaymentCollection,
    sessionsInput: PaymentCollectionsSessionsBatchInput[],
    customerId: string
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const paymentCollectionRepository = manager.withRepository(
        this.paymentCollectionRepository_
      )

      const payCol: PaymentCollection = isString(paymentCollectionOrId)
        ? await this.retrieve(paymentCollectionOrId, {
            relations: [
              "region",
              "region.payment_providers",
              "payment_sessions",
            ],
          })
        : paymentCollectionOrId

      if (payCol.status !== PaymentCollectionStatus.NOT_PAID) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot set payment sessions for a payment collection with status ${payCol.status}`
        )
      }

      const payColRegionProviderMap = new Map(
        payCol.region.payment_providers.map((provider) => {
          return [provider.id, provider]
        })
      )

      sessionsInput = sessionsInput.filter((session) => {
        return !!payColRegionProviderMap.get(session.provider_id)
      })

      if (!this.isValidTotalAmount(payCol.amount, sessionsInput)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `The sum of sessions is not equal to ${payCol.amount} on Payment Collection`
        )
      }

      const customer = !isDefined(customerId)
        ? null
        : await this.customerService_
            .withTransaction(manager)
            .retrieve(customerId, {
              select: ["id", "email", "metadata"],
            })
            .catch(() => null)

      const payColSessionMap = new Map(
        (payCol.payment_sessions ?? []).map((session) => {
          return [session.id, session]
        })
      )

      const paymentProviderTx =
        this.paymentProviderService_.withTransaction(manager)

      const selectedSessionIds: string[] = []
      const paymentSessions: PaymentSession[] = []

      for (const session of sessionsInput) {
        const existingSession =
          session.session_id && payColSessionMap.get(session.session_id)

        const inputData: PaymentSessionInput = {
          cart: {
            email: customer?.email || "",
            context: {},
            shipping_methods: [],
            shipping_address: null,
            id: "",
            region_id: payCol.region_id,
            total: session.amount,
          },
          resource_id: payCol.id,
          currency_code: payCol.currency_code,
          amount: session.amount,
          provider_id: session.provider_id,
          customer,
        }

        let paymentSession

        if (existingSession) {
          paymentSession = await paymentProviderTx.updateSession(
            existingSession,
            inputData
          )
        } else {
          paymentSession = await paymentProviderTx.createSession(inputData)
        }

        selectedSessionIds.push(paymentSession.id)
        paymentSessions.push(paymentSession)
      }

      if (payCol.payment_sessions?.length) {
        const removeSessions: PaymentSession[] = payCol.payment_sessions.filter(
          ({ id }) => !selectedSessionIds.includes(id)
        )

        if (removeSessions.length) {
          await paymentCollectionRepository.delete(
            removeSessions.map((sess) => sess.id)
          )

          const paymentProviderTx =
            this.paymentProviderService_.withTransaction(manager)

          Promise.all(
            removeSessions.map(async (sess) =>
              paymentProviderTx.deleteSession(sess)
            )
          ).catch(() => void 0)
        }
      }

      payCol.payment_sessions = paymentSessions

      return await paymentCollectionRepository.save(payCol)
    })
  }

  /**
   * Manages a single payment sessions of a payment collection.
   * @param paymentCollectionId - the id of the payment collection
   * @param sessionInput - object containing payment session info
   * @param customerId - the id of the customer
   * @return the payment collection and its payment session.
   */
  async setPaymentSession(
    paymentCollectionId: string,
    sessionInput: PaymentCollectionsSessionsInput,
    customerId: string
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async () => {
      const payCol = await this.retrieve(paymentCollectionId, {
        relations: ["region", "region.payment_providers", "payment_sessions"],
      })

      const hasProvider = payCol?.region?.payment_providers.find(
        (p) => p.id === sessionInput.provider_id
      )

      if (!hasProvider) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Payment provider not found"
        )
      }

      const existingSession = payCol.payment_sessions?.find(
        (sess) => sessionInput.provider_id === sess?.provider_id
      )

      return await this.setPaymentSessionsBatch(
        payCol,
        [
          {
            ...sessionInput,
            amount: payCol.amount,
            session_id: existingSession?.id,
          },
        ],
        customerId
      )
    })
  }

  /**
   * Removes and recreate a payment session of a payment collection.
   * @param paymentCollectionId - the id of the payment collection
   * @param sessionId - the id of the payment session to be replaced
   * @param customerId - the id of the customer
   * @return the new payment session created.
   */
  async refreshPaymentSession(
    paymentCollectionId: string,
    sessionId: string,
    customerId: string
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const paymentCollectionRepository = manager.withRepository(
        this.paymentCollectionRepository_
      )

      const payCol =
        await paymentCollectionRepository.getPaymentCollectionIdBySessionId(
          sessionId,
          {
            relations: {
              region: {
                payment_providers: true,
              },
              payment_sessions: true,
            },
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

      if (!session) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Session with id ${sessionId} was not found`
        )
      }

      const customer = !isDefined(customerId)
        ? null
        : await this.customerService_
            .withTransaction(manager)
            .retrieve(customerId, {
              select: ["id", "email", "metadata"],
            })
            .catch(() => null)

      const inputData: PaymentSessionInput = {
        cart: {
          email: customer?.email || "",
          context: {},
          shipping_methods: [],
          shipping_address: null,
          id: "",
          region_id: payCol.region_id,
          total: session.amount,
        },
        resource_id: payCol.id,
        currency_code: payCol.currency_code,
        amount: session.amount,
        provider_id: session.provider_id,
        customer,
      }

      const sessionRefreshed = await this.paymentProviderService_
        .withTransaction(manager)
        .refreshSession(session, inputData)

      payCol.payment_sessions = payCol.payment_sessions.map((sess) => {
        if (sess.id === sessionId) {
          return sessionRefreshed
        }
        return sess
      })

      if (session.payment_authorized_at && payCol.authorized_amount) {
        payCol.authorized_amount -= session.amount
      }

      await paymentCollectionRepository.save(payCol)

      return sessionRefreshed
    })
  }

  /**
   * Marks a payment collection as authorized bypassing the payment flow.
   * @param paymentCollectionId - the id of the payment collection
   * @return the payment session authorized.
   */
  async markAsAuthorized(
    paymentCollectionId: string
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepo = manager.withRepository(
        this.paymentCollectionRepository_
      )

      const paymentCollection = await this.retrieve(paymentCollectionId)
      paymentCollection.status = PaymentCollectionStatus.AUTHORIZED
      paymentCollection.authorized_amount = paymentCollection.amount

      const result = await paymentCollectionRepo.save(paymentCollection)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PaymentCollectionService.Events.PAYMENT_AUTHORIZED, result)

      return result
    })
  }

  /**
   * Authorizes the payment sessions of a payment collection.
   * @param paymentCollectionId - the id of the payment collection
   * @param sessionIds - array of payment session ids to be authorized
   * @param context - additional data required by payment providers
   * @return the payment collection and its payment session.
   */
  async authorizePaymentSessions(
    paymentCollectionId: string,
    sessionIds: string[],
    context: Record<string, unknown> = {}
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const paymentCollectionRepository = manager.withRepository(
        this.paymentCollectionRepository_
      )

      const payCol = await this.retrieve(paymentCollectionId, {
        relations: ["payment_sessions", "payments"],
      })

      if (payCol.authorized_amount === payCol.amount) {
        return payCol
      }

      if (payCol.amount <= 0) {
        payCol.authorized_amount = 0
        payCol.status = PaymentCollectionStatus.AUTHORIZED
        return await paymentCollectionRepository.save(payCol)
      }

      if (!payCol.payment_sessions?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You cannot complete a Payment Collection without a payment session."
        )
      }

      const paymentProviderTx =
        this.paymentProviderService_.withTransaction(manager)

      let authorizedAmount = 0
      for (let i = 0; i < payCol.payment_sessions.length; i++) {
        const session = payCol.payment_sessions[i]

        if (session.payment_authorized_at) {
          authorizedAmount += session.amount
          continue
        }

        if (!sessionIds.includes(session.id)) {
          continue
        }

        const paymentSession = await paymentProviderTx.authorizePayment(
          session,
          context
        )

        if (paymentSession) {
          payCol.payment_sessions[i] = paymentSession
        }

        if (paymentSession?.status === PaymentSessionStatus.AUTHORIZED) {
          authorizedAmount += session.amount

          const inputData: CreatePaymentInput = {
            amount: session.amount,
            currency_code: payCol.currency_code,
            provider_id: session.provider_id,
            resource_id: payCol.id,
            payment_session: paymentSession,
          }

          payCol.payments.push(await paymentProviderTx.createPayment(inputData))
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
}
