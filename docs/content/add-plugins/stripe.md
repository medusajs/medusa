# Stripe

This document guides you through setting up Stripe payments in your Medusa server, admin, and storefront using the [Stripe Plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-stripe).

## Video Guide

You can also follow our video guide to learn how the setup works:

<div>
  <video width="100%" height="100%" playsinline autoplay muted controls>
    <source src="https://user-images.githubusercontent.com/59018053/154807206-6fbda0a6-bf3e-4e39-9fc2-f11710afe0b9.mp4" type="video/mp4" />
  </video>
</div>

## Overview

[Stripe](https://stripe.com/) is a battle-tested and unified platform for transaction handling. Stripe supplies you with the technical components needed to handle transactions safely and all the analytical features necessary to gain insight into your sales. These features are also available in a safe test environment which allows for a concern-free development process.

Using the `medusa-payment-stripe` plugin, this guide shows you how to set up your Medusa project with Stripe as a payment provider.

## Prerequisites

Before you proceed with this guide, make sure you create a [Stripe account](https://stripe.com). You’ll later retrieve the API Keys and secrets from your account to connect Medusa to your Stripe account.

## Medusa Server

This section guides you over the steps necessary to add Stripe as a payment provider to your Medusa server.

If you don’t have a Medusa server installed yet, you must follow our [quickstart guide](../quickstart/quick-start) first.

### Install the Stripe Plugin

In the root of your Medusa server, run the following command to install the stripe plugin:

```bash npm2yarn
npm install medusa-payment-stripe
```

### Configure the Stripe Plugin

Next, you need to add configurations for your stripe plugin.

In `medusa-config.js` add the following at the end of the `plugins` array:

```jsx
const plugins = [
  ...,
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
];
```

:::note

You might find that this code is already available but commented out. You can proceed with removing the comments instead of adding the code again, but make sure to replace `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` with `process.env.STRIPE_API_KEY` and `process.env.STRIPE_WEBHOOK_SECRET` respectively.

:::

The Stripe plugin uses 2 configuration options. The `api_key` is essential to both your development and production environments. As for the `webhook_secret`, it’s essential for your production environment. So, if you’re only using Stripe for development you can skip adding the value for this option at the moment.

### Retrieve Stripe's Keys

On the [dashboard](https://dashboard.stripe.com) of your Stripe account click on the Developers link at the top right. This will take you to the developer dashboard.

You’ll first retrieve the API key. You can find it by choosing API Keys from the sidebar and copying the Secret key.

Next, you need to add the key to your environment variables. In your Medusa server, create `.env` if it doesn’t already exist and add the Stripe key:

```jsx
STRIPE_API_KEY=sk_...
```

:::note

If you store environment variables differently on your server, for example, using the hosting provider’s UI, then you don’t need to add it in `.env`. Add the environment variables in a way relevant to your server.

:::

Next, if you’re installing this plugin for production use, you need to retrieve the Webhook secret. Webhooks allows you to track different events on your Medusa server, such as failed payments.

Go to Webhooks on Stripe’s developer dashboard. Then, choose the Add an Endpoint button.

The endpoint for Stripe’s webhook on your Medusa server is `{SERVER_URL}/stripe/hooks`. So, add that endpoint in its field. Make sure to replace `{SERVER_URL}` with the URL to your server.

Then, you can add a description. You must select at least one event to listen to. Once you’re done, click “Add endpoint”.

After the Webhook is created, you’ll see "Signing secret" in the Webhook details. Click on "Reveal" to reveal the secret key. Copy that key and in your Medusa server add the Webhook secret environment variable:

```jsx
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Admin Setup

This section will guide you through adding Stripe as a payment provider in a region using your Medusa admin dashboard.

This step is required for you to be able to use Stripe as a payment provider in your storefront.

### Admin Prerequisites

If you don’t have a Medusa admin installed, make sure to follow along with [the guide on how to install it](https://github.com/medusajs/admin#-quickstart) before continuing with this section.

### Add Stripe to Regions

First, make sure that both your Medusa server and Medusa Admin are running.

Then, in your Medusa Admin, log in and choose Settings from the Sidebar. Then, choose Regions.

![Settings](https://i.imgur.com/wRkmbLY.png)

Then, choose the regions you want to add Stripe as a payment provider. In the right-side settings, scroll down to “Payment Providers” and choose Stripe.

![Choose Stripe](https://i.imgur.com/FH5vgWh.png)

Once you’re done, click Save. Stripe is now a payment provider in your store in the regions you selected.

## Storefront Setup

This guide will take you through how to set up Stripe payments in your Medusa storefront. It includes the steps necessary when using one of Medusa’s official storefronts as well as your own custom React-based storefront.

### Storefront Prerequisites

All storefronts require that you obtain your Stripe’s Publishable Key. You can retrieve it from your Stripe’s developer dashboard by choosing API Keys and then copying the Publishable Key.

### Add to Next.js Storefront

Medusa has a Next.js storefront that you can easily use with your Medusa server. If you don’t have the storefront installed, you can follow [this quickstart guide](../starters/nextjs-medusa-starter).

In your `.env.local` file (or the file you’re using for your environment variables), add the following variable:

```bash
NEXT_PUBLIC_STRIPE_KEY=<YOUR_PUBLISHABLE_KEY>
```

Make sure to replace `<YOUR_PUBLISHABLE_KEY>` with your Stripe Publishable Key.

Now, if you run your Medusa server and your storefront, on checkout you’ll be able to use Stripe.

![Next.js Stripe Form](https://i.imgur.com/h5mWdJT.png)

### Add to Gatsby Storefront

Medusa also has a Gatsby storefront that you can use as your ecommerce store. If you don’t have the storefront installed, you can follow [this quickstart guide](../starters/gatsby-medusa-starter).

In your `.env.development` file (or the file you’re using for your environment variables) add the following variable with the value set to the Publishable Key:

```jsx
GATSBY_STRIPE_KEY=pk_
```

:::note

You might find this environment variable already available so you can just replace its value with your Publishable Key.

:::

Now, if you run your Medusa server and your storefront, on checkout you’ll be able to use Stripe.

![Gatsby Stripe Form](https://i.imgur.com/1XvW776.png)

### Add to Custom Storefront

This section will go over how to add Stripe into a React-based framework. The instructions are general instructions that you can use in your storefront.

#### Workflow Overview

The integration with stripe must have the following workflow:

1. During checkout when the user reaches the payment section, you should [create payment sessions](https://docs.medusajs.com/api/store/cart/initialize-payment-sessions). This will initialize the `payment_sessions` array in the `cart` object received. The `payment_sessions` is an array of available payment providers.
2. If Stripe is available as a payment provider, you should select Stripe as [the payment session](https://docs.medusajs.com/api/store/cart/select-a-payment-session) for the current cart. This will initialize the `payment_session` object in the `cart` object to include data related to Stripe and the current payment session. This includes the payment intent and client secret.
3. After the user enters their card details and submits the form, confirm the payment with Stripe.
4. If the payment is confirmed successfully, [complete the order](https://docs.medusajs.com/api/store/cart/complete-a-cart) in Medusa. Otherwise show an error.

#### Install Dependencies

Before you start the implementations you need to install the necessary dependencies. You’ll be using Stripe’s React libraries to show the UI and handle the payment confirmation:

```bash npm2yarn
npm install --save @stripe/react-stripe-js @stripe/stripe-js
```

You’ll also use Medusa’s JS Client to easily call Medusa’s REST APIs:

```bash npm2yarn
npm install @medusajs/medusa-js
```

#### Initialize Stripe

In this section, you’ll initialize Stripe without Medusa’s checkout workflow. Please note that this is one approach to add Stripe into your React project. You can check out [Stripe’s React documentation](https://stripe.com/docs/stripe-js/react) for other methods or components.

Create a container component that will hold the payment card component:

```jsx
import { useState } from 'react';

import {Elements} from '@stripe/react-stripe-js';
import Form from './Form';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_...');

export default function Container() {
  const [clientSecret, setClientSecret] = useState()

  //TODO set clientSecret

  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{
          clientSecret
        }}>
        <Form clientSecret={clientSecret} cartId={cartId} />
      </Elements>
      )}
    </div>
  );
};
```

In this component, you need to use Stripe’s `loadStripe` function outside of the component’s implementation to ensure that Stripe doesn’t re-load with every change. The function accepts the Publishable Key.

:::note

You’ll probably store this Publishable Key in an environment variable depending on your framework. It’s hard-coded here for simplicity.

:::

Then, inside the component’s implementation, you add a state variable `clientSecret` which you’ll retrieve in the next section. 

Once the clientSecret is set, the `Elements` Stripe component will wrap a `Form` component you’ll create next. This is necessary because the `Elements` component allows child elements to get access to the card’s inputs and their data using Stripe’s `useElements` hook.

Create a new file for the `Form` component with the following content:

```jsx
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';

