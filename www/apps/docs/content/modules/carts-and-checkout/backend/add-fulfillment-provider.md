---
description: 'Learn how to create a fulfillment provider in the Medusa backend. This guide explains the different methods in the fulfillment provider.'
addHowToData: true
---

# How to Add a Fulfillment Provider

In this document, you’ll learn how to add a fulfillment provider to a Medusa backend. If you’re unfamiliar with the Shipping architecture in Medusa, make sure to [check out the overview first](../shipping.md).

## Overview

A fulfillment provider is the shipping provider used to fulfill orders and deliver them to customers. An example of a fulfillment provider is FedEx.

By default, a Medusa Backend has a `manual` fulfillment provider which has minimal implementation. It allows you to accept orders and fulfill them manually. However, you can integrate any fulfillment provider into Medusa, and your fulfillment provider can interact with third-party shipping providers.

Adding a fulfillment provider is as simple as creating one [service](../../../development/services/create-service.mdx) file in `src/services`. A fulfillment provider is essentially a service that extends the `AbstractFulfillmentService`. It requires implementing 4 methods:

1. `getFulfillmentOptions`: used to retrieve available fulfillment options provided by this fulfillment provider.
2. `validateOption`: used to validate the shipping option when it’s being created by the admin.
3. `validateFulfillmentData`: used to validate a shipping method's data before it's created, typically during checkout.
4. `createFulfillment`: used to perform any additional actions when fulfillment is being created for an order, such as communicating with a third-party service.

