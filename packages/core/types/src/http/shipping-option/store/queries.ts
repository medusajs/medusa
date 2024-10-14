import { BaseFilterable } from "../../../dal"
import { FindParams } from "../../common"

export interface StoreGetShippingOptionList
  extends FindParams,
    BaseFilterable<StoreGetShippingOptionList> {
  cart_id: string
}
