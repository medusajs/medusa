import {
  Context,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentSessionDTO,
  DAL,
  FilterablePaymentCollectionProps,
  FindConfig,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  PaymentCollectionDTO,
  PaymentCollectionStatus,
  PaymentDTO,
  SetPaymentSessionsDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  PaymentSessionStatus,
} from "@medusajs/utils"

import * as services from "@services"

import { joinerConfig } from "../joiner-config"
import { MedusaError } from "medusa-core-utils"
import payment from "@medusajs/medusa/dist/repositories/payment"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentCollectionService: services.PaymentCollectionService
}

export default class PaymentModuleService implements IPaymentModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected paymentCollectionService_: services.PaymentCollectionService

  constructor(
    { baseRepository, paymentCollectionService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository

    this.paymentCollectionService_ = paymentCollectionService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  createPaymentCollection(
    data: CreatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  createPaymentCollection(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createPaymentCollection(
    data: CreatePaymentCollectionDTO | CreatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const collections = await this.paymentCollectionService_.create(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      Array.isArray(data) ? collections : collections[0],
      {
        populate: true,
      }
    )
  }

  updatePaymentCollection(
    data: UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  updatePaymentCollection(
    data: UpdatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  @InjectTransactionManager("baseRepository_")
  async updatePaymentCollection(
    data: UpdatePaymentCollectionDTO | UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.paymentCollectionService_.update(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  deletePaymentCollection(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<void>
  deletePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async deletePaymentCollection(
    ids: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const paymentCollectionIds = Array.isArray(ids) ? ids : [ids]
    await this.paymentCollectionService_.delete(
      paymentCollectionIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async retrievePaymentCollection(
    paymentCollectionId: string,
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentCollectionDTO> {
    const paymentCollection = await this.paymentCollectionService_.retrieve(
      paymentCollectionId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO>(
      paymentCollection,
      { populate: true }
    )
  }

  @InjectManager("baseRepository_")
  async listPaymentCollections(
    filters: FilterablePaymentCollectionProps = {},
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]> {
    const paymentCollections = await this.paymentCollectionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      paymentCollections,
      { populate: true }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPaymentCollections(
    filters: FilterablePaymentCollectionProps = {},
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[PaymentCollectionDTO[], number]> {
    const [paymentCollections, count] =
      await this.paymentCollectionService_.listAndCount(
        filters,
        config,
        sharedContext
      )

    return [
      await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
        paymentCollections,
        { populate: true }
      ),
      count,
    ]
  }

  @InjectTransactionManager("baseRepository_")
  async authorizePaymentCollection(
    paymentCollectionId: string,
    sessionIds: string[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    const paymentCollection = await this.retrievePaymentCollection(
      paymentCollectionId,
      { relations: ["payment_sessions", "payments"] }
    )

    if (paymentCollection.authorized_amount === paymentCollection.amount) {
      return paymentCollection
    }

    if (paymentCollection.amount < 0) {
      return await this.updatePaymentCollection(
        {
          id: paymentCollectionId,
          authorized_amount: 0,
          status: PaymentCollectionStatus.AUTHORIZED,
        },
        sharedContext
      )
    }

    if (!paymentCollection.payment_sessions?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You cannot complete a Payment Collection without a payment session."
      )
    }

    let authorizedAmount = 0

    for (const paymentSession of paymentCollection.payment_sessions) {
      if (paymentSession.authorized_at) {
        continue
      }

      if (!sessionIds.includes(paymentSession.id)) {
        continue
      }

      // TODO: authorize with payment provider

      if (paymentSession.status === PaymentSessionStatus.AUTHORIZED) {
        authorizedAmount += paymentSession.authorized_amount

        await this.createPayment(
          {
            amount: paymentSession.amount,
            currency_code: paymentCollection.currency_code,
            provider_id: paymentSession.provider_id,
            payment_session_id: paymentSession.id,
            payment_collection_id: paymentCollection.id,
          },
          sharedContext
        )
      }
    }

    let status = paymentCollection.status

    if (authorizedAmount === 0) {
      status = PaymentCollectionStatus.AWAITING
    } else if (authorizedAmount < paymentCollection.amount) {
      status = PaymentCollectionStatus.PARTIALLY_AUTHORIZED
    } else if (authorizedAmount === paymentCollection.amount) {
      status = PaymentCollectionStatus.AUTHORIZED
    }

    await this.updatePaymentCollection(
      {
        id: paymentCollectionId,
        authorized_amount: authorizedAmount,
        status,
      },
      sharedContext
    )

    return this.retrievePaymentCollection(paymentCollectionId, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async setPaymentSessions(
    paymentCollectionId: string,
    data: SetPaymentSessionsDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    const paymentCollection = await this.retrievePaymentCollection(
      paymentCollectionId,
      { relation: ["payment_sessions", "payment_providers"] },
      sharedContext
    )

    if (paymentCollection.status !== PaymentCollectionStatus.NOT_PAID) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot set payment sessions for a payment collection with status ${paymentCollection.status}`
      )
    }

    // TODO: we should pass payment providers upon creation

    const paymentProvidersMap = new Map(
      paymentCollection.payment_providers.map((provider) => [
        provider.id,
        provider,
      ])
    )

    const paymentSessionsMap = new Map(
      paymentCollection.payment_providers.map((session) => [
        session.id,
        session,
      ])
    )

    const totalSessionsAmount = data.reduce((acc, i) => acc + i.amount, 0)

    // TODO: revisit condition
    if (totalSessionsAmount === paymentCollection.amount) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `The sum of sessions is not equal to ${paymentCollection.amount} on Payment Collection`
      )
    }

    const currentSessionsIds = []

    for (const input of data) {
      const existingSession =
        input.session_id && paymentSessionsMap.get(input.session_id)
      let paymentSession

      if (existingSession) {
        // TODO: update session with provider
      } else {
        // TODO: create session with provider
        // TODO: create PaymentSession with module
      }

      currentSessionsIds.push(paymentSession.id)
    }

    if (paymentCollection.payment_sessions?.length) {
      const toRemoveSessionIds = paymentCollection.payment_sessions.filter(
        ({ id }) => !currentSessionsIds.includes(id)
      )

      if (toRemoveSessionIds.length) {
        // TODO remove sessions with provider

        await this.deletePaymentSessions(toRemoveSessionIds, sharedContext)
      }
    }

    return await this.retrievePaymentCollection(
      paymentCollectionId,
      sharedContext
    )
  }

  deletePaymentSession(ids: string[], sharedContext?: Context): Promise<void>
  deletePaymentSession(id: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async deletePaymentSession(
    ids: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const paymentCollectionIds = Array.isArray(ids) ? ids : [ids]
    await this.paymentSessionService_.delete(
      paymentCollectionIds,
      sharedContext
    )
  }

  /**
   * TODO
   */

  completePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }
  createPayment(data: CreatePaymentDTO): Promise<PaymentDTO>
  createPayment(data: CreatePaymentDTO[]): Promise<PaymentDTO[]>
  createPayment(data: unknown): Promise<PaymentDTO | PaymentDTO[]> {
    throw new Error("Method not implemented.")
  }
  capturePayment(
    paymentId: string,
    amount: number,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO> {
    throw new Error("Method not implemented.")
  }
  refundPayment(
    paymentId: string,
    amount: number,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO> {
    throw new Error("Method not implemented.")
  }
  updatePayment(
    data: UpdatePaymentDTO,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO>
  updatePayment(
    data: UpdatePaymentDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO[]>
  updatePayment(
    data: unknown,
    sharedContext?: unknown
  ): Promise<PaymentDTO | PaymentDTO[]> {
    throw new Error("Method not implemented.")
  }
  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO>
  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO>
  createPaymentSession(
    paymentCollectionId: unknown,
    data: unknown,
    sharedContext?: unknown
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }
}
