import { StoreProduct } from "../../product"
import { BaseCollection } from "../common"

export interface StoreCollection extends Omit<BaseCollection, "products"> {
  /**
   * The collection's products.
   */
  products?: StoreProduct[]
}