export default function Form({clientSecret, cartId}) {
  const stripe = useStripe();
  const elements = useElements();

  async function handlePayment(e) {
    e.preventDefault()
    //TODO handle payment
  }

  return (
    <form>
      <CardElement />
      <button onClick={handlePayment}>Submit</button>
  </form>
  );
};
```

This component shows a CardElement component from Stripe’s React library. You can use `stripe` to be able to confirm the payment later. The `elements` variable will be used to retrieve the entered card details safely.

#### Implement the Workflow

You’ll now implement the workflow explained earlier. You’ll use Medusa’s JS Client, so make sure to import it and initialize it in your `Container` component:

```jsx
import Medusa from "@medusajs/medusa-js"

export default function Container() {
  const client = new Medusa();
  ...
}
```

:::note

In your storefront, you’ll probably be managing the Medusa client through a context for better performance.

:::

Then, in the place of the `//TODO` inside the `Container` element, initialize the payment sessions and create a payment session if Stripe is available:

```jsx
client.carts.createPaymentSessions(cart.id)
  .then(({cart}) => {
    //check if stripe is selected
    const isStripeAvailable = cart.payment_sessions?.some((session) => session.provider_id === 'stripe');
    if (!isStripeAvailable) {
      return;
    }

    //select stripe payment session
    client.carts.setPaymentSession(cart.id, {
      provider_id: 'stripe'
    }).then(({cart}) => {
      setClientSecret(cart.payment_session.data.client_secret);
    });
  })
```

