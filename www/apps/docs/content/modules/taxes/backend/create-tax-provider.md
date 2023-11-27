---
description: 'Learn how to create a tax provider. You can create a tax provider in a Medusa backend or a plugin.'
addHowToData: true
---

# How to Create a Tax Provider

In this document, you’ll learn how to create a tax provider.

## Overview

A tax provider is used to retrieve the tax lines in a cart. The Medusa backend provides a default `system` provider. You can create your own tax provider, either in a plugin or directly in your Medusa backend, then use it in any region.

---

## Step 1: Create Tax Provider Class

A tax provider class should be defined in a TypeScript or JavaScript file under `src/services` and the class should extend `AbstractTaxService` imported from `@medusajs/medusa`.

For example, you can create the file `src/services/my-tax.ts` with the following content:

```ts title="src/services/my-tax.ts"
import { 
  AbstractTaxService,
  ItemTaxCalculationLine,
  ShippingTaxCalculationLine,
  TaxCalculationContext,
} from "@medusajs/medusa"
import { 
  ProviderTaxLine,
} from "@medusajs/medusa/dist/types/tax-service"

class MyTaxService extends AbstractTaxService {
  async getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext): 
    Promise<ProviderTaxLine[]> {
    throw new Error("Method not implemented.")
  }
}

export default MyTaxService
```

Since the class extends `AbstractTaxService`, it must implement its abstract method `getTaxLines`, which is explained later in this guide.

### Using a Constructor

You can use a constructor to access services and resources registered in the dependency container using dependency injection. For example:

```ts title="src/services/my-tax.ts"
// ...
import { LineItemService } from "@medusajs/medusa"

type InjectedDependencies = {
  lineItemService: LineItemService
}

class MyTaxService extends AbstractTaxService {
  protected readonly lineItemService_: LineItemService

  constructor({ lineItemService }: InjectedDependencies) {
    super()
    this.lineItemService_ = lineItemService
  }
  
  // ...
}

export default MyTaxService
```

---

## Step 2: Define Identifier

Every tax provider must have a unique identifier. The identifier is defined as a static property in the class, and its value is used when registering the tax provider in the database and in the dependency container.

Add the static property `identifier` in your tax provider class:

```ts title="src/services/my-tax.ts"
class MyTaxService extends AbstractTaxService {
  static identifier = "my-tax"
  // ...
}
```

Make sure to change `my-tax` to the name of your tax provider.

---

## Step 3: Implement getTaxLines Method

The `getTaxLines` method is the only required method in a tax provider. It’s used when retrieving the tax lines for line items and shipping methods, typically during checkout or when calculating totals, for example, for orders, swaps, or returns.

The method accepts three parameters. The first parameter is an array of tax calculation objects for line items. Each object having the following properties:

- `item`: a line item object.
- `rates`: an array of objects, each object having the following properties:
  - `rate`: an optional number indicating the tax rate.
  - `name`: a string indicating the name of the tax rate.
  - `code`: an optional string indicating the tax code.

The second parameter is an array of tax calculation objects for shipping methods. Each object having the following properties:

- `shipping_method`: a shipping method object.
- `rates`: an array of objects, each object having the following properties:
  - `rate`: an optional number indicating the tax rate.
  - `name`: a string indicating the name of the tax rate.
  - `code`: an optional string indicating the tax code.

The third parameter is a context object that can be helpful for the tax calculation. The object can have the following properties:

- `shipping_address`: an optional address object used for shipping.
- `customer`: an optional customer object.
- `region`: an optional region object.
- `is_return`: a boolean value that determines whether the taxes are being calculated for a return flow.
- `shipping_methods`: an array of shipping methods being used in the current context.
- `allocation_map`: an object that indicates the gift cards and discounts applied on line items. Each object key or property is an ID of a line item, and the value is an object having the following properties:
  - `gift_card`: an optional object indicating the gift card applied on the line item.
  - `discount`: an optional object indicating the discount applied on the line item.

This method is expected to return an array of line item tax line or shipping method tax line objects.

The line item tax line object has the following properties:

- `rate`: a number indicating the tax rate.
- `name`: a string indicating the name of the tax rate.
- `code`: a string indicating the tax code.
- `item_id`: the ID of the line item.
- `metadata`: an optional object that can hold any necessary additional data to be added to the line item tax lines.

:::note

Tax lines for line item must have a unique `code` and `item_id` combination. Otherwise, the tax lines will be applied multiple times.

:::

The shipping method tax line object has the following properties:

- `rate`: a number indicating the tax rate.
- `name`: a string indicating the name of the tax rate.
- `code`: a string indicating the tax code.
- `shipping_method_id`: the ID of the shipping method.
- `metadata`: an optional object that can hold any necessary additional data to be added to the shipping method tax lines.

:::note

Tax lines for a shipping method must have a unique `code` and `shipping_method_id` combination. Otherwise, the tax lines will be applied multiple times.

:::

The returned array would be a combination of both the line item tax lines and shipping method tax lines.

:::note

The Medusa backend determines whether an object in the returned array is a shipping method tax line item, depending on the availability of the `shipping_method_id` attribute. For line items, it depends on the availability of the `item_id` attribute.

:::

For example, the `system` tax provider returns the tax calculation line items in the first parameter and the tax calculation shipping methods in the second parameter as is:

```ts title="src/services/my-tax.ts"
// ...

class SystemTaxService extends AbstractTaxService {
  // ...

  async getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]> {
    let taxLines: ProviderTaxLine[] = itemLines.flatMap((l) => {
      return l.rates.map((r) => ({
        rate: r.rate || 0,
        name: r.name,
        code: r.code,
        item_id: l.item.id,
      }))
    })

    taxLines = taxLines.concat(
      shippingLines.flatMap((l) => {
        return l.rates.map((r) => ({
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          shipping_method_id: l.shipping_method.id,
        }))
      })
    )

    return taxLines
  }
}
```

---

## Step 3: Run the Build Command

In the directory of the Medusa backend, run the `build` command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

Run your backend to test it out:

```bash npm2yarn
npx medusa develop
```

Before you can test out your tax provider, you must enable it in a region. You can do that either using the [Medusa Admin dashboard](../../../user-guide/taxes/manage.md#change-tax-provider) or using the [Update Region admin API Route](../admin/manage-tax-settings.mdx#change-tax-provider-of-a-region).

Then, you can test out the tax provider by simulating a checkout process in that region. You should see the line item tax lines in the cart’s `items`, as each item object has a `tax_lines` array which are the tax lines that you return in the `getTaxLines` method for line items.

Similarly, you should see the shipping method tax lines in the cart’s `shipping_methods`, as each shipping method object has a `tax_lines` array which are the tax lines that you return in the `getTaxLines` method for shipping methods.
