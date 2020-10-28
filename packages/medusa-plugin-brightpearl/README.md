# medusa-plugin-brightpearl

Sends orders to Brightpearl, listens for stock movements, handles returns.

## Options

```
  account: [the Brightpearl account] (required)
  channel_id: [channel id to map sales and credits to] (required)
  backend_url: [the url where the Medusa server is running, needed for webhooks] (required)
  event_owner: [the id of the user who will own goods out events] (required),
  warehouse: [the warehouse id to allocate orders from] (required)
  default_status_id: [the status id to assign new orders with] (optional: defaults to 1)
  payment_method_code: [the method code to register payments with] (optional: defaults to 1220)
  sales_account_code: [nominal code to assign line items to] (optional: defaults to 4000)
  shipping_account_code: [nominal code to assign shipping line to] (optional: defaults to 4040)
  discount_account_code: [nominal code to use for Discount-type refunds] (optional)
  gift_card_account_code: [nominal code to use for gift card products and redeems] (optional: default to 4000)
  inventory_sync_cron: [cron pattern for inventory sync, if left out the job will not be created] (default: false)
```


## Orders

When an order is created in Medusa it will automatically be sent to Brightpearl and allocated there. Once allocated it is up to Brightpearl to figure out how the order is to be fulfilled - the plugin listens for goods out notes and tries to map each of these to a Medusa order, if the matching succeeds Medusa will send the order to the fulfillment provider associated with the shipping method selected by the Customer.

When line items on an order are returned the plugin will generate a sales credit in Brightpearl.

## Products

The plugin doesn't automatically create products in Medusa, but listens for inventory changes in Brightpearl. The plugin updates each product variant to reflect the inventory quantity listed in Brightpearl, thereby ensuring that the inventory levels in Medusa are always in sync with Brightpearl.

## OAuth

The plugin registers an OAuth app in Medusa allowing installation at https://medusa-commerce.com/a/settings/apps. The OAuth tokens are refreshed every hour to prevent unauthorized requests.

