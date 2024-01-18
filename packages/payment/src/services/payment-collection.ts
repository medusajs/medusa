import { PaymentCollection } from "@models"
import {
  Context,
  CreatePaymentCollectionDTO,
  DAL,
  FilterablePaymentCollectionProps,
  FindConfig,
  PaymentCollectionDTO,
  UpdatePaymentCollectionDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"

import { PaymentCollectionRepository } from "@repositories"

type InjectedDependencies = {
  paymentCollectionRepository: DAL.RepositoryService
}

export default class PaymentCollectionService<
  TEntity extends PaymentCollection = PaymentCollection
> {
  protected readonly paymentCollectionRepository_: DAL.RepositoryService

  constructor({ paymentCollectionRepository }: InjectedDependencies) {
    this.paymentCollectionRepository_ = paymentCollectionRepository
  }

  @InjectManager("paymentCollectionRepository_")
  async retrieve(
    id: string,
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PaymentCollection, PaymentCollectionDTO>({
      id: id,
      entityName: PaymentCollection.name,
      repository: this.paymentCollectionRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectTransactionManager("paymentCollectionRepository_")
  async create(
    data: CreatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]> {
    return (await (
      this.paymentCollectionRepository_ as PaymentCollectionRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("paymentCollectionRepository_")
  async update(
    data: UpdatePaymentCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.paymentCollectionRepository_ as PaymentCollectionRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("paymentCollectionRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.paymentCollectionRepository_.delete(ids, sharedContext)
  }

  @InjectManager("paymentCollectionRepository_")
  async list(
    filters: FilterablePaymentCollectionProps = {},
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PaymentCollection>(
      filters,
      config
    )

    return (await this.paymentCollectionRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("paymentCollectionRepository_")
  async listAndCount(
    filters: FilterablePaymentCollectionProps = {},
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PaymentCollection>(
      filters,
      config
    )

    return (await this.paymentCollectionRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }
}
