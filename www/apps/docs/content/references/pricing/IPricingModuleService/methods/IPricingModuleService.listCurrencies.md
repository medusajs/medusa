---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/listCurrencies
sidebar_label: listCurrencies
---

# listCurrencies - Pricing Module Reference

This documentation provides a reference to the listCurrencies method. This belongs to the Pricing Module.

This method is used to retrieve a paginated list of currencies based on optional filters and configuration.

## Parameters

- `filters`: (optional) An object of type [FilterableCurrencyProps](../../interfaces/FilterableCurrencyProps.md) that is used to filter the retrieved currencies. It accepts the following properties:
	- `$and`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
	- `$or`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
	- `code`: (optional) an array of strings, each being a currency code to filter the currencies.
- `config`: (optional) An object of type [FindConfig](../../interfaces/FindConfig.md) used to configure how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a currency. It accepts the following properties:
	- `order`: (optional) An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC` to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.
	- `relations`: (optional) An array of strings, each being relation names of the entity to retrieve in the result.
	- `select`: (optional) An array of strings, each being attribute names of the entity to retrieve in the result.
	- `skip`: (optional) A number indicating the number of records to skip before retrieving the results.
	- `take`: (optional) A number indicating the number of records to return in the result.
	- `withDeleted`: (optional) A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the `SoftDeletableEntity` class.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an array of objects of type [CurrencyDTO](../../interfaces/CurrencyDTO.md).

<details>
<summary>
CurrencyDTO
</summary>

- `code`: a string indicating the code of the currency.
- `name`: (optional) a string indicating the name of the currency.
- `symbol`: (optional) a string indicating the symbol of the currency.
- `symbol_native`: (optional) a string indicating the symbol of the currecy in its native form. This is typically the symbol used when displaying a price.

</details>

## Example

To retrieve a list of currencies using their codes:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[]) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies(
    {
      code: codes
    },
  )

  // do something with the currencies or return them
}
```

To specify attributes that should be retrieved within the money amounts:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[]) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies(
    {
      code: codes
    },
    {
      select: ["symbol_native"]
    }
  )

  // do something with the currencies or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies(
    {
      code: codes
    },
    {
      select: ["symbol_native"],
      skip,
      take
    }
  )

  // do something with the currencies or return them
}
```
