import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { Cart } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "@types"

type InjectedDependencies = {
  cartRepository: DAL.RepositoryService
}

export default class CartService<
  TEntity extends Cart = Cart
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateCartDTO
    update: UpdateCartDTO
  }
>(Cart)<TEntity> {
  protected readonly cartRepository_: DAL.RepositoryService<TEntity>

  constructor({ cartRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.cartRepository_ = cartRepository
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

    return await this.cartRepository_.update(updates, sharedContext)
  }
}
