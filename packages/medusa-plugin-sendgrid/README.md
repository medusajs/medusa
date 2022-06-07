# medusa-plugin-sendgrid

Sendgrid Plugin for Medusa to send transactional emails.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/add-plugins/sendgrid).

## Options

If no values are defined for a given option, the plugin will not try to send an email for that event.

```js
{
  api_key: "SENDGRID_API_KEY", //required
  from: "[the from field, i.e. ACME <acme@mail.com>]", //required
  gift_card_created_template: "[used on gift_card.created]",
  order_placed_template: "[used on order.placed]",
  order_canceled_template: "[used on order.canceled]",
  order_shipped_template: "[used on order.shipment_created]",
  order_completed_template: "[used on order.completed]",
  user_password_reset_template: "[used on user.password_reset]",
  customer_password_reset_template: "[used on customer.password_reset]",
  localization: {
    "de-DE": { // locale key
      gift_card_created_template: "[used on gift_card.created]",
      order_placed_template: "[used on order.placed]",
      order_canceled_template: "[used on order.canceled]",
      order_shipped_template: "[used on order.shipment_created]",
      order_completed_template: "[used on order.completed]",
      user_password_reset_template: "[used on user.password_reset]",
      customer_password_reset_template: "[used on customer.password_reset]",
    }
  }
}
```

## Dynamic usage

You can resolve the SendGrid service to dynamically send emails via sendgrid.

Example:

```js

const sendgridService = scope.resolve("sendgridService")
sendgridService.sendEmail("d-123....", "ACME <acme@mail.com>", "customer@mail.com", { dynamic: "data" })

```
