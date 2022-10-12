# Payment Architecture Overview

In this document, you’ll learn about the payment architecture in Medusa, specifically its 3 main components and the idempotency key.

## Introduction

The payment architecture refers to all operations in an ecommerce store related to processing a customer’s payment. It includes the checkout flow and order handling including refunds and swaps.

In Medusa, there are 3 main components in the payment architecture: Payment Provider, Payment Session, and Payment.

1. A **Payment Provider** is a service or method used to capture, authorize, and refund payments, among other functionalities.
2. A **Payment Session** is a session associated with a cart and created during a customer’s checkout flow. It is controlled by the **Payment Provider** to authorize the payment and is used eventually to create a **Payment**.
3. A **Payment** is associated with an order and it represents the amount authorized for the purchase. It is used later for further payment operations such as capturing or refunding payments.

An important part in the Payment architecture to understand is the **Idempotency Key**. It’s a unique value that’s generated for a cart and is used to retry payments during checkout if they fail.

## Payment Provider

A Payment Provider in Medusa is a method to handle payments in selected regions. It is not associated with a cart, customer, or order in particular. It provides the necessary implementation to create Payment Sessions and Payments, as well as authorize and capture payments, among other functionalities.

Payment Providers can be integrated with third-party services that handle payment operations such as capturing a payment. An example of a Payment Provider is Stripe.

Payment Providers can also be related to a custom way of handling payment operations. An example of that is Cash on Delivery (COD) payment methods or Medusa’s [manual payment provider plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-manual) which provides a minimal implementation of a payment provider and allows store operators to manually handle order payments.

### How Payment Provider is Created

