---
title: Carts in Medusa
---

# Carts in Medusa

In Medusa a Cart serves the purpose of collecting the information needed to create an Order, including what products to purchase, what address to send the products to and which payment method the purchase will be processed by.

To create a cart using the `@medusajs/medusa-js` SDK you can use:

```javascript
const client = new Medusa({ baseUrl: "http://localhost:9000" })
const { cart } = await client.carts.create()
```

A Cart will always belong to a Region and you may provide a `region_id` upon Cart creation. If no `region_id` is specified Medusa will assign the Cart to a random Region. Regions specify information about how the Cart should be taxed, what currency the Cart should be paid with and what payment and fulfillment options will be available at checkout. Below are some of the properties that can be found on the Cart response. For a full example of a Cart response [check our fixtures](https://github.com/medusajs/medusa/blob/docs/api/docs/api/fixtures/store/GetCartsCart.json).

```json
  "cart": {
    "id": "cart_01FEWZSRFWT8QWMHJ7ZCPRP3BZ",
    "email": null,
    "billing_address": null,
    "shipping_address": null,
    "items": [ ... ],
    "region": {
      "id": "reg_01FEWZSRD7HVHBSQRC4KYMG5XM",
      "name": "United States",
      "currency_code": "usd",
      "tax_rate": "0",
      ...
    },
    "discounts": [],
    "gift_cards": [],
    "customer_id": null,
    "payment_sessions": [],
    "payment": null,
    "shipping_methods": [],
    "type": "default",
    "metadata": null,
    "shipping_total": 0,
    "discount_total": 0,
    "tax_total": 0,
    "gift_card_total": 0,
    "subtotal": 1000,
    "total": 1000,
    ...
  }
```

## Adding products to the Cart

Customers can add products to the Cart in order to start gathering the items that will eventually be purchased. In Medusa adding a product to a Cart will result in a _Line Item_ being generated. To add a product using the SDK use:

```javascript
const { cart } = await client.carts.lineItems.create(cartId, {
  variant_id: "[id-of-variant-to-add]",
  quantity: 1,
})
```

The resulting response will look something like this:

```json
{
  "cart": {
    "id": "cart_01FEWZSRFWT8QWMHJ7ZCPRP3BZ",
    "items": [
      {
        "id": "item_01FEWZSRMBAN85SKPCRMM30N6W",
        "cart_id": "cart_01FEWZSRFWT8QWMHJ7ZCPRP3BZ",
        "title": "Basic Tee",
        "description": "Small",
        "thumbnail": null,
        "is_giftcard": false,
        "should_merge": true,
        "allow_discounts": true,
        "has_shipping": false,
        "unit_price": 1000,
        "variant": {
          "id": "variant_01FEWZSRDNWABVFZTZ21JWKHRG",
          "title": "Small",
          "product_id": "prod_01FEWZSRDHDDSHQV6ATG6MS2MF",
          "sku": null,
          "barcode": null,
          "ean": null,
          "upc": null,
          "allow_backorder": false,
          "hs_code": null,
          "origin_country": null,
          "mid_code": null,
          "material": null,
          "weight": null,
          "length": null,
          "height": null,
          "width": null,
          "metadata": null,
          ...
        },
        "quantity": 1,
        "metadata": {},
        ...
      }
    ],
    ...
  }
}
```

The properties stored on a Line Item are useful for explaining and displaying the contents of the Cart. For example, Line Items can have a thumbnail assigned which can be used to display a pack shot of the product that is being purchased, a title to show name the products in the cart and a description to give further details about the product. By default the Line Item will be generated with properties inherited from the Product that is being added to the Cart, but the behaviour can be customized for other purposes as well.

## Adding Customer information to a Cart

After adding products to the Cart, you should gather information about where to send the products, this is done using the `update` method in the SDK.

```javascript
const { cart } = await client.carts.update(cartId, {
  email: "jane.doe@mail.com",
  shipping_address: {
    first_name: "Jane",
    last_name: "Doe",
    address_1: "4242 Hollywood Dr",
    postal_code: "12345",
    country_code: "us",
    city: "Los Angeles",
    region: "CA",
  },
})
```

Note that the country code in the shipping address must be the country code for one of the countries in a Region - otherwise this method will fail.

## Initializing Payment Sessions

In Medusa payments are handled through the long lived entities called _Payment Sessions_. Payment Sessions cary provider specific data that can later be used to authorize the payments, which is the step required before an order can be created. The SDK provides a `createPaymentSessions` method that can be used to initialize the payment sessions with the Payment Providers available in the Region.

```javascript
const { cart } = await client.carts.createPaymentSessions(cartId)
```

You can read more about Payment Sessions in our [guide to checkouts](https://docs.medusa-commerce.com/guides/checkouts).

## Changing the Cart region

To update the Region that the cart belongs to you should also use the `update` method from the SDK.

```javascript
const { cart } = await client.carts.update(cartId, {
  region_id: "[id-of-region-to-switch-to]",
})
```

When changing the Cart region you should be aware of a couple of things:

- If switching to a Region with a different currency the line item prices and cart totals will change
- If switching to a Region with a different tax rate prices and totals will change
- If switching to a Region serving only one country the `shipping_address.country_code` will automatically be set to that country
- If the Cart already has initialized payment sessions all of these will be canceled and a new call to `createPaymentSessions` will have to be made

## What's next?

Carts are at the core of the shopping process in Medusa and provide all the necessary functionality to gather products for purchase. If you want to read a more detailed guide about how to complete checkouts please go to our [Checkout Guide](https://docs.medusa-commerce.com/guides/checkout).

If you have questions or issues feel free to reach out via our [Discord server](https://discord.gg/xpCwq3Kfn8) for direct access to the Medusa engineering team.
