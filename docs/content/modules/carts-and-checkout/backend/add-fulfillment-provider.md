---
description: 'Learn how to create a fulfillment provider in the Medusa backend. This guide explains the different methods in the fulfillment provider.'
addHowToData: true
---

# How to Add a Fulfillment Provider

In this document, you’ll learn how to add a fulfillment provider to a Medusa backend. If you’re unfamiliar with the Shipping architecture in Medusa, make sure to [check out the overview first](../shipping.md).

## Overview

A fulfillment provider is the shipping provider used to fulfill orders and deliver them to customers. An example of a fulfillment provider is FedEx.

By default, a Medusa Backend has a `manual` fulfillment provider which has minimal implementation. It allows you to accept orders and fulfill them manually. However, you can integrate any fulfillment provider into Medusa, and your fulfillment provider can interact with third-party shipping providers.

Adding a fulfillment provider is as simple as creating one [service](../../../development/services/create-service.md) file in `src/services`. A fulfillment provider is essentially a service that extends the `FulfillmentService`. It requires implementing 4 methods:

1. `getFulfillmentOptions`: used to retrieve available fulfillment options provided by this fulfillment provider.
2. `validateOption`: used to validate the shipping option when it’s being created by the admin.
3. `validateFulfillmentData`: used to validate the shipping method when the customer chooses a shipping option on checkout.
4. `createFulfillment`: used to perform any additional actions when fulfillment is being created for an order.

Also, the fulfillment provider class should have a static property `identifier`. It is the name that will be used to install and refer to the fulfillment provider throughout Medusa.

Fulfillment providers are loaded and installed on the backend startup.

---

## Create a Fulfillment Provider

The first step is to create a JavaScript or TypeScript file under `src/services`. For example, create the file `src/services/my-fulfillment.ts` with the following content:

```ts title=src/services/my-fulfillment.ts
import { FulfillmentService } from "medusa-interfaces"

class MyFulfillmentService extends FulfillmentService {

}

export default MyFulfillmentService
```

Fulfillment provider services must extend the `FulfillmentService` class imported from `medusa-interfaces`.

:::note

Following the naming convention of Services, the name of the file should be the slug name of the fulfillment provider, and the name of the class should be the camel case name of the fulfillment provider suffixed with “Service”. You can learn more in the [service documentation](../../../development/services/create-service.md).

:::

### Identifier

As mentioned in the overview, fulfillment providers should have a static `identifier` property.

The `FulfillmentProvider` entity has 2 properties: `identifier` and `is_installed`. The `identifier` property in the class will be used when the fulfillment provider is created in the database.

The value of this property will also be used to reference the fulfillment provider throughout Medusa. For example, it is used to [add a fulfillment provider](/api/admin/#tag/Region/operation/PostRegionsRegionFulfillmentProviders) to a region.

```ts
import { FulfillmentService } from "medusa-interfaces"

class MyFulfillmentService extends FulfillmentService {
  static identifier = "my-fulfillment"
}

export default MyFulfillmentService
```

### constructor

You can use the `constructor` of your fulfillment provider to have access to different services in Medusa through dependency injection. You can access any services you create in Medusa in the first parameter.

You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.

Additionally, if you’re creating your fulfillment provider as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor. The options are passed as a second parameter.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  constructor(container, options) {
    super(container)
    // you can access options here
  }
}
```

### getFulfillmentOptions

When the admin is creating shipping options available for customers during checkout, they choose one of the fulfillment options provided by underlying fulfillment providers.

For example, if you’re integrating UPS as a fulfillment provider, you might support two fulfillment options: UPS Express Shipping and UPS Access Point.

These fulfillment options are defined in the `getFulfillmentOptions` method. This method should return an array of options.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async getFulfillmentOptions() {
    return [
      {
        id: "my-fulfillment",
      },
      {
        id: "my-fulfillment-dynamic",
      },
    ]
  }
}
```

When the admin chooses one of those fulfillment options, the data of the chosen fulfillment option is stored in the `data` property of the shipping option created. This property is used to add any additional data you need to fulfill the order with the third-party provider.

For that reason, the fulfillment option doesn't have any required structure and can be of any format that works for your integration.

### validateOption

Once the admin creates the shipping option, the data will be validated first using this method in the underlying fulfillment provider of that shipping option. This method is called when a `POST` request is sent to [`/admin/shipping-options`](/api/admin/#tag/Shipping-Option/operation/PostShippingOptions).

This method accepts the `data` object that is sent in the body of the request. You can use this data to validate the shipping option before it is saved.

This method returns a boolean. If the result is false, an error is thrown and the shipping option will not be saved.

For example, you can use this method to ensure that the `id` in the `data` object is correct:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async validateOption(data) {
      return data.id == "my-fulfillment"
  }
}
```

If your fulfillment provider does not need to run any validation, you can simply return `true`.

### validateFulfillmentOption

When the customer chooses a shipping option on checkout, the shipping option and its data are validated before the shipping method is created.

`validateFulfillmentOption` is called when a `POST` request is sent to [`/carts/:id/shipping-methods`](/api/store/#tag/Cart/operation/PostCartsCartShippingMethod).

This method accepts three parameters:

1. The shipping option data.
2. The `data` object passed in the body of the request.
3. The customer’s cart data.

You can use these parameters to validate the chosen shipping option. For example, you can check if the `data` object includes all data needed to fulfill the shipment later on.

If any of the data is invalid, you can throw an error. This error will stop Medusa from creating a shipping method and the error message will be returned as a result to the endpoint.

If everything is valid, this method must return a value that will be stored in the `data` property of the shipping method to be created. So, make sure the value you return contains everything you need to fulfill the shipment later on.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async validateFulfillmentData(optionData, data, cart) {
    if (data.id !== "my-fulfillment") {
      throw new Error("invalid data")
    }

    return {
      ...data,
    }
  }
}
```

