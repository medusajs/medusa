import { DeepPartial, EntityManager, IsNull } from "typeorm"
import { MedusaError } from "medusa-core-utils"

import { FindConfig } from "../types/common"
import { buildQuery, isDefined, setMetadata } from "../utils"
import { PaymentCollectionRepository } from "../repositories/payment-collection"
import {
  Customer,
  PaymentCollection,
  PaymentCollectionStatus,
  PaymentSession,
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
    const paymentCollection = await paymentCollectionRepository.findOne(query)

    if (!paymentCollection) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment collection with id ${paymentCollectionId} was not found`
      )
    }

    return paymentCollection
  }

  async retrievePaymentIdBySessionId(sessionId: string): Promise<string> {
    const manager = this.transactionManager_ ?? this.manager_

    const payCol = (await manager
      .createQueryBuilder("payment_collection", "pc")
      .select("pc.id")
      .innerJoin(
        "payment_collection_sessions",
        "pcs",
        "pcs.payment_collection_id = pc.id"
      )
      .where(`pcs.payment_session_id = :sessionId`, {
        sessionId,
      })
      .getOne()) as PaymentCollection

    if (!payCol) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Session Id ${sessionId} doesn't belong to a Payment Collection`
      )
    }

    return payCol.id
  }

  async create(data: CreatePaymentCollectionInput): Promise<PaymentCollection> {
    return await this.atomicPhase_(async (transactionManager) => {
      const paymentCollectionRepository =
        transactionManager.getCustomRepository(
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
        .withTransaction(transactionManager)
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

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const paymentCollectionRepository =
          transactionManager.getCustomRepository(
            this.paymentCollectionRepository_
          )

        const payCol = await this.retrieve(paymentCollectionId, {
          relations: ["region", "region.payment_providers", "payment_sessions"],
        })

        if (payCol.status !== PaymentCollectionStatus.NOT_PAID) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Cannot set payment sessionf for a payment collection with status ${payCol.status}`
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
            `The total amount must be equal to ${payCol.amount}`
          )
        }

        let customer: Customer | undefined = undefined

        const selectedSessionIds: string[] = []
        const paymentSessions: PaymentSession[] = []

        for (const session of sessionsInput) {
          if (!customer) {
            customer = await this.customerService_.retrieve(
              session.customer_id,
              {
                select: ["id", "email", "metadata"],
              }
            )
            if (!customer) {
              throw new MedusaError(
                MedusaError.Types.UNEXPECTED_STATE,
                `Invalid customer_id`
              )
            }
          }

          const existingSession = payCol.payment_sessions?.find(
            ({ id }) => session.session_id === id
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
              .withTransaction(transactionManager)
              .updateSessionNew(existingSession, inputData)

            selectedSessionIds.push(existingSession.id)
            paymentSessions.push(paymentSession)
          } else {
            const paymentSession = await this.paymentProviderService_
              .withTransaction(transactionManager)
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
            await paymentCollectionRepository
              .createQueryBuilder()
              .delete()
              .from(PaymentSession)
              .where("id IN (:...ids)", { ids: removeIds })
              .execute()
          }
        }

        payCol.payment_sessions = paymentSessions
        await paymentCollectionRepository.save(payCol)

        return payCol
      }
    )
  }

  async refreshPaymentSession(
    sessionInput: PaymentCollectionSessionInput
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const id = sessionInput.session_id?.toString() ?? ""

        const payColId = await this.retrievePaymentIdBySessionId(id)
        const session = await this.paymentProviderService_.retrieveSession(id)

        const payCol = await this.retrieve(payColId, {
          relations: ["region", "region.payment_providers", "payment_sessions"],
        })

        if (session.amount !== sessionInput.amount) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "The amount has to be the same as the existing payment session"
          )
        }

        const customer = await this.customerService_.retrieve(
          sessionInput.customer_id,
          {
            select: ["id", "email", "metadata"],
          }
        )

        const inputData: PaymentProviderDataInput = {
          resource_id: payCol.id,
          currency_code: payCol.currency_code,
          amount: session.amount,
          provider_id: session.provider_id,
          customer,
        }

        const sessionRefreshed = await this.paymentProviderService_
          .withTransaction(transactionManager)
          .refreshSessionNew(session, inputData)

        payCol.payment_sessions = payCol.payment_sessions.map((sess) => {
          if (sess.id === id) {
            return sessionRefreshed
          }
          return sess
        })

        const manager = this.transactionManager_ ?? this.manager_
        const paymentCollectionRepository = manager.getCustomRepository(
          this.paymentCollectionRepository_
        )

        await paymentCollectionRepository.save(payCol)

        return sessionRefreshed
      }
    )
  }
}
