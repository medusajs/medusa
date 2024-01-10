import {
  CartLineItemDTO,
  Context,
  DAL,
  FilterableLineItemProps,
  FindConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  isString,
  retrieveEntity,
} from "@medusajs/utils"
import { Cart, LineItem } from "@models"
import { LineItemRepository } from "@repositories"
import { CreateLineItemDTO, UpdateLineItemDTO } from "../types"
import CartService from "./cart"

type InjectedDependencies = {
  lineItemRepository: DAL.RepositoryService
  cartService: CartService<any>
}

export default class LineItemService<
  TEntity extends LineItem = LineItem,
  TCart extends Cart = Cart
> {
  protected readonly lineItemRepository_: DAL.RepositoryService<LineItem>
  protected readonly cartService_: CartService<TCart>

  constructor({ lineItemRepository, cartService }: InjectedDependencies) {
    this.lineItemRepository_ = lineItemRepository
    this.cartService_ = cartService
  }

  @InjectManager("lineItemRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<LineItem, CartLineItemDTO>({
      id: id,
      entityName: LineItem.name,
      repository: this.lineItemRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("lineItemRepository_")
  async list(
    filters: FilterableLineItemProps = {},
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<LineItem>(filters, config)

    return (await this.lineItemRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("lineItemRepository_")
  async listAndCount(
    filters: FilterableLineItemProps = {},
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<LineItem>(filters, config)

    return (await this.lineItemRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("lineItemRepository_")
  async create(
    cartOrId: Cart | string,
    data: CreateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    let cart = cartOrId as unknown as Cart

    if (isString(cart)) {
      cart = await this.cartService_.retrieve(cart, {}, sharedContext)
    }

    const data_ = [...data]
    data_.forEach((lineItem) => {
      // delete lineItem.cart_id

      Object.assign(lineItem, {
        cart_id: cart.id,
        // cart,
      })
    })

    return (await (this.lineItemRepository_ as LineItemRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("lineItemRepository_")
  async update(
    cartOrId: Cart | string,
    data: UpdateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    let cart = cartOrId as unknown as Cart

    if (isString(cart)) {
      cart = await this.cartService_.retrieve(
        cart,
        { relations: ["items"] },
        sharedContext
      )
    }

    const existingLinesMap = new Map(
      cart.items.map<[string, LineItem]>((li) => [li.id, li])
    )

    const updates: { lineItem: LineItem; update: UpdateLineItemDTO }[] = []

    for (const update of data) {
      const lineItem = existingLinesMap.get(update.id)

      if (!lineItem) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Line item with id "${update.id}" not found`
        )
      }

      updates.push({ lineItem, update })
    }

    return (await (this.lineItemRepository_ as LineItemRepository).update(
      updates,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("lineItemRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.lineItemRepository_.delete(ids, sharedContext)
  }
}
