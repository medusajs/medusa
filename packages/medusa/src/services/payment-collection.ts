import { DeepPartial, EntityManager, Equal } from "typeorm"
import { MedusaError } from "medusa-core-utils"

import { FindConfig } from "../types/common"
import { buildQuery, isDefined, setMetadata } from "../utils"
import { PaymentCollectionRepository } from "../repositories/payment-collection"
import {
  Customer,
  PaymentCollection,
  PaymentCollectionStatus,
  PaymentSession,
  PaymentSessionStatus,
} from "../models"
import { TransactionBaseService } from "../interfaces"
import {
  CustomerService,
  EventBusService,
  PaymentProviderService,
  PaymentService,
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
    sessionInput: Omit<PaymentCollectionSessionInput, "amount">
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

      if (!session) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Session with id ${sessionId} was not found`
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

      if (session.payment_authorized_at && payCol.authorized_amount) {
        payCol.authorized_amount -= session.amount
      }

      await paymentCollectionRepository.save(payCol)

      return sessionRefreshed
    })
  }

  async markAsAuthorized(
    paymentCollectionId: string
  ): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (manager) => {
      const paymentCollectionRepo = manager.getCustomRepository(
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
      for (let i = 0; i < payCol.payment_sessions.length; i++) {
        const session = payCol.payment_sessions[i]

        if (session.payment_authorized_at) {
          authorizedAmount += session.amount
          continue
        }

        const auth = await this.paymentProviderService_
          .withTransaction(manager)
          .authorizePayment(session, context)

        if (auth) {
          payCol.payment_sessions[i] = auth
        }

        if (auth?.status === PaymentSessionStatus.AUTHORIZED) {
          authorizedAmount += session.amount

          const inputData: Omit<PaymentProviderDataInput, "customer"> & {
            payment_session: PaymentSession
          } = {
            amount: session.amount,
            currency_code: payCol.currency_code,
            provider_id: session.provider_id,
            resource_id: payCol.id,
            payment_session: auth,
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
}