:::note

Notice that here it’s assumed you have access to the `cart` object throughout your storefront. Ideally, the `cart` should be managed through a context. So, every time the cart is updated, for example, when the `createPaymentSessions` or `setPaymentSession` are called, the cart should be updated in the context to be accessed from other elements. In this case, you probably wouldn’t need a `clientSecret` state variable as you can use the client secret directly from the `cart` object.

:::

Once the client secret is set, the form will be shown to the user.

The last step in the workflow is confirming the payment with Stripe and if it’s done successfully, completing the user’s order. This part is done in the `Form` component.

As you’ll use Medusa’s client again make sure to import it and initialize it:

```jsx
import Medusa from "@medusajs/medusa-js"

export default function Form() {
  const client = new Medusa();
  ...
}
```

Then, replace the `//TODO` in the `handlePayment` function with the following content:

```jsx
return stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: {
      name,
      email,
      phone,
      address: {
        city,
        country,
        line1,
        line2,
        postal_code,
      }
    }
  }
}).then(({ error, paymentIntent }) => {
  //TODO handle errors
  client.carts.complete(cartId).then(resp => console.log(resp))
})
```

You use the `confirmCardPayment` method in the `stripe` object. You’ll need to pass it the client secret, which you can have access to from the cart object if it’s available through the context.

This method also requires the customer’s information like `name`, `email`, and their address. Make sure to place the values for each based on your implementation.

Once the promise resolves you can handle the errors, if there are any. If not, you can complete the customer’s order using `complete` from Medusa’s client. This request expects the cart ID which you should have access to as well.

If you run your server and storefront now, you’ll see the Stripe UI element and you’ll be able to make orders.

![Stripe Form](https://i.imgur.com/NOi8THw.png)

## Capture Payments

After the customer places an order, you’ll be able to see the order on the admin panel. In the payment information under the “Payment” section, you should see a “Capture” button.

![Capture Payment](https://i.imgur.com/Iz55PVZ.png)

Clicking this button allows you to capture the payment for an order. You can also refund payments if an order has captured payments.

Refunding or Capturing payments is reflected in your Stripe’s dashboard as well. This gives you access to all of Stripe’s analytical capabilities.

## What’s Next 🚀

- Check out [more plugins](https://github.com/medusajs/medusa/tree/master/packages) you can add to your store.
