# Payment Processor (Stripe) not showing in checkout

You add payment processors to your Medusa instance by adding them as plugins in `medusa-config.js`:

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

Then, refer to [this user guide](../user-guide/regions/providers.mdx) to learn how to enable the payment processor in a region.

---

## See Also

- [Install Stripe](../plugins/payment/stripe.md)
- [Payment Architecture Overview](../modules/carts-and-checkout/payment.md)
