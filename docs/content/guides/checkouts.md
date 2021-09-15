---
title: Checkouts
---

# Checkouts

## Introduction
The purpose of this guide is to describe a checkout flow in Medusa. It is assumed that you've completed our [Quickstart](https://docs.medusa-commerce.com/quickstart/quick-start) or [Tutorial](https://docs.medusa-commerce.com/tutorial/set-up-your-development-environment) and are familiar with the technologies we use in our stack. Additionally, having an understanding of the [core API](https://docs.medusa-commerce.com/api/store/auth) would serve as a great foundation for this walkthrough.
> All code snippets in the following guide, use the JS SDK distributed through **npm**. To install it, run `yarn add @medusajs/medusa-js` or `npm install @medusajs/medusa-js`.

## Glossary
- **Cart**: The Cart contains all the information needed for customers to complete an Order. In the Cart customers gather the items they wish to purchase, they add shipping and billing details and complete payment information.
- **LineItem**: Line Items represent an expense added to a Cart. Typically this will be a Product Variant and a certain quantity of the same variant. Line Items hold descriptive fields that help communicate its contents and price.
- **PaymentSession**: A Payment Session is a Medusa abstraction that unifies the APIs of multiple payment gateways. Payment Sessions are _initialized_ when the customer begins a checkout and are _authorized_ prior to an Order being placed. Payment Sessions are created based on the available Payment Providers configured in a Cart's region.
- **ShippingOption**: A Shipping Option represents a way in which an Order can be fulfilled. Shipping Options have a price and are associated with a Fulfillment Provider that will handle the shipment later in the Order flow. Once a customer selects a Shipping Option it becomes a Shipping Method.
- **ShippingMethod**: Shipping Methods are unique to each Cart and can thereby hold either overwrites for fields in a Shipping Option (e.g. price) or additional details (e.g. an id representing a parcel pickup location).

## Checkout flow
To create an order from a cart, we go through the following flow.
> At this point, it assumed that the customer has created a cart, added items and is now at the initial step of the checkout flow.

#### Initializing the checkout
The first step in the flow is to _initialize_ the configured Payment Sessions for the Cart. If you are using the `medusa-starter-default` starter, this call will result in the `cart.payment_sessions` array being filled with one Payment Session for the manual payment provider.

```javascript=
const { cart } = await medusa.carts.createPaymentSessions("cart_id")
```

To give a more real life example, it is assumed that `medusa-payment-stripe` is installed in your project in which case the call will result in a [Stripe PaymentIntent](https://stripe.com/docs/api/payment_intents) being created. The unique provider data for each Payment Session can be found in the Payment Session's `data` field; this data can be used in front end implementations e.g. if using Stripe Elements the `client_secret` can be retrieved through `session.data.client_secret`.

#### Adding customer information
After initializing the checkout flow, you would typically have one big step or several smaller steps for gathering user information; email, address, country, and more. To store this data you may update the cart with each of field or all fields at the same time.

```javascript=
const { cart } = await medusa.carts.update("cart_id", {
    email: "lebron@james.com",
    shipping_address: {
        first_name: "",
        last_name: "",
        ...
    }
})
```

#### Selecting payment provider
This step is only applicable, if you have multiple Payment Sessions installed in your project. In cases where only one Payment Provider is configured the Payment Session will be preselected. In all other cases your implementations should call:

```javascript=
const { cart } = await medusa.carts.setPaymentSession("cart_id", {
    provider_id: "stripe"
})
```

#### Choosing a shipping method
Before reaching the payment step, you would typically require the customer to choose a Shipping Method from a number of options. In Medusa you can set rules that must be met for a Shipping Option to be available for a Cart. To get the available shipping options for a Cart you should call:
```javascript=
const { shipping_options } = await medusa.carts.listCartOptions("cart_id")
```

Choosing a Shipping Option, will create a Shipping Method and attach it to the Cart. The second argument to the function in the snippet below holds the id of the selected option.
```javascript=
const { cart } = await medusa.carts.addShippingMethod("cart_id", { option_id: "option_id"})
```

#### Collecting payment details
The following snippet shows, how we use Stripe to collect payment details from the customer. Note that we are using the `client_secret` from the Stripe PaymentIntent in `data` on the payment session as this is required by Stripe Elements.
```javascript=
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

...

const stripe = useStripe();
const elements = useElements();


const handleSubmit = () => {
    ...
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      cart.payment_session.data.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );
    ...
}

return <CardElement id="card-element" />
```
After collecting the payment details, the customer can complete the checkout flow.

#### Completing the cart
When all relevant customer information has been captured, your implementation should proceed to the final step; completing the cart. 
```javascript=
const { order } = await medusa.carts.complete("cart_id")
```
If all information is collected correctly throughout the checkout flow, the call will place an Order based on the details gathered in the Cart.

## Summary
You now have a solid foundation for creating your own checkout flows using Medusa. Throughout this guide, we've used Stripe as a Payment Provider. Stripe is one of the most popular providers and we have an official plugin, that you can easily install in your project.

## What's next?
See the checkout flow, explained in the previous sections, in one of our frontend starters:
- [Nextjs Starter](https://github.com/medusajs/nextjs-starter-medusa)
- [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)

