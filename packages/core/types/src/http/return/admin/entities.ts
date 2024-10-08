import { BaseReturn, BaseReturnItem } from "../common"

export interface AdminReturnItem extends BaseReturnItem {}
export interface AdminReturn extends BaseReturn {
  items: AdminReturnItem[]
}
