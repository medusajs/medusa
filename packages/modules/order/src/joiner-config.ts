import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"
import {
  Order,
  OrderAddress,
  OrderChange,
  OrderClaim,
  OrderExchange,
  OrderItem,
  OrderLineItem,
  OrderShippingMethod,
  OrderTransaction,
  Return,
  ReturnReason,
} from "@models"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.ORDER, {
  schema,
  linkableKeys: {
    claim_id: "OrderClaim",
    exchange_id: "OrderExchange",
  },
  models: [
    Order,
    OrderAddress,
    OrderChange,
    OrderClaim,
    OrderExchange,
    OrderItem,
    OrderLineItem,
    OrderShippingMethod,
    OrderTransaction,
    Return,
    ReturnReason,
  ],
})
