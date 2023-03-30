---
description: 'Learn how to create a payment processor in the Medusa. This guide explains the different methods available in a payment processor.'
addHowToData: true
---

# How to Create a Payment Processor

In this document, you’ll learn how to create a Payment Processor in your Medusa backend. If you’re unfamiliar with the Payment architecture in Medusa, make sure to check out the [overview](../payment.md) first.

:::note

Before v1.8 of Medusa, this guide explained how to create a payment provider. Payment Providers are now considered legacy and are deprecated. Moving forward, it's recommended to create a Payment Processor that implements the Payment Processor API.

:::

## Overview

A Payment Processor is the payment method used to authorize, capture, and refund payment, among other actions. An example of a Payment Processor is Stripe.

By default, Medusa has a [manual payment provider](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-manual) that has minimal implementation. It can be synonymous with a Cash on Delivery payment method. It allows store operators to manage the payment themselves but still keep track of its different stages on Medusa.

Adding a Payment Processor is as simple as creating a [service](../../../development/services/create-service.md) file in `src/services`. A Payment Processor is essentially a service that extends `AbstractPaymentProcessor` from the core Medusa package `@medusajs/medusa`.

Payment Processor Services must have a static property `identifier`. It's the name that will be used to install and refer to the Payment Processor in the Medusa backend.

:::tip

Payment Processors are loaded and installed at the server startup. If not already saved, they're saved in the database and are represented by the `PaymentProvider` entity.

:::

The Payment Processor is also required to implement the following methods:

1. `initiatePayment`: Called when a Payment Session for the Payment Provider is to be created.
2. `retrievePayment`: Used to retrieve payment session data, which can be retrieved from a third-party provider.
3. `getPaymentStatus`: Used to get the status of a Payment or Payment Session.
4. `updatePayment`: Used to update the Payment Session whenever the cart and its related data are updated.
5. `deletePayment`: Used to perform any action necessary before a Payment Session is deleted. For example, you can cancel the payment with the third-party provider.
6. `authorizePayment`: Used to authorize the payment amount of the cart before the order or swap is created.
7. `capturePayment`: Used to capture the payment amount of an order or swap.
8. `refundPayment`: Used to refund a payment amount of an order or swap.
9. `cancelPayment`: Used to perform any necessary action with the third-party payment provider when an order or swap is canceled.

:::note

All these methods must be declared async in the Payment Processor.

:::

These methods are used at different points in the Checkout flow as well as when processing the order after it’s placed.

