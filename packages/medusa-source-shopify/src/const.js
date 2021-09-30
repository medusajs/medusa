import { DataType } from "@shopify/shopify-api"

export const HOST = "https://339b-83-151-141-70.ngrok.io/shopify"
export const SHOPIFY_SCOPES = ["read_products", "read_orders", "write_orders"]
export const WEBHOOKS = [
  {
    path: "webhooks",
    body: {
      webhook: {
        topic: "orders/create",
        address: `${HOST}/order/create`,
        format: "json",
      },
    },
    type: DataType.JSON,
  },
  {
    path: "webhooks",
    body: {
      webhook: {
        topic: "orders/delete",
        address: `${HOST}/order/delete`,
        format: "json",
      },
    },
    type: DataType.JSON,
  },
  {
    path: "webhooks",
    body: {
      webhook: {
        topic: "orders/fulfillment",
        address: `${HOST}/order/fulfillment`,
        format: "json",
      },
    },
    type: DataType.JSON,
  },
  {
    path: "webhooks",
    body: {
      webhook: {
        topic: "orders/payment",
        address: `${HOST}/order/payment`,
        format: "json",
      },
    },
    type: DataType.JSON,
  },
]

export const INCLUDE_PRESENTMENT_PRICES = {
  "X-Shopify-Api-Features": "include-presentment-prices",
}