### createFulfillment

After an order is placed, it can be fulfilled either manually by the admin or using automation.

This method gives you access to the fulfillment being created as well as other details in case you need to perform any additional actions with the third-party provider.

This method accepts four parameters:

1. The data of the shipping method associated with the order.
2. An array of items in the order to be fulfilled. The admin can choose all or some of the items to fulfill.
3. The data of the order
4. The data of the fulfillment being created.

You can use the `data` property in the shipping method (first parameter) to access the data specific to the shipping option. This is based on your implementation of previous methods.

Here is a basic implementation of `createFulfillment` for a fulfillment provider that does not interact with any third-party provider to create the fulfillment:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  createFulfillment(
    methodData,
    fulfillmentItems,
    fromOrder,
    fulfillment
  ) {
    // No data is being sent anywhere
    return Promise.resolve({})
  }
}
```

:::note
This method is also used to create claims and swaps. The fulfillment object has the fields `claim_id`, `swap_id`, and `order_id`. You can check which isn’t null to determine what type of fulfillment is being created.

:::

### Useful Methods

The above-detailed methods are the required methods for every fulfillment provider. However, there are additional methods that you can use in your fulfillment provider to customize it further or add additional features.

#### canCalculate

This method validates whether a shipping option is calculated dynamically or flat rate. It is called if the `price_type` of the shipping option being created is set to `calculated`.

If this method returns `true`, that means that the price should be calculated dynamically. The `amount` property of the shipping option will then be set to `null`. The amount will be created later when the shipping method is created on checkout using the `calculatePrice` method (explained next).

If the method returns `false`, an error is thrown as it means the selected shipping option can only be chosen if the price type is set to `flat_rate`.

This method receives as a parameter the `data` object sent with the request that [creates the shipping option.](/api/admin/#tag/Shipping-Option/operation/PostShippingOptions) You can use this data to determine whether the shipping option should be calculated or not. This is useful if the fulfillment provider you are integrating has both flat rate and dynamically priced fulfillment options.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  canCalculate(data) {
    return data.id === "my-fulfillment-dynamic"
  }
}
```

#### calculatePrice

This method is called on checkout when the shipping method is being created if the `price_type` of the selected shipping option is `calculated`.

This method receives three parameters:

1. The `data` parameter of the selected shipping option.
2. The `data` parameter sent with [the request](/api/store/#tag/Cart/operation/PostCartsCartShippingMethod).
3. The customer’s cart data.

If your fulfillment provider does not provide any dynamically calculated rates you can keep the function empty:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  calculatePrice() {
    // leave empty
  }
}
```

Otherwise, you can use it to calculate the price with a custom logic. For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  calculatePrice(optionData, data, cart) {
    return cart.items.length * 1000
  }
}
```

#### createReturn

Fulfillment providers can also be used to return products. A shipping option can be used for returns if the `is_return` property is `true` or if an admin creates a Return Shipping Option from the settings.

This method is called when the admin [creates a return request](/api/admin/#tag/Order/operation/PostOrdersOrderReturns) for an order or when the customer [creates a return of their order](/api/store/#tag/Return/operation/PostReturns).

It gives you access to the return being created in case you need to perform any additional actions with the third-party provider.

It receives the return created as a parameter. The value it returns is set to the `shipping_data` of the return instance.

This is the basic implementation of the method for a fulfillment provider that does not contact with a third-party provider to fulfill the return:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  createReturn(returnOrder) {
    return Promise.resolve({})
  }
}
```

#### cancelFulfillment

This method is called when a fulfillment is cancelled by the admin. This fulfillment can be for an order, a claim, or a swap. 

It gives you access to the fulfillment being canceled in case you need to perform any additional actions with your third-party provider.

This method receives the fulfillment being cancelled as a parameter.

This is the basic implementation of the method for a fulfillment provider that does not interact with a third-party provider to cancel the fulfillment:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  cancelFulfillment(fulfillment) {
    return Promise.resolve({})
  }
}
```

---

## See Also

- Example Implementations: [Webshipper plugin](https://github.com/medusajs/medusa/tree/cab5821f55cfa448c575a20250c918b7fc6835c9/packages/medusa-fulfillment-webshipper) and the [manual fulfillment plugin](https://github.com/medusajs/medusa/tree/cab5821f55cfa448c575a20250c918b7fc6835c9/packages/medusa-fulfillment-manual)
