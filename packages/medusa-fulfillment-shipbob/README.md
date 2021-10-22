# medusa-fulfillment-shipbob

Adds ShipBob as a fulfilment provider in Medusa Commerce. 

On each new fulfillment an order is created in ShipBob. The plugin listens for shipment events and updates the shipment accordingly.
A webhook listener is exposed at `/shipbob/shipments` to listen for shipment creations. You must create this webhook in ShipBob to have Medusa listen for shipment events.

## Options

```
  account: [your shipbob account] (required)
  api_token: [a shipbob api token] (required)
  order_channel_id: [the channel id to register orders on] (required)
```
