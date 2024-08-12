import { StoreOrder } from "../../order"
import { StoreCart } from "./entities"

export interface StoreCartResponse {
  cart: StoreCart
}

export type StoreCompleteCartResponse = {
  type: "cart"
  cart: StoreCart
  error: {
    message: string
    name: string
    type: string
  }
} | {
  type: "order"
  order: StoreOrder
}