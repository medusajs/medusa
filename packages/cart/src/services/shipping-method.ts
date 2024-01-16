import {
  CartShippingMethodDTO,
  Context,
  DAL,
  // FilterableShippingMethodProps,
  FindConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { ShippingMethod } from "@models"
import { ShippingMethodRepository } from "@repositories"
import { CreateShippingMethodDTO, UpdateShippingMethodDTO } from "../types"

type InjectedDependencies = {
  shippingMethodRepository: DAL.RepositoryService
}

export default class ShippingMethodService<
  TEntity extends ShippingMethod = ShippingMethod
> {
  protected readonly shippingMethodRepository_: DAL.RepositoryService<ShippingMethod>

  constructor({ shippingMethodRepository }: InjectedDependencies) {
    this.shippingMethodRepository_ = shippingMethodRepository
  }

  @InjectManager("shippingMethodRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CartShippingMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<ShippingMethod, CartShippingMethodDTO>({
      id: id,
      entityName: ShippingMethod.name,
      repository: this.shippingMethodRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("shippingMethodRepository_")
  async list(
    filters: any = {},
    config: FindConfig<CartShippingMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ShippingMethod>(
      filters,
      config
    )

    return (await this.shippingMethodRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("shippingMethodRepository_")
  async listAndCount(
    filters: any = {},
    config: FindConfig<CartShippingMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ShippingMethod>(
      filters,
      config
    )

    return (await this.shippingMethodRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("shippingMethodRepository_")
  async create(
    data: CreateShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.shippingMethodRepository_ as ShippingMethodRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("shippingMethodRepository_")
  async update(
    data: UpdateShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const existingMethods = await this.list(
      {
        id: data.map((d) => d.id),
      },
      {},
      sharedContext
    )

    const existingMethodsMap = new Map(
      existingMethods.map<[string, ShippingMethod]>((sm) => [sm.id, sm])
    )

    const updates: UpdateShippingMethodDTO[] = []

    for (const update of data) {
      const shippingMethod = existingMethodsMap.get(update.id)

      if (!shippingMethod) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Shipping method with id "${update.id}" not found`
        )
      }

      updates.push({ ...update, id: shippingMethod.id })
    }

    return (await (
      this.shippingMethodRepository_ as ShippingMethodRepository
    ).update(updates, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("shippingMethodRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.shippingMethodRepository_.delete(ids, sharedContext)
  }
}
