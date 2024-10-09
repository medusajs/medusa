import { BaseReturn, BaseReturnItem } from "../common"

export interface StoreReturn
  extends Omit<BaseReturn, "no_notification" | "order_version"> {
  items: StoreReturnItem[]
}
export interface StoreReturnItem extends BaseReturnItem {}
