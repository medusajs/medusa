---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/listAndCountMoneyAmounts
sidebar_label: listAndCountMoneyAmounts
---

# listAndCountMoneyAmounts - Pricing Module Reference

This documentation provides a reference to the listAndCountMoneyAmounts method. This belongs to the Pricing Module.

This method is used to retrieve a paginated list of money amounts along with the total count of available money amounts satisfying the provided filters.

## Parameters

- `filters`: (optional) An object of type [FilterableMoneyAmountProps](../../interfaces/FilterableMoneyAmountProps.md) that is used to filter the retrieved money amounts. It accepts the following properties:
	- `$and`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
	- `$or`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
	- `currency_code`: (optional) A string or an array of strings, each being a currency code to filter money amounts.
	- `id`: (optional) An array of strings, each being an ID to filter money amounts.
- `config`: (optional) An object of type [FindConfig](../../interfaces/FindConfig.md) used to configure how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a money amount. It accepts the following properties:
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

A promise that resolves to an array having two items, the first item is an array of objects of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md), 
and the second item is a number indicating the total count.

<details>
<summary>
MoneyAmountDTO
</summary>

- `amount`: (optional) A number indicating the amount of this price.
- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
	- `code`: a string indicating the code of the currency.
	- `name`: (optional) a string indicating the name of the currency.
	- `symbol`: (optional) a string indicating the symbol of the currency.
	- `symbol_native`: (optional) a string indicating the symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
- `currency_code`: (optional) A string that indicates the currency code of this price.
- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.

</details>

## Example

To retrieve a list of money amounts using their IDs:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      id: moneyAmountIds
    }
  )

  // do something with the money amounts or return them
}
```

To specify relations that should be retrieved within the money amounts:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      id: moneyAmountIds
    },
    {
      relations: ["currency"]
    }
  )

  // do something with the money amounts or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      id: moneyAmountIds
    },
    {
      relations: ["currency"],
      skip,
      take
    }
  )

  // do something with the money amounts or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[], currencyCode: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      $and: [
        {
          id: moneyAmountIds
        },
        {
          currency_code: currencyCode
        }
      ]
    },
    {
      relations: ["currency"],
      skip,
      take
    }
  )

  // do something with the money amounts or return them
}
```
