# How to Handle Order Claim Event

In this document, you’ll learn how to handle the order claim event and send a confirmation email when the event is triggered.

## Overview

When a guest customer places an order, the order is not associated with a customer. It is associated with an email address.

After the customer registers, later on, they can claim that order by providing the order’s ID.

When the customer requests to claim the order, the event `order-update-token.created` is triggered on the Medusa server. This event should be used to send the customer a confirmation email.

### What You’ll Learn

In this document, you’ll learn how to handle the `order-update-token.created` event on the server to send the customer a confirmation email.

## Prerequisites

### Medusa Components

It's assumed that you already have a Medusa server installed and set up. If not, you can follow the [quickstart guide](../../quickstart/quick-start.mdx) to get started.

### Redis

Redis is required for batch jobs to work. Make sure you [install Redis](../../tutorial/0-set-up-your-development-environment.mdx#redis) and [configure it with your Medusa server](../../usage/configurations.md#redis).

### Notification Provider

To send an email or another type of notification method, you must have a notification provider installed or configured.

This document has an example using the [SendGrid](../../add-plugins/sendgrid.mdx) plugin.

## Step 1: Create a Subscriber

To subscribe to and handle an event, you must create a subscriber.

:::tip

You can learn more about subscribers in the [Subscribers](../backend/subscribers/overview.md) documentation.

:::

Create the file `src/subscribers/claim-order.ts` with the following content:

```ts title=src/subscribers/claim-order.ts
import { EventBusService } from "@medusajs/medusa";

type InjectedDependencies = {
  eventBusService: EventBusService,
}

class ClaimOrderSubscriber {
  constructor({ eventBusService }: InjectedDependencies) {

  }
}

export default ClaimOrderSubscriber;
```

If you want to add any other dependencies, you can add them to the `InjectedDependencies` type.

:::tip

You can learn more about dependency injection in [this documentation](../backend/dependency-container/index.md).

:::

## Step 2: Subscribe to the Event

In the subscriber you created, add the following in the `constructor`:

```ts title=src/subscribers/claim-order.ts
constructor({ eventBusService }: InjectedDependencies) {
  eventBusService.subscribe("order-update-token.created", this.handleRequestClaimOrder);
}
```

You use the `eventBusService` to subscribe to the `order-update-token.created` event. You pass the method `handleRequestClaimOrder` as a handler to that event. You’ll create this method in the next step.

## Step 3: Create Event Handler

In the subscriber, add a new method `handleRequestClaimOrder`:

```ts title=src/subscribers/claim-order.ts
class ClaimOrderSubscriber {
  //...

  handleRequestClaimOrder = async (data) {
    //TODO: handle event
  }
}

export default ClaimOrderSubscriber;
```

The `handleRequestClaimOrder` event receives a `data` object as a parameter. This object holds the following properties:

1. `old_email`: The email associated with the orders.
2. `new_customer_id`: The ID of the customer claiming the orders.
3. `orders`: An array of the order IDs that the customer is requesting to claim.
4. `token`: A verification token. This token is used to later verify the claim request and associate the order with the customer.

In this method, you should typically send an email to the customer’s old email. In the email, you should link to a page in your storefront and pass the `token` as a parameter.

The page would then send a request to the server to verify that the `token` is valid and associate the order with the customer. You can read more about how to implement this in your storefront in [this documentation](../storefront/implement-claim-order.mdx).

## Example: Using SendGrid

For example, you can implement this subscriber to send emails using SendGrid:

```ts title=src/subscribers/claim-order.ts
import { EventBusService } from "@medusajs/medusa";

type InjectedDependencies = {
  eventBusService: EventBusService,
  sendgridService: any
}

class ClaimOrderSubscriber {
  protected sendGridService: any;

  constructor({ eventBusService, sendgridService }: InjectedDependencies) {
    this.sendGridService = sendgridService;
    eventBusService.subscribe("order-update-token.created", this.handleRequestClaimOrder);
  }

  
  handleRequestClaimOrder = async (data) => {
    this.sendGridService.sendEmail({
      templateId: 'order-claim-confirmation',
      from: 'hello@medusajs.com',
      to: data.old_email,
      data: {
        link: `http://example-storefront.com/confirm-order-claim/${data.token}`,
        //other data...
      }
    })
  }
}

export default ClaimOrderSubscriber;
```

Notice how the `token` is passed to the storefront link as a parameter.

## See Also

- Learn [how to implement claim-order flow in your storefront](../storefront/implement-claim-order.mdx).