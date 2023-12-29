import { FindConfig } from "../common"
import { IModuleService, ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartDTO,
  CreateCartDTO,
  FilterableCartProps,
  UpdateCartDTO
} from "./common"

export interface ICartModuleService extends IModuleService {
  /**
   * @ignore
   */
  __joinerConfig(): ModuleJoinerConfig

  retrieve(
    cartId: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<any>

  list(
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO[]>

  listAndCount(
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<[CartDTO[], number]>

  create(data: CreateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>

  update(data: UpdateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>

  delete(productIds: string[], sharedContext?: Context): Promise<void>

  // addLineItems(cartId: string, lineItems: CreateLineItemDTO)
  // addLineItems(cartId: string, lineItems: CreateLineItemDTO[])
  // updateLineItem(cartId: string, lineItems: UpdateCartDTO)
  // updateLineItem(cartId: string, lineItems: UpdateCartDTO[])
  // removeLineItems(cartId: string, lineItems: string)
  // removeLineItems(cartId: string, lineItems: string[])
}
