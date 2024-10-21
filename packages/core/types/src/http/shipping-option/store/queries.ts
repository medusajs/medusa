import { BaseFilterable } from "../../../dal"
import { FindParams } from "../../common"

export interface StoreGetShippingOptionList
  extends FindParams,
    BaseFilterable<StoreGetShippingOptionList> {
  /**
   * The ID of the cart to retrieve the shipping options that
   * can be applied on it.
   */
  cart_id: string
  /**
   * Whether to retrieve shipping options used for returns.
   */
  is_return?: boolean
}
