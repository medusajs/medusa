# medusa-payment-stripe

Add Stripe as a Payment Provider.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/add-plugins/stripe).

## Options

```js
{
  api_key: "STRIPE_API_KEY",
  webhook_secret: "STRIPE_WEBHOOK_SECRET",
  automatic_payment_methods: true
}
```

## Automatic Payment Methods

If you wish to use [Stripe's automatic payment methods](https://stripe.com/docs/connect/automatic-payment-methods) set the `automatic_payment_methods` flag to true.
