import { BaseReturn, BaseReturnItem } from "../common";

export interface StoreReturn extends BaseReturn {
  items: StoreReturnItem[]
}
export interface StoreReturnItem extends BaseReturnItem {}
