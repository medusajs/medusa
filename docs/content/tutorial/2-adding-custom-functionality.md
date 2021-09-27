---
title: 2. Adding custom functionality
---

# Adding custom functionality

## Introduction

In the previous part of the tutorial we set up your Medusa project using the `medusa new` and started your Medusa server locally. In this part we will start adding some custom functionality that extends the core. In particular this tutorial will take you through adding custom services, custom endpoints and subscribers. The custom functionality that we will be adding will create an endpoint called `/welcome/:cart_id` which customers of your store can use to opt-in to receiving a welcome in their email inbox after completing their order.

The custom functionality will do a number of things:

- Create a custom service that handles the logic around opting in. The service will ensure that only first time buyers will receive a welcome.
- Create a custom endpoint at `/welcome/:cart_id` which will take a `optin` parameter as part of its request body, and call our custom service.
- Create a subscriber that listens for the `order.placed` event and tells the custom service to send a welcome.

## Services

We will begin our custom implementation by adding a custom service. In you project create a new file at `/src/services/welcome.js`. Open the newly created file and add a class:

```javascript
import { BaseService } from "medusa-interfaces";

class WelcomeService extends BaseService {
  constructor({}) {
    super();
  }

  async registerOptin(cartId, optin) {}

  async sendWelcome(orderId) {}
}

export default WelcomeService;
```

We will be filling out each of the methods in turn, but before we get to that it should be noted that placing files in `/src/services` has a special meaning in Medusa projects. When Medusa starts up it will look for files in this folder and register exports from these files to the global container. The global container holds all services and repositories in your Medusa project allowing for dependency injection. Dependency injection is a software development technique in which objects only receive other objects that it depends upon.

### `constructor`

We will see dependency injection in action now when implementing the constructor:

```javascript
constructor({ cartService, orderService }) {
  super()

  this.cartService_ = cartService

  this.orderService_ = orderService
}
```

In the constructor we specify that our `WelcomeService` will depend upon the `cartService` and `orderService` and Medusa will make sure to provide those as the first argument to the constructor when starting up Medusa. We then keep a reference to these services within the `WelcomeService` so that we can use them later on.

> Note: Just like we can depend on the `cartService` and `orderService` other services will be able to depend on our newly created `WelcomeService`. The registration name of our service is the camelCased version of our file name with the registration type appended. I.e. `/src/services/welcome.js` -> `welcomeService`.

### `registerOptin`

The `registerOption` function will take to arguments: `cartId` and `optin`, where `cartId` holds the id of the cart that we wish to register optin for and `optin` is a boolean to indicate if the customer has accepted or optin or not. We will save the `optin` preferences in the cart's `metadata` field, so that it can be persisted for the future when we need to evaluate if we should send the welcome or not.

```javascript
async registerOptin(cartId, optin) {
  if (typeof optin !== "boolean") {
    throw new Error("optin must be a boolean value.")
  }

  return await this.cartService_.update(cartId, {
    metadata: { welcome_optin: optin }
  })
}
```

The `registerOptin` implementation simply validates that the provided argument is of the correct type and calls the CartService function `update`. `update` takes two arguments: the first is the id of the cart to update and the second is an object that with the key/value pairs that we want to update. In this case we are updating the metadata on the cart. The `metadata` field on the cart is itself an object so we need to pass an object when updating this field.

> Note: Most entities in Medusa have a `metadata` field that can be used for customizations or integrations when it is necessary to persist some data relating to the entity. Metadata cannot be overridden by other plugins.

### `sendWelcome`

The final function to implement in our class is the `sendWelcome` function that takes one argument `orderId` which holds the id of an order that we will evaluate whether to send a welcome for. In the implementation we leverage that when an order is created from a cart all the cart's metadata is copied to the order. We can therefore check `metadata.welcome_optin` to evaluate if the customer has allowed us to send a welcome to their email.