A Payment Provider is essentially a Medusa [service](../services/create-service.md) with a unique identifier, and it extends the ``AbstractPaymentService` from the core Medusa package `@medusajs/medusa`. It can be created as part of a [plugin](../plugins/overview.md), or it can be created just as a service file in your Medusa server.

As a developer, you will mainly work with the Payment Provider when integrating a payment method in Medusa.

When you run your Medusa server, the Payment Provider will be registered on your server if it hasn’t been already.

Once the Payment Provider is added to the server, the store operator will be able to choose on the [Medusa Admin](../../../admin/quickstart.md) the payment providers available in a region. These payment providers are shown to the customer at checkout to choose from and use.

:::caution

It’s important to choose a payment provider in the list of payment providers in a region, or else the payment provider cannot be used by customers on checkout.

:::

### PaymentProvider Entity Overview

The [`PaymentProvider`](../../../references/entities/classes/PaymentProvider.md) entity only has 2 attributes: `is_installed` to indicate if the payment provider is installed and its value is a boolean; and `id` which is the unique identifier that you define in the Payment Provider service.

## Payment Session

Payment Sessions are linked to a customer’s cart. Each Payment Session is associated with a payment provider that is available in the customer cart’s region.

They hold the status of the payment flow throughout the checkout process which can be used to indicate different statuses such as an authorized payment or payment that requires more actions from the customer.

After the checkout process is completed and the Payment Session has been authorized successfully, a Payment instance will be created to be associated with the customer’s order and will be used for further actions related to that order.

### How Payment Session is Created

After the customer adds products to the cart, proceeds with the checkout flow, and reaches the payment method section, Payment Sessions are created for each Payment Provider available in that region. 

During the creation of the Payment Session, the Payment Provider can interact with third-party services for any initialization necessary on their side. For example, when a Payment Session for Stripe is being created, a payment intent associated with the customer can be created with Stripe as well.

Payment Sessions can hold data that is necessary for the customer to complete their payment.

Among the Payment Sessions available only one will be selected based on the customer’s payment provider choice. For example, if the customer sees that they can pay with Stripe or PayPal and chooses Stripe, Stripe’s Payment Session will be the selected Payment Session of that cart.

### PaymentSession Entity Overview

The [`PaymentSession`](../../../references/entities/classes/PaymentSession.md) entity belongs to a `Cart`. This is the customer‘s cart that was used for checkout which lead to the creation of the Payment Session.

The `PaymentSession` also belongs to a `PaymentProvider`. This is the Payment Provider that was used to create the Payment Session and that controls it for further actions like authorizing the payment.

The `data` attribute is an object that holds any data required for the Payment Provider to perform payment operations like authorizing or capturing payment. For example, when a Stripe payment session is initialized, the `data` object will hold the payment intent among other data necessary to authorize the payment.

The `is_selected` attribute in the `PaymentSession` entity is a boolean value that indicates whether this Payment Session was selected by the customer to pay for their purchase. Going back to the previous example of having Stripe and PayPal as the available Payment Providers, when the customer chooses Stripe, Stripe’s Payment Session will have `is_selected` set to true whereas PayPal’s Payment Session will have `is_selected` set to false.

The `status` attributes indicates the current status of the Payment Session. It can be one of the following values:

- `authorized`: The payment has been authorized which means the order can be placed successfully.
- `pending`: The payment is still pending further actions. This is usually used when the payment session is initialized.
- `requires_more`: The payment requires additional actions from the customer before the payment can be authorized successfully and the order can be placed. An example of this is payment methods that require 3-D Secure checks.
- `error`: An error was encountered when an authorization was attempted. This status is usually used when an error has been encountered when authorizing the payment with a third-party payment provider.
- `canceled`: The payment has been canceled.

These statuses are important in the checkout flow to determine the current step the customer is at and which action should come next. For example, if there is an attempt to place the order but the status of the Payment Session is not `authorized`, an error will be thrown.

## Payment

A Payment is used to represent the amount authorized for a customer’s purchase. It is associated with the order placed by the customer and will be used after that for all operations related to the order’s payment such as capturing or refunding the payment.

Payments are generally created using data from the Payment Session and it holds any data that can be necessary to perform later payment operations.

### How Payment is Created

Once the customer completes their purchase and the payment has been authorized, a Payment instance will be created from the Payment Session. The Payment is associated first with the cart and then with the order once it’s created and placed.

When the store operator then chooses to capture the order from the Medusa Admin, the Payment is used by the Payment Provider to capture the payment. This is the same case for refunding the amount, canceling the order, or creating a swap.

### Payment Entity Overview

The [`Payment`](../../../references/entities/classes/Payment.md) entity belongs to the `Cart` that it was originally created from when the customer’s payment was authorized. It also belongs to an `Order` once it’s placed. Additionally, it belongs to a `PaymentProvider` which is the payment provider that the customer chose on checkout.

In case a `Swap` is created for an order, `Payment` will be associated with that swap to handle payment operations related to it.

Similar to `PaymentSession`,  `Payment` has a `data` attribute which is an object that holds any data required to perform further actions with the payment such as capturing the payment.

`Payment` also holds attributes like `amount` which is the amount authorized for payment, and `amount_refunded` which is the amount refunded from the original amount if a refund has been initiated.

Additionally, `Payment` has the `captured_at` date-time attribute which is filled when the payment has been captured, and a `canceled_at` date-time attribute which is filled when the order has been canceled.

## Idempotency Key

An Idempotency Key is a unique key associated with a cart. It is generated at the last step of checkout before authorization of the payment is attempted.

That Idempotency Key is then set in the header under the `Idempotency-Key` response header field along with the header field `Access-Control-Expose-Headers` set to `Idempotency-Key`.

If an error occurs or the purchase is interrupted at any step, the client can retry the payment by adding the Idempotency Key of the cart as the `Idempotency-Key` header field in their subsequent requests. 

The server wraps each essential part of the checkout completion in its own step and stores the current step of checkout with its associated Idempotency Key. 

If then the request is interrupted for any reason or the payment fails, the client can retry completing the check out using the Idempotency Key, and the flow will continue from the last stored step.

This prevents any payment issues from occurring with the customers and allows for secure retries of failed payments or interrupted connections.

## What’s Next

- [Check out how the checkout flow is implemented on the frontend.](./../../storefront/how-to-implement-checkout-flow.mdx)
- Check out payment plugins like [Stripe](../../../add-plugins/stripe.md), [Paypal](/add-plugins/paypal), and [Klarna](../../../add-plugins/klarna.md).
