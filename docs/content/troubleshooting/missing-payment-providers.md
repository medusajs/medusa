# Stripe not showing in checkout

You add payment providers to your Medusa instance by adding them as plugins in `medusa-config.js`:

```jsx
const plugins = [
  ...
  // You can create a Stripe account via: https://stripe.com
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
    },
  },
  ...
];
```

And installing them through your favourite package manager:

```bash npm2yarn
npm install medusa-payment-stripe
```

Though, to be able to also show them as part of your checkout flow, you need to add them to your regions.

In Medusa Admin go to Settings -> Regions and select your newly added payment provider:

![](https://i.imgur.com/CfR9BCV.png)
