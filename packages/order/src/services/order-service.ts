import {
  Context,
  DAL,
  FindConfig,
  OrderTypes,
  RepositoryService,
} from "@medusajs/types"
import {
  InjectManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { Order } from "@models"

type InjectedDependencies = {
  orderRepository: DAL.RepositoryService
}

export default class OrderService<
  TEntity extends Order = Order
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  Order
)<TEntity> {
  protected readonly orderRepository_: RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.orderRepository_ = container.orderRepository
  }

  @InjectManager("orderRepository_")
  async retrieveOrderVersion<TEntityMethod = OrderTypes.OrderDTO>(
    id: string,
    version: number,
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    const queryConfig = ModulesSdkUtils.buildQuery<TEntity>(
      { id, items: { version } },
      { ...config, take: 1 }
    )
    const [result] = await this.orderRepository_.find(
      queryConfig,
      sharedContext
    )

    if (!result) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id: "${id}" and version: "${version}" not found`
      )
    }

    return result
  }
}