```javascript
async sendWelcome(orderId) {
  const order = await this.orderService_.retrieve(orderId, {
    select: ["email", "customer_id", "metadata"]
  })

  const prevOrders = await this.orderService_.list({
    customer_id: order.customer_id
  }, {
    select: ["id"]
  })

  if (prevOrders.length > 1) {
    // We only send welcomes to new customers. This customer
    // has already completed an order before so we can stop.
    return
  }

  if (order.metadata && order.metadata.welcome_optin) {
    // Customer opted in so we should send an email
    return await someEmailSender.send({
      to: order.email,
      subject: "Welcome to our Medusa Store!",
      body: `We are so happy to have you!`
    })
  }
}
```

In the above implementation we are first retrieving the order that we need to check if we should send a welcome for. We are selecting only the fields that we need. In this case the `email` on the order, we will use this if we need to send out the welcome email, the `customer_id` which is used to determine if the customer has completed prior orders and `metadata` to check if the customer opted in to receiving the welcome email.

After retrieving the order we list all orders that have the same `customer_id` as the order we just retrieved. We are only interested in the count of these orders so it is sufficient for us to just select the ids of these orders.

We then check if the number of previous orders is greater than 1, indicating that the customer has previously purchased anything from our store. If the number of previous orders is greater than 1 we can exit our function prematurely as we only send welcomes to new customers.

The final part of the implementation checks if the `welcome_optin` metadata has been set to true. If the customer has opted in we use `someEmailService.send` to trigger and email dispatch to the email stored on the order. In this case `someEmailSender` could be any email service for example Sendgrid, SES, Mailgun, etc.

> Note: If you have `medusa-plugin-sendgrid` installed you can use `sendgridService` in your constructor to use it later in `sendWelcome`. You will then be able to do `sendgridService.send({ ... })`.

We have completed the implementation of our custom service and we will now be able to call it from elsewhere in our project.

## Endpoints

Similarly to the `/src/services` directory, the `/src/api` directory has a special meaning in Medusa. Exports from this directory are assumed to be functions that return an express router instance that will be registered on the internal express app that Medusa creates when starting your server. This allows you to create custom endpoints for custom functionality. We will use this to create the custom endpoint that customers can use to give there welcome opt-in.

Create a new file at `/src/api/index.js` and add the following controller:

```javascript
import { Router } from "express";
import bodyParser from "body-parser";

export default () => {
  const app = Router();

  app.post("/welcome/:cart_id", bodyParser.json(), async (req, res) => {
    // TODO
  });

  return app;
};
```

### Controller implementation

Our endpoint controller's implementation will be very simple. It will extract the `id` from the path paramater and the `optin` flag from the request body. We will then use these values to call our the `WelcomeService`, which will take care of updating the cart metadata for later.

```javascript
app.post("/welcome/:cart_id", bodyParser.json(), async (req, res) => {
  const { cart_id } = req.params;
  const { optin } = req.body;

  // Validate that the optin value was provided.
  // If not respond with a Bad Request status
  if (typeof optin !== "boolean") {
    res.status(400).json({
      message: "You must provide an boolean optin value in the request body",
    });
    return;
  }

  const welcomeService = req.scope.resolve("welcomeService");

  try {
    await welcomeService.registerOptin(cart_id, optin);

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    // This is not supposed to happen.
    res.status(500).json({
      message: "Something unexpected happened.",
    });
  }
});
```

In the implementation above we are first validating that the request body is structured correctly so that we can proceed with our opt-in registration. If the validation fails we respond with 400 Bad Request which is an HTTP code that indicates that the client that sent the request has not provided the correct values.

After validation is passed we leverage Medusa's container system again to fetch our custom service. When Medusa starts up it places an object on the express `req` object called `scope` which contains the function `resolve` that can be used to get any of the services registered in Medusa by simply providing the registration name as a string. In this case we are resolving our custom `welcomeService`, but you can resolve any service such as the `cartService` or `orderService` using this function.