![Checkout Flow - Payment](https://res.cloudinary.com/dza7lstvk/image/upload/v1680177820/Medusa%20Docs/Diagrams/checkout-payment_cy9efp.jpg)

---

## Create a Payment Processor

The first step to create a payment processor is to create a JavaScript or TypeScript file in `src/services`. The file's name should be the name of the payment processor, and it should be in snake case.

For example, create the file `src/services/my-payment-processor.ts` with the following content:

```ts title=src/services/my-payment-processor.ts
import { 
  AbstractPaymentProcessor, 
  PaymentProcessorContext, 
  PaymentProcessorError, 
  PaymentProcessorSessionResponse, 
  PaymentSessionStatus,
} from "@medusajs/medusa"

class MyPaymentProcessor extends AbstractPaymentProcessor {
  static identifier = "my-payment"

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.")
  }
  async authorizePayment(
    paymentSessionData: Record<string, unknown>, 
    context: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | 
    { 
      status: PaymentSessionStatus; 
      data: Record<string, unknown>; 
    }
  > {
    throw new Error("Method not implemented.")
  }
  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.")
  }
  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse
  > {
    throw new Error("Method not implemented.")
  }
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.")
  }
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.")
  }
  async refundPayment(
    paymentSessionData: Record<string, unknown>, 
    refundAmount: number
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.")
  }
  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.")
  }
  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<
    void | 
    PaymentProcessorError | 
    PaymentProcessorSessionResponse
  > {
    throw new Error("Method not implemented.")
  }
}

export default MyPaymentProcessor
```

Where `MyPaymentProcessor` is the name of your Payment Processor service.

Payment Processors must extend `AbstractPaymentProcessor` from the core Medusa package `@medusajs/medusa`.

:::tip

Following the naming convention of Services, the name of the file should be the slug name of the Payment Processor, and the name of the class should be the camel case name of the Payment Processors suffixed with “Service”. In the example above, the name of the file should be `my-payment.ts`. You can learn more in the [service documentation](../../../development/services/create-service.md).

:::

### identifier

As mentioned in the overview, Payment Processors should have a static `identifier` property.

The `PaymentProvider` entity has 2 properties: `identifier` and `is_installed`. The value of the `identifier` property in the class will be used when the Payment Processor is created in the database.

The value of this property will also be used to reference the Payment Processor throughout the Medusa backend. For example, the identifier is used when a [Payment Session in a cart is selected on checkout](/api/store/#tag/Cart/operation/PostCartsCartPaymentSession).

The identifier can be retrieved using the `getIdentifier` method, which is defined in `AbstractPaymentProcessor`.

### constructor

You can use the `constructor` of your Payment Processor to have access to different services in Medusa through [dependency injection](../../../development/fundamentals/dependency-injection.md).

You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.

Additionally, if you’re creating your Payment Processor as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor. The options are passed as a second parameter:

```ts
class MyPaymentService extends AbstractPaymentService {
  // ...
  constructor(container, options) {
    super(container)
    // you can access options here
  }
  // ...
}
```

### PaymentProcessorError

Before diving into the methods you'll need to implement, you'll notice that part of the expected return signature of these method includes `PaymentProcessorError`. This is an interface of the following definition:

```ts
interface PaymentProcessorError {
  error: string
  code?: string
  detail?: any
}
```

While implementing the following methods, if you need to inform the Medusa core that an error occurred at a certain stage, return an object having the attributes defined in the `PaymentProcessorError` interface.

For example, the Stripe payment processor has the following method to create the error object, which is used within other methods:

```ts
abstract class StripeBase extends AbstractPaymentProcessor {
  // ...
  protected buildError(
    message: string,
    e: Stripe.StripeRawError | PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : "detail" in e
        ? e.detail
        : e.message ?? "",
    }
  }

  // used in other methods
  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | 
    PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      // ...
    } catch (e) {
      return this.buildError(
        "An error occurred in retrievePayment",
        e
      )
    }
  }
}
```

### initiatePayment

This method is called either if a region has only one payment provider enabled or when [a Payment Session is selected](/api/store#tag/Cart/operation/PostCartsCartPaymentSession), which occurs when the customer selects their preferred payment method during checkout. It is used to allow you to make any necessary calls to the third-party provider to initialize the payment.

For example, in Stripe this method is used to create a Payment Intent for the customer.

The method receives a context object as a first parameter. This object is of type `PaymentProcessorContext` and has the following properties:

```ts
type PaymentProcessorContext = {
  billing_address?: Address | null
  email: string
  currency_code: string
  amount: number
  resource_id: string
  customer?: Customer
  context: Record<string, unknown>
  paymentSessionData: Record<string, unknown>
}
```

This method must return an object of type `PaymentProcessorSessionResponse`. It should have the following properties:

```ts
type PaymentProcessorSessionResponse = {
  update_requests?: { 
    customer_metadata?: Record<string, unknown>
  }
  session_data: Record<string, unknown>
}
```

Where:

- `session_data` is the data that is going to be stored in the `data` field of the Payment Session to be created. As mentioned in the [Architecture Overview](../payment.md), the `data` field is useful to hold any data required by the third-party provider to process the payment or retrieve its details at a later point.
- `update_requests` is an object that can be used to pass data from the Payment Processor plugin to the core to update internal resources. Currently, it only has one attribute `customer_metadata` which allows updating the `metadata` field of the customer.

An example of a minimal implementation of `initiatePayment`:

```ts
import { 
  PaymentContext, 
  PaymentSessionResponse,
} from "@medusajs/medusa"

class MyPaymentService extends AbstractPaymentService {
  // ...
  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse
  > {
    // prepare data
    return { 
      session_data,
      update_requests,
    }
  }
}
```

### retrievePayment

This method is used to provide a uniform way of retrieving the payment information from the third-party provider. For example, in Stripe’s Payment Processor this method is used to retrieve the payment intent details from Stripe.

This method accepts the `data` field of a Payment Session. So, you should make sure to store in the `data` field any necessary data that would allow you to retrieve the payment data from the third-party provider.

This method must return an object containing the data from the third-party provider.

An example of a minimal implementation of `retrievePayment` where you don’t need to interact with the third-party provider:

```ts
import { Data } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return {}
  }
}
```

### getPaymentStatus

This method is used to get the status of a Payment or a Payment Session. 

Its main usage is in the place order and create swap workflows. If the status returned is not `authorized`, then the payment is considered failed and an error will be thrown, stopping the task from completion.

This method accepts the `data` field of a Payment as a parameter. You can use this data to interact with the third-party provider to check the status of the payment if necessary.

This method returns a string that represents the status. This string can be from the enum `PaymentSessionStatus` which can be imported from `@medusajs/medusa`. The status must be one of the following values:

1. `authorized`: The payment was successfully authorized.
2. `pending`: The payment is still pending. This is the default status of a Payment Session.
3. `requires_more`: The payment requires more actions from the customer. For example, if the customer must complete a 3DS check before the payment is authorized.
4. `error`: If an error occurred with the payment.
5. `canceled`: If the payment was canceled.

An example of a minimal implementation of `getPaymentStatus` where you don’t need to interact with the third-party provider:

```ts
import { Data, PaymentSessionStatus } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    return PaymentSessionStatus.AUTHORIZED
  }
}
```

### updatePayment

This method is used to perform any necessary updates on the payment. This method is called whenever the cart or any of its related data is updated. For example, when a [line item is added to the cart](/api/store/#tag/Cart/operation/PostCartsCartLineItems) or when a [shipping method is selected](/api/store/#tag/Cart/operation/PostCartsCartShippingMethod).

:::tip

A line item refers to a product in the cart.

:::

It accepts the `data` field of the Payment Session as the first parameter and a context object as a second parameter. This object is of type `PaymentProcessorContext` and has the following properties:

```ts
type PaymentProcessorContext = {
  billing_address?: Address | null
  email: string
  currency_code: string
  amount: number
  resource_id: string
  customer?: Customer
  context: Record<string, unknown>
  paymentSessionData: Record<string, unknown>
}
```

You can utilize this method to interact with the third-party provider and update any details regarding the payment if necessary.

This method must return an object of type `PaymentSessionResponse`. It should have the following properties:

```ts
type PaymentProcessorSessionResponse = {
  update_requests?: { 
    customer_metadata?: Record<string, unknown> 
  }
  session_data: Record<string, unknown>
}
```

These are the same fields explained in the [initiatePayment](#initiatepayment) section.

An example of a minimal implementation of `updatePayment`:

```ts
import { 
  PaymentSessionData, 
  Cart, 
  PaymentContext, 
  PaymentSessionResponse,
} from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<
    void | 
    PaymentProcessorError | 
    PaymentProcessorSessionResponse
  > {
    // prepare data
    return {
      session_data,
      update_requests,
    }
  }
}
```

### deletePayment

This method is used to perform any actions necessary before a Payment Session is deleted. The Payment Session is deleted in one of the following cases:

1. When a request is sent to [delete the Payment Session](/api/store/#tag/Cart/operation/DeleteCartsCartPaymentSessionsSession).
2. When the [Payment Session is refreshed](/api/store/#tag/Cart/operation/PostCartsCartPaymentSessionsSession). The Payment Session is deleted so that a newer one is initialized instead.
3. When the Payment Processor is no longer available. This generally happens when the store operator removes it from the available Payment Processor in the admin.
4. When the region of the store is changed based on the cart information and the Payment Processor is not available in the new region.

It accepts the `data` field of the payment session for its first parameter.

You can use this method to interact with the third-party provider to delete data related to the Payment Session if necessary.

An example of a minimal implementation of `deletePayment` where no interaction with a third-party provider is required:

```ts
import { PaymentSession } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return paymentSessionData
  }
}
```

### authorizePayment

This method is used to authorize payment using the Payment Session of an order. This is called when the [cart is completed](/api/store/#tag/Cart/operation/PostCartsCartComplete) and before the order is created.

This method is also used for authorizing payments of a swap of an order and when authorizing sessions in a payment collection.

The payment authorization might require additional action from the customer before it is declared authorized. Once that additional action is performed, the `authorizePayment` method will be called again to validate that the payment is now fully authorized. So, you should make sure to implement it for this case as well, if necessary.

Once the payment is authorized successfully and the Payment Session status is set to `authorized`, the order can then be placed.

If the payment authorization fails, then an error will be thrown and the order will not be created.

:::note

The payment authorization status is determined using the `getPaymentStatus` method as mentioned earlier. If the status is `requires_more` then it means additional actions are required from the customer. If the workflow process reaches the “Start Create Order” step and the status is not `authorized`, then the payment is considered failed.

:::

This method accepts the `data` field of a payment session for its first parameter, and a `context` object as a second parameter. The `context` object may contain the following properties:

1. `ip`: The customer’s IP.
2. `idempotency_key`: The [Idempotency Key](../payment.md#idempotency-key) that is associated with the current cart. It is useful when retrying payments, retrying checkout at a failed point, or for payments that require additional actions from the customer.
3. `cart_id`: The ID of a cart. This is only during operations like placing an order or creating a swap.

This method must return an object containing the following properties:

- `status` which is a string that indicates the current status of the payment.
- `data` which is an object containing any additional information required to perform additional payment processing such as capturing the payment. The values of both of these properties are stored in the Payment Session’s `status` and `data` fields respectively.

You can utilize this method to interact with the third-party provider and perform any actions necessary to authorize the payment.

An example of a minimal implementation of `authorizePayment` that doesn’t need to interact with any third-party provider:

```ts
import { 
  Data, 
  PaymentSession, 
  PaymentSessionStatus, 
  PaymentSessionData,
} from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async authorizePayment(
    paymentSessionData: Record<string, unknown>, 
    context: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | 
    { 
      status: PaymentSessionStatus; 
      data: Record<string, unknown>; 
    }
  > {
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: {
        id: "test",
      },
    }
  }
}
```

### capturePayment

This method is used to capture the payment amount of an order. This is typically triggered manually by the store operator from the admin.

This method is also used for capturing payments of a swap of an order, or when the [Capture Payment](/api/admin#tag/Payment/operation/PostPaymentsPaymentCapture) endpoint is called.

You can utilize this method to interact with the third-party provider and perform any actions necessary to capture the payment.

This method accepts the `data` field of the Payment for its first parameter.

This method must return an object that will be stored in the `data` field of the Payment.

An example of a minimal implementation of `capturePayment` that doesn’t need to interact with a third-party provider:

```ts
import { Data, Payment } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async capturePayment(payment: Payment): Promise<Data> {
    return {
      status: "captured",
    }
  }
}
```

### refundPayment

This method is used to refund an order’s payment. This is typically triggered manually by the store operator from the admin. The refund amount might be the total order amount or part of it.

This method is also used for refunding payments of a swap or a claim of an order, or when the [Refund Payment](/api/admin#tag/Payment/operation/PostPaymentsPaymentRefunds) endpoint is called.

You can utilize this method to interact with the third-party provider and perform any actions necessary to refund the payment.

This method accepts the `data` field of a Payment for its first parameter, and the amount to refund as a second parameter.

This method must return an object that is stored in the `data` field of the Payment.

An example of a minimal implementation of `refundPayment` that doesn’t need to interact with a third-party provider:

```ts
import { Data, Payment } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async refundPayment(
    paymentSessionData: Record<string, unknown>, 
    refundAmount: number
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return {
      id: "test",
    }
  }
}
```

### cancelPayment

This method is used to cancel an order’s payment. This method is typically triggered by one of the following situations:

1. Before an order is placed and after the payment is authorized, an inventory check is done on products to ensure that products are still available for purchase. If the inventory check fails for any of the products, the payment is canceled.
2. If the store operator cancels the order from the admin.
3. When the payment of an order's swap is canceled.

You can utilize this method to interact with the third-party provider and perform any actions necessary to cancel the payment.

This method accepts the `data` field of the Payment for its first parameter.

An example of a minimal implementation of `cancelPayment` that doesn’t need to interact with a third-party provider:

```ts
import { Data, Payment } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return {
      id: "test",
    }
  }
}
```

---

## See Also

- Implementation Examples: [Stripe](https://github.com/medusajs/medusa/tree/2e6622ec5d0ae19d1782e583e099000f0a93b051/packages/medusa-payment-stripe) and [PayPal](https://github.com/medusajs/medusa/tree/2e6622ec5d0ae19d1782e583e099000f0a93b051/packages/medusa-payment-paypal) Payment Processors.
- [Implement checkout flow on the storefront](../storefront/implement-checkout-flow.mdx).
