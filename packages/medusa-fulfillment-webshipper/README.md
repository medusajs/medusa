# medusa-fulfillment-webshipper

Adds Webshipper as a fulfilment provider in Medusa Commerce. 

On each new fulfillment an order is created in Webshipper. The plugin listens for shipment events and updated the shipment accordingly.
A webhook listener is exposed at `/webshipper/shipments` to listen for shipment creations. You must create this webhook in Webshipper to have Medusa listen for shipment events.

## Options

```
  account: [your webshipper account] (required)
  api_token: [a webshipper api token] (required)
  order_channel_id: [the channel id to register orders on] (required)
  webhook_secret: [the webhook secret used to listen for shipments] (required)
```