We put our `registerOptin` function call in a try-catch block to ensure that we can handle unexpected errors. If the call to `registerOptin` succeeds we respond with 200 OK and if for some reason we encounter an error we respond with 500 Internal Server Error.

We have now completed the implementation necessary to complete opt-in registration on a cart. To test that your implementation is working correctly start up your Medusa server using: `medusa develop`. You can now send requests to the server, first create a new cart using:

```shell
curl -X POST localhost:9000/store/carts | python -m json.tool
```

The copy the cart id (the one that starts with `cart_`) and use it to opt-in to the welcome pack using:

```shell
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{ "optin": true }' \
     localhost:9000/welcome/[copied cart id]
```

The endpoint should respond with `{"success":true}`. If you wish to check that the `metadata` field has been updated you can fetch the created cart by doing:

```shell
curl -X GET localhost:9000/store/carts/[copied cart id] | python -m json.tool
```

The response should contain the cart with the metadata field set like this:

```
{
  "cart": {
    ...,
    "metadata": {
      "welcome_optin": true
    },
    ...
  }
}
```

## Subscribers

The final thing that we will add in this part of the tutorial is the subscriber that listens for the `order.placed` event and sends out emails if the user has opted in for welcomes. Again we will leverage one of the special directories in Medusa that makes dependency injection easy and automatic. The directory to place a file in this time is the `/src/subscribers` directory, which treats exports as subscribers and makes sure the inject dependencies in a similar fashion to what we saw with services. To get started with our implementation create a file at `/src/subscribers/welcome.js` and add the following:

```javascript
class WelcomeSubscriber {
  constructor({ welcomeService, eventBusService }) {
    this.welcomeService_ = welcomeService;

    eventBusService.subscribe("order.placed", this.handleWelcome);
  }

  handleWelcome = async (data) => {
    return await this.welcomeService_.sendWelcome(data.id);
  };
}

export default WelcomeSubscriber;
```

The implementation above is all that is needed to automate the `sendWelcome` function to be called every time a new order is created. The subscriber class here delegates all of the business logic to the `sendWelcome` function, where we are checking for opt-in and first time buyers.

If we take a closer look at the constructor it will seem pretty familiar. Just like with our custom service, we are indicating which dependencies we would like to receive and Medusa will make sure to pass these on as the first argument to our constructor. In this case we are depending on the `welcomeService` which is used to take care of sending welcomes, and the `eventBusService` which is a core service in Medusa that handles events across your server allowing you to subscribe to events of interest. In this case we are using the `eventBusService` to subscribe to the `order.placed` event which is emitted every time a new order is created. The subscription is registered by the `eventBusService.subscribe` function which takes the event name to subscribe to as its first argument and a callback function to call when the event occurs, as its second argument.

In this case we are using the `handleWelcome` function as our callback. The callback function receives the data that is passed for the event. The `order.placed` event contains the order id in the data object which is what the `welcomeService` needs to handle the sending logic so we simply call `sendWelcome` with `data.id`.

You can now start up your server and test out the subscriber. Given that you have opted in to receiving welcome emails you can complete an order and you should receive an email with the welcome message.

## Summary

You have now learned how to add custom functionality to your Medusa server, which is one of the most powerful features of the Medusa core. The example above is quite simple, yet we have covered many of the customization capabilities available. We first looked at how to include custom business logic in Medusa by using services and dependency injection. Afterwards we put that logic to use when implementing our custom endpoint and in the final part of the tutorial we added some simple automation that handles sending the welcome message on every new order.

### What's next?

You have now been introduced to many of the key parts of Medusa and with your knowledge of customization you can now begin creating some really powerful commerce experiences. If you have an idea for a cool customization go ahead and make it right now! If you are not completely ready yet you can browse the reference docs further.

In the next part of this tutorial we will look into linking your local project with Medusa Cloud to make develpment smoother while leveraging the powerful management tools that merchants use to manage their Medusa store.
