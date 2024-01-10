import {
  CartDTO,
  Context,
  DAL,
  FilterableCartProps,
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
import { Cart } from "@models"
import { CartRepository } from "src/repositories/cart"
import { CreateCartDTO, UpdateCartDTO } from "../types"

type InjectedDependencies = {
  cartRepository: DAL.RepositoryService
}

export default class CartService<TEntity extends Cart = Cart> {
  protected readonly cartRepository_: DAL.RepositoryService

  constructor({ cartRepository }: InjectedDependencies) {
    this.cartRepository_ = cartRepository
  }

  @InjectManager("cartRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<Cart, CartDTO>({
      id: id,
      entityName: Cart.name,
      repository: this.cartRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("cartRepository_")
  async list(
    filters: FilterableCartProps = {},
    config: FindConfig<CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Cart>(filters, config)

    return (await this.cartRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("cartRepository_")
  async listAndCount(
    filters: FilterableCartProps = {},
    config: FindConfig<CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Cart>(filters, config)

    return (await this.cartRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("cartRepository_")
  async create(
    data: CreateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.cartRepository_ as CartRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("cartRepository_")
  async update(
    data: UpdateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const existingCarts = await this.list(
      { id: data.map(({ id }) => id) },
      {},
      sharedContext
    )

    const existingCartsMap = new Map(
      existingCarts.map<[string, Cart]>((cart) => [cart.id, cart])
    )

    const updates: { cart: Cart; update: UpdateCartDTO }[] = []

    for (const update of data) {
      const cart = existingCartsMap.get(update.id)

      if (!cart) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Cart with id "${update.id}" not found`
        )
      }

      updates.push({ cart, update })
    }

    return (await (this.cartRepository_ as CartRepository).update(
      updates,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("cartRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.cartRepository_.delete(ids, sharedContext)
  }
}