There are other [useful methods](#useful-methods) that can be implemented based on your fulfillment provider's use case.

Also, the fulfillment provider class should have a static property `identifier`. It is the name that will be used to install and refer to the fulfillment provider throughout Medusa.

Fulfillment providers are loaded and installed on the backend startup.

---

## Create a Fulfillment Provider

The first step is to create a JavaScript or TypeScript file under `src/services`. For example, create the file `src/services/my-fulfillment.ts` with the following content:

```ts title=src/services/my-fulfillment.ts
import { 
  AbstractFulfillmentService, 
  Cart, 
  Fulfillment, 
  LineItem, 
  Order,
} from "@medusajs/medusa"
import { 
  CreateReturnType,
} from "@medusajs/medusa/dist/types/fulfillment-provider"

class MyFulfillmentService extends AbstractFulfillmentService {
  async getFulfillmentOptions(): Promise<any[]> {
    throw new Error("Method not implemented.")
  }
  async validateFulfillmentData(
    optionData: { [x: string]: unknown }, 
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<Record<string, unknown>> {
    throw new Error("Method not implemented.")
  }
  async validateOption(
    data: { [x: string]: unknown }
  ): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async canCalculate(
    data: { [x: string]: unknown }
  ): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async calculatePrice(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }
  async createFulfillment(
    data: { [x: string]: unknown }, 
    items: LineItem, 
    order: Order, 
    fulfillment: Fulfillment
  ) {
    throw new Error("Method not implemented.")
  }
  async cancelFulfillment(
    fulfillment: { [x: string]: unknown }
  ): Promise<any> {
    throw new Error("Method not implemented.")
  }
  async createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>> {
    throw new Error("Method not implemented.")
  }
  async getFulfillmentDocuments(
    data: { [x: string]: unknown }
  ): Promise<any> {
    throw new Error("Method not implemented.")
  }
  async getReturnDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    throw new Error("Method not implemented.")
  }
  async getShipmentDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    throw new Error("Method not implemented.")
  }
  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>, 
    documentType: "invoice" | "label"
  ): Promise<any> {
    throw new Error("Method not implemented.")
  }
}

export default MyFulfillmentService
```

Fulfillment provider services must extend the `AbstractFulfillmentService` class imported from `@medusajs/medusa`.

:::note

Following the naming convention of Services, the name of the file should be the slug name of the fulfillment provider, and the name of the class should be the camel case name of the fulfillment provider suffixed with “Service”. You can learn more in the [service documentation](../../../development/services/create-service.mdx).

:::

### Identifier

As mentioned in the overview, fulfillment providers should have a static `identifier` property.

The `FulfillmentProvider` entity has 2 properties: `identifier` and `is_installed`. The `identifier` property in the class will be used when the fulfillment provider is created in the database.

The value of this property will also be used to reference the fulfillment provider throughout Medusa. For example, it is used to [add a fulfillment provider](https://docs.medusajs.com/api/admin#regions_postregionsregionfulfillmentproviders) to a region.

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  static identifier = "my-fulfillment"

  // ...
}
```

### constructor

You can use the `constructor` of your fulfillment provider to have access to different services in Medusa through dependency injection. You can access any services you create in Medusa in the first parameter.

You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.

Additionally, if you’re creating your fulfillment provider as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor. The options are passed as a second parameter.

For example:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  constructor(container, options) {
    super()
    // you can access options here
  }
}
```

### getFulfillmentOptions

This method is used when retrieving the list of fulfillment options available in a region, particularly by the [List Fulfillment Options endpoint](https://docs.medusajs.com/api/admin#regions_getregionsregionfulfillmentoptions).

For example, if you’re integrating UPS as a fulfillment provider, you might support two fulfillment options: UPS Express Shipping and UPS Access Point. Each of these options can have different data associated with them.

This method is expected to return an array of options. These options don't have any required format.

Later on, these options can be used when creating a shipping option, such as when using the [Create Shipping Option endpoint](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions). The chosen fulfillment option, which is one of the items in the array returned by this method, will be set in the `data` object of the shipping option.

For example:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async getFulfillmentOptions(): Promise<any[]> {
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

### validateOption

Once the admin creates the shipping option, the data of the shipping option will be validated first using this method. This method is called when the [Create Shipping Option endpoint](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions) is used.

This method accepts the `data` object that is sent in the body of the request, basically, the `data` object of the shipping option. You can use this data to validate the shipping option before it is saved.

This method returns a boolean. If the returned value is `false`, an error is thrown and the shipping option will not be saved.

For example, you can use this method to ensure that the `id` in the `data` object is correct:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async validateOption(
    data: { [x: string]: unknown }
  ): Promise<boolean> {
    return data.id == "my-fulfillment"
  }
}
```

If your fulfillment provider doesn't need to run any validation, you can simply return `true`.

### validateFulfillmentData

This method is called when a shipping method is created. This typically happens when the customer chooses a shipping option during checkout, when a shipping method is created for an order return, or in other similar cases. The shipping option and its data are validated before the shipping method is created.

This method accepts three parameters:

1. The first parameter is the `data` object of the shipping option selected when creating the shipping method.
2. The second parameter is `data` object passed in the body of the request.
3. The third parameter is an object indicating the customer’s cart data. It may be empty if the shipping method isn't associated with a cart, such as when it's associated with a claim.

You can use these parameters to validate the chosen shipping option. For example, you can check if the `data` object passed as a second parameter includes all data needed to fulfill the shipment later on.

If any of the data is invalid, you can throw an error. This error will stop Medusa from creating a shipping method and the error message will be returned as a result to the endpoint.

If everything is valid, this method must return an object that will be stored in the `data` property of the shipping method to be created. So, make sure the value you return contains everything you need to fulfill the shipment later on.

The returned value may also be used to calculate the price of the shipping method if it doesn't have a set price. It will be passed along to the [calculatePrice](#calculateprice) method.

Here's an example implementation:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async validateFulfillmentData(
    optionData: { [x: string]: unknown }, 
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<Record<string, unknown>> {
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

This method is used when a fulfillment is created for an order, a claim, or a swap.

It accepts four parameters:

1. The first parameter is the `data` object of the shipping method associated with the resource, such as the order.
2. The second parameter is the array of line item objects in the order to be fulfilled. The admin can choose all or some of the items to fulfill.
3. The third parameter is an object that includes data related to the order, claim, or swap this fulfillment is being created for.
   1. If the resource the fulfillment is being created for is a claim, the `is_claim` property in the object will be `true`.
   2. If the resource the fulfillment is being created for is a swap, the `is_swap` property in the object will be `true`.
   3. Otherwise, the resource is an order.
4. The fourth parameter is an object of type [Fulfillment](../../../references/entities/classes/Fulfillment.md), which is the fulfillment being created.

You can use the `data` property in the shipping method (first parameter) to access the data specific to the shipping option. This is based on your implementation of previous methods.

This method must return an object of data that will be stored in the `data` attribute of the created fulfillment.

Here is a basic implementation of `createFulfillment` for a fulfillment provider that does not interact with any third-party provider to create the fulfillment:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async createFulfillment(
    data: { [x: string]: unknown }, 
    items: LineItem, 
    order: Order, 
    fulfillment: Fulfillment
  ) {
    // No data is being sent anywhere
    // No data to be stored in the fulfillment's data object
    return {}
  }
}
```

### Useful Methods

The above-detailed methods are the required methods for every fulfillment provider. However, there are additional methods that you can use in your fulfillment provider to customize it further or add additional features.

#### canCalculate

This method is used to determine whether a shipping option is calculated dynamically or flat rate. It is called if the `price_type` of the shipping option being created is set to `calculated`.

This method accepts an object as a parameter, which is the `data` object of the shipping option being created. You can use this data to determine whether the shipping option should be calculated or not. This is useful if the fulfillment provider you are integrating has both flat rate and dynamically priced fulfillment options.

If this method returns `true`, that means that the price can be calculated dynamically and the shipping option can have the `price_type` set to `calculated`. The `amount` property of the shipping option will then be set to `null`. The amount will be created later when the shipping method is created on checkout using the [calculatePrice method](#calculateprice).

If the method returns `false`, an error is thrown as it means the selected shipping option is invalid and it can only have the `flat_rate` price type.

For example:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async canCalculate(
    data: { [x: string]: unknown }
  ): Promise<boolean> {
    return data.id === "my-fulfillment-dynamic"
  }
}
```

#### calculatePrice

This method is used in different places, including:

1. When the shipping options for a cart are retrieved during checkout. If a shipping option has their `price_type` set to `calculated`, this method is used to set the `amount` of the returned shipping option.
2. When a shipping method is created. If the shipping option associated with the method has their `price_type` set to `calculated`, this method is used to set the `price` attribute of the shipping method in the database.
3. When the cart's totals are calculated.

This method receives three parameters:

1. The first parameter is the `data` object of the selected shipping option.
2. The second parameter is a `data` object that is different based on the context it's used in:
   1. If the price is being calculated for the list of shipping options available for a cart, it's the `data` object of the shipping option.
   2. If the price is being calculated when the shipping method is being created, it's the data returned by the [validateFulfillmentData](#validatefulfillmentdata) method used during the shipping method creation.
   3. If the price is being calculated while calculating the cart's totals, it will be the `data` object of the cart's shipping method.
3. The third parameter is either the [Cart](../../../references/entities/classes/Cart.md) or the [Order](../../../references/entities/classes/Order.md) object.

The method is expected to return a number that will be used to set the price of the shipping method or option, based on the context it's used in.

If your fulfillment provider does not provide any dynamically calculated rates you can return any static value or throw an error. For example:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async calculatePrice(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }
}
```

Otherwise, you can use it to calculate the price with custom logic. For example:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async calculatePrice(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<number> {
    return cart.items.length * 1000
  }
}
```

#### createReturn

Fulfillment providers can also be used to return products. A shipping option can be used for returns if the `is_return` property is `true` or if an admin creates a Return Shipping Option from the settings.

This method is used when the admin [creates a return request](https://docs.medusajs.com/api/admin#orders_postordersorderreturns) for an order, [creates a swap](https://docs.medusajs.com/api/admin#orders_postordersorderswaps) for an order, or when the customer [creates a return of their order](https://docs.medusajs.com/api/store#returns_postreturns). The fulfillment is created automatically for the order return.

The method receives as a parameter the [Return](../../../references/entities/classes/Return.md) object, which is the return that the fulfillment is being created for.

The method must return an object that will be used to set the value of the `shipping_data` attribute of the return being created.

This is the basic implementation of the method for a fulfillment provider that does not contact with a third-party provider to fulfill the return:

```ts
class MyFulfillmentService extends AbstractFulfillmentService {
  // ...
  async createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>> {
    return {}
  }
}
```

#### cancelFulfillment

This method is called when a fulfillment is cancelled by the admin. This fulfillment can be for an order, a claim, or a swap. 

The method receives the `data` attribute of the fulfillment being canceled. The method isn't expected to return any specific data.

This is the basic implementation of the method for a fulfillment provider that doesn't interact with a third-party provider to cancel the fulfillment:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async cancelFulfillment(
    fulfillment: { [x: string]: unknown }
  ): Promise<any> {
    return {}
  }
}
```

#### retrieveDocuments

This method is used to retrieve any documents associated with an order and its fulfillments. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.

The method accepts two parameters:

1. The first parameter is the `data` attribute of the order's fulfillment.
2. The second parameter is a string indicating the type of document to retrieve. Possible values are `invoice` and `label`.

There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>, 
    documentType: "invoice" | "label"
  ): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return this.client.getDocuments()
  }
}
```

#### getFulfillmentDocuments

This method is used to retrieve any documents associated with a fulfillment. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.

The method accepts the `data` attribute of the fulfillment that you're retrieving the documents for.

There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async getFulfillmentDocuments(
    data: { [x: string]: unknown }
  ): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return this.client.getFulfillmentDocuments()
  }
}
```

#### getReturnDocuments

This method is used to retrieve any documents associated with a return. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.

The method accepts the `data` attribute of the return that you're retrieving the documents for.

There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async getReturnDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return this.client.getReturnDocuments()
  }
}
```

#### getShipmentDocuments

This method is used to retrieve any documents associated with a shipment. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.

The method accepts the `data` attribute of the shipment that you're retrieving the documents for.

There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.

For example:

```ts
class MyFulfillmentService extends FulfillmentService {
  // ...
  async getShipmentDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return this.client.getShipmentDocuments()
  }
}
```

---

## See Also

- Example Implementations: [Webshipper plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-fulfillment-webshipper) and the [manual fulfillment plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-fulfillment-manual)
