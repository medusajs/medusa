import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { CartDTO, FilterableCartProps } from "./common"
import { CreateCartDTO, UpdateCartDTO } from "./mutations"

export interface ICartModuleService extends IModuleService {
  retrieve(
    cartId: string,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO>

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

  // addLineItems(data: AddLineItemsDTO, sharedContext?: Context): Promise<CartDTO>
  // addLineItems(
  //   data: AddLineItemsDTO[],
  //   sharedContext?: Context
  // ): Promise<CartDTO[]>

  // updateLineItems(
  //   data: UpdateLineItemsDTO,
  //   sharedContext?: Context
  // ): Promise<CartDTO>
  // updateLineItems(
  //   data: UpdateLineItemsDTO[],
  //   sharedContext?: Context
  // ): Promise<CartDTO[]>

  // removeLineItems(lineItemIds: string[], sharedContext?: Context): Promise<void>
}
