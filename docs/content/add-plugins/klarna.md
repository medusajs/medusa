# Klarna

In this document, you’ll learn how to integrate Klarna as a payment provider in Medusa.

## Introduction

[Klarna](https://www.klarna.com/) is a payment provider that allows customers to pay in different ways including direct payment, installment payments, payment after delivery, and more.

You can integrate Klarna into Medusa using the [official plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-klarna).

---

## Prerequisites

### Medusa Components

It is assumed that you already have a Medusa server installed and set up. If not, you can follow the [quickstart guide](../quickstart/quick-start.mdx).

In addition, you’ll need to use the [Medusa Admin](../admin/quickstart.mdx) to enable the payment provider in later steps. You can alternatively use the [REST APIs](/api/admin/#tag/Region/operation/PostRegionsRegionPaymentProviders).

### Needed Accounts

- A [Klarna business account](https://portal.klarna.com/)

---

## Install Plugin

On your Medusa server, run the following command to install the plugin:

```bash
npm install medusa-payment-klarna
```

Then, add the following environment variables:

```bash
KLARNA_BACKEND_URL=<YOUR_KLARNA_BACKEND_URL>
KLARNA_URL=<YOUR_KLARNA_URL>
KLARNA_USER=<YOUR_KLARNA_USER>
KLARNA_PASSWORD=<YOUR_KLARNA_PASSWORD>
KLARNA_TERMS_URL=<YOUR_KLARNA_TERMS_URL>
KLARNA_CHECKOUT_URL=<YOUR_KLARNA_CHECKOUT_URL>
KLARNA_CONFIRMATION_URL=<YOUR_KLARNA_CONFIRMATION_URL>
```

Where:

- `<YOUR_KLARNA_BACKEND_URL>` is your Klarna URL.
- `<YOUR_KLARNA_URL>` is the [base Klarna URL based on your environment](https://docs.klarna.com/api/api-urls/).
- `<YOUR_KLARNA_USER>` and `<YOUR_KLARNA_PASSWORD>` are your [API credentials](https://docs.klarna.com/api/authentication/).
- `<YOUR_KLARNA_TERMS_URL>`, `<YOUR_KLARNA_CHECKOUT_URL>`, and `<YOUR_KLARNA_CONFIRMATION_URL>` are the terms, checkout, and confirmation URL of your Klarna account.

Finally, in `medusa-config.js`, add the Klarna plugin to the `plugins` array with the necessary configurations:

```jsx title=medusa-config.js
const plugins = [
  //other plugins...
  {
    resolve: `medusa-payment-klarnal`,
    options: {
      backend_url: process.env.KLARNA_BACKEND_URL
      url: process.env.KLARNA_URL,
      user: process.env.KLARNA_USER,
      password: process.env.KLARNA_PASSWORD,
      merchant_urls: {
        terms: process.env.KLARNA_TERMS_URL,
        checkout: process.env.KLARNA_CHECKOUT_URL,
        confirmation: process.env.KLARNA_CONFIRMATION_URL
      }
    }
  }
];
```

---

## Enable Klarna in Regions

To use Klarna in your store, you must enable it in at least one region.

You can follow [this user guide to learn how to enable a payment provider in a region](../user-guide/regions/providers#manage-payment-providers). You can alternatively use the [REST APIs](/api/admin/#tag/Region/operation/PostRegionsRegionPaymentProviders).

---

## See Also

- Check out [more plugins](https://github.com/medusajs/medusa/tree/master/packages) you can add to your store.
