# Payment Provider (Stripe) not showing in checkout

You add payment providers to your Medusa instance by adding them as plugins in `medusa-config.js`:

```js title=medusa-config.js
const plugins = [
  // ...
  // You can create a Stripe account via: https://stripe.com
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
    },
  },
]
```

And installing them with your favourite package manager:

```bash npm2yarn
npm install medusa-payment-stripe
```

However, to also show them as part of your checkout flow you need to add them to your regions.

In the Medusa Admin go to Settings > Regions and for each region scroll down to the Payment Provider input and choose the payment provider you want to use in that region.

---

## See Also

- [Install Stripe](../plugins/payment/stripe.md)
- [Payment Architecture Overview](../modules/carts-and-checkout/payment.md)
