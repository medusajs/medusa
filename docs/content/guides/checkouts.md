# Checkouts
## Introduction
The purpose of this guide is to describe a checkout flow in Medusa. We assume that you've completed our [Quickstart](https://docs.medusa-commerce.com/quickstart/quick-start) or [Tutorial](https://docs.medusa-commerce.com/tutorial/set-up-your-development-environment) and are familiar with the technologies we use in our stack. Additionally, having an understanding of our [API](https://docs.medusa-commerce.com/api/store/auth) would serve as a great foundation for this walkthrough.
> All code snippets in the following guide, use our JS SDK distributed through **npm**. To use it, run `yarn add @medusajs/medusa-js` or `npm install @medusajs/medusa-js` in your Medusa project.
## Glossary
- **Cart**: An object containing all the information required in the checkout flow. We add items, discounts, shipping methods, payment sessions, customers, and potentially more to this object as we go through the checkout. Upon completion, we use the cart to create the order.
- **LineItem**: An object being added to the `items` of the cart with a quantity. Contains product or custom information.
- **PaymentSession**: An object representing a payment session for all payment providers (Stripe, Adyen, Paypal, etc.), that are installed in your Medusa project. Upon completion, we use the session to create a payment. In the `data` property of the session, we hold provider specific information.
- **ShippingMethod**: An object describing how and with whom the order will be sent. In the `data` property of the method, we hold provider specific information.
- **ShippingOption**: An object representing a way for the items to be sent. Upon selecting a shipping option for the cart, the ShippingMethod will be created.

## Checkout flow
To complete a checkout flow and create an order from a cart, we go through the following flow.
> At this point, we assume that you've created a cart, selected your region, added items and are now at the initial step of the checkout flow.
#### Initializing the checkout
First step in the flow is to create all payment sessions (Stripe, PayPal, etc. ) for the cart.
```javascript=
const { cart } = await medusa.carts.createPaymentSessions("cart_id")
```
This will create sessions for all the providers installed in your project and attach them to your cart. In the case of Stripe, the `data` of a session would contain a [Stripe PaymentIntent](https://stripe.com/docs/api/payment_intents). 
#### Adding customer information
After initializing the checkout flow, you would typically have one big step or several smaller steps for gathering user information; email, address, country, and more. All is added to the cart.
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
This step is only applicable, if you have multiple payment sessions installed in your project, since we pre-select a session if only one exist.
```javascript=
const { cart } = await medusa.carts.setPaymentSession("cart_id", {
    provider_id: "stripe"
})
```

#### Choosing a shipping method
Before reaching the payment step, you would typically require the customer to choose a shipping method from a number of options. We retrieve the applicable shipping options using information from the cart. 
```javascript=
const { shipping_options } = await medusa.carts.listCartOptions("cart_id")
```
To find the applicable options, we perform the following validation as part of the retrieval:
- Only fetch options defined in the region of the cart
- Ensure that potential shipping option requirements are respected.
    - E.g. free shipping limit

Choosing a shipping option, will create a shipping method and attach it to the cart. The second argument to the function in the snippet below holds the id of the selected option.
```javascript=
const { shipping_options } = await medusa.carts.addShippingMethod("cart_id", { option_id: "option_id"})
```

#### Collecting payment details
Payment information is not handled by Medusa. You should always use a client library for capturing this type of data.
The following snippet shows, how we use Stripe to collect payment details from the customer. Please note, that we are using the `client_secret` from the Stripe PaymentIntent in `data` on the payment session and this is required by Stripe.
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
After having collected the payment details, we are ready to finalize the checkout flow.

#### Completing the cart
When all relevant customer information has been captured, we can proceed to the final step; completing the cart. 
```javascript=
const { order } = await medusa.carts.complete("cart_id")
```
If all information was collected correctly throughout the checkout flow, we successfully create an order from the cart.
## Summary
You now have a solid foundation for creating your own checkout flows using Medusa. Throughout this guide, we've used Stripe as payment provider. Stripe is one of the most popular providers and we have an official plugin, that you can easily install in your project. Guide for setting this up, will come very soon.

## What's next?
See the checkout flow, explained in the previous sections, in one of our frontend starters:
- [Nextjs Starter](https://github.com/medusajs/nextjs-starter-medusa)
- [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)

