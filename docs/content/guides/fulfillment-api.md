---
title: Fulfillment API
---

## **Introduction**

This guide will give an overview of Medusa's Fulfillment API and how it can be implemented to work with different fulfillment providers. Before digging deeper into the API it should be clarified what is meant by a fulfillment provider; in Medusa a fulfillment provider is typically a 3rd party service that can handle order data for the purpose of shipping the items in the order to a customer. Examples of fulfillment providers are: a carrier like UPS, a logistics platform like ShipBob or a 3PL solution.

Implementations of the Fulfillment API can be distributed as npm packages for easy installation through the plugin system, there are already a couple of examples of fulfillment plugins in the Medusa monorepo, you can identify these by looking for `medusa-fulfillment-*`. For further details on building and publishing plugins [please check this guide](https://docs.medusajs.com/guides/plugins).

## Fulfillment Service Interface

The fulfillment service interface can be found in the [`medusa-interfaces` package](https://github.com/medusajs/medusa/blob/master/packages/medusa-interfaces/src/fulfillment-service.js) where you can see the full list of methods that can be implemented. The methods in the interface allow you to implement plugins that can calculate shipping rates, create fulfillments in other systems, create return labels, retrieve customs documents and more.

In this guide we will focus on the methods involved in a typical fulfillment flow i.e. creating a shipping option, adding a shipping method to a cart, creating a fulfillment of items in a cart and finally marking the fulfillment as shipped. The methods involved in this flow are:

```jsx
getFulfillmentOptions()
validateOption(optionData)
validateFulfillmentData(fulfillmentData, cart)
createFulfillment(fulfillmentData, fulfillmentItems, order, fulfillment)
```

The figure below shows at what points in the flow the Fulfillment API is called.

![Fulfillment Flow](https://user-images.githubusercontent.com/7554214/133107092-981505ea-230a-4399-9d95-3f2ec59a7dcc.png)

- **Get fulfillment options for Region**

  In Medusa Shipping Options are defined and configured for each region - this allows store operators to granularly control how orders can be fulfilled in different countries. When creating a shipping option on a Region the Fulfillment API calls `getFulfillmentOptions` which will return the ways in which a fulfillment provider can process an order. Let's imagine that you have built a UPS plugin that can be used to fulfill orders with UPS; in this case `getFulfillmentOptions` might respond with UPS Express Shipping and UPS Access Point.

- **Create Shipping Option**

  When creating the Shipping Option in Medusa, a store operator selects which underlying fulfillment option will be used when customers create Orders with the Shipping Option. To build from the UPS example a store operator may select the UPS Access Point option from the list of fulfillment options, she will then add an appropriate name for the Shipping Option, set the Shipping Option's price and if needed adjust the requirements that must be met for the Shipping Option to be active (e.g. minimum cart subtotal). Before the Shipping Option is created, `validateOption` will be called to ensure that the selected fulfillment option is in fact valid and correctly formatted. `validateOption` should respond with the validated fulfillment option; this also provides a point at which you may add additional details to the fulfillment data before the Shipping Option is created.

- **Get Shipping Options for Cart**

  Moving to the customer perspective it is assumed that a cart has been created, items have been added to the cart and the customer is now looking towards selecting the Shipping Option they wish to have their Order fulfilled with. The first step from the storefront perspective is to retrieve the list of Shipping Options that are available for the Cart; these will be filtered based on the Region the Cart belongs to and the items that are in the cart. There are no calls to the Fulfillment API associated with the retrieval.

- **Add Shipping Method to Cart**

  At this point the customer has selected a Shipping Option and may have configured additional details about the fulfillment. For example, building on the UPS example, the customer may have selected a Shipping Option that uses the UPS Access Point fulfillment option; in this case the customer sends an `access_point_id` in the `data` object of the `POST /store/carts/:id/shipping-methods` payload. At this point the Shipping Option becomes a Shipping Method, the distinction between the two is that a Shipping Option is a template for how a cart may be shipped whereas a Shipping Method is the instantiated way that the cart will be shipped (which may include specific details like the `access_point_id`). In order to ensure that the details that the customer selects are valid the Fulfillment API's `validateFulfillmentData` is called, this is where a fulfillment implementation may check that the `access_point_id` is in fact a valid value, etc.

- **Create Fulfillment**

  It is now assumed that the customer has completed their purchase with a given Shipping Method and the order has been confirmed. At this point we are ready to create the fulfillment in the 3rd party system. When a store operator (or an automation) attempts to fulfill an order the `createFulfillment` method will be called in the Fulfillment API, in our UPS example this method should then book a shipment via UPS's API.
  Note: in Medusa you can make partial fulfillments of an order it is therefore important that the id sent to the 3rd party is unique by fulfillment and not only order.

- **Mark as shipped**

  The final step of the fulfillment process is to mark the fulfillment as shipped. It is also at this stage that you would record a tracking number that can be shared with the customer. This step typically happens asynchronously through a webhook.

## Other useful methods

The flow above describes the Fulfillment API in high level terms; check out the `[medusa-fulfillment-webshipper](https://github.com/medusajs/medusa/blob/master/packages/medusa-fulfillment-webshipper/src/services/webshipper-fulfillment.js)` plugin for a full implementation of the Fulfillment API. In the implementation you will find examples of all the method described above.

### `createReturn`

You will find that the Webshipper plugin has an implementation for `createReturn` which allows fulfillment providers to implement a way for generating return labels. When implemented this can be used to allow customers to create self managed returns or to integrate automatic return label generation in the admin dashboard.

### `canCalculate(fulfillmentOption)`

If implemented this method can be used to dynamically calculate prices based on a cart's contents or details. The method returns a boolean value indicating if a given fulfillment option can have a dynamically calculated price or not.

### `calculatePrice(fulfillmentOption, fulfillmentData, cart)`

If the shipping option is configured to dynamically calculate the price of the this method will be called when Shipping Options are fetched for the Cart and when Shipping Methods are created on a Cart.

## What's next?

Now that you have an overview of the Fulfillment API you can start developing your own fulfillment plugin. For a guide on how to create plugins [check this guide](https://docs.medusajs.com/how-to/plugins). If you have questions or issues please feel free to [join our Discord server](https://discord.gg/medusajs) for direct access to the engineering team.
