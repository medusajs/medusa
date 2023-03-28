# medusa-payment-paypal

Add PayPal as a Payment Provider.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/add-plugins/paypal).

## Options

```js
{
  sandbox: true, //default false
  clientId: "CLIENT_ID", // REQUIRED
  clientSecret: "CLIENT_SECRET", // REQUIRED
  authWebhookId: "WEBHOOK_ID", //REQUIRED for webhook to work
}
```

## Deprecation

The paypal plugin version `>=1.3.x` requires medusa `>=1.8.x`