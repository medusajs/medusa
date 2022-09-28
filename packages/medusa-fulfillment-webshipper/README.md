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
  coo_countries: [an array of countries in which a Certificate of Origin will be attached] (default: "all")
  delete_on_cancel [determines whether Webshipper orders are deleted when a Medusa fulfillment is canceled] (default: false)
```

## Personal Customs Numbers

In countries like South Korea a personal customs number is required to clear customs. The Webshipper fulfillment plugin is able pass this information to Webshipper given that the number is stored in `order.shipping_address.metadata.personal_customs_no`.

### Modifications in checkout flow

To pass the information along you should dynamically show an input field to the customer when they are shopping from a region that requires a personal customs number, and make sure that the metadata field is set when updating the cart shipping address.

```js
const onUpdateAddress = async () => {
  const address = {
    first_name: "John",
    last_name: "Johnson",
    ...,
    metadata: {
      personal_customs_no: "my-customs-number"
    }
  }

  await medusaClient.carts
    .update(cartId, {
      shipping_address: address
    })
    .then(() => {
      console.log("Good stuff - Webshipper will pass along the customs number")
    })
}
```
