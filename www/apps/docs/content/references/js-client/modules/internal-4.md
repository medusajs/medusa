---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Classes

- [AdminGetCurrenciesParams](../classes/internal-4.AdminGetCurrenciesParams.md)
- [AdminPostCurrenciesCurrencyReq](../classes/internal-4.AdminPostCurrenciesCurrencyReq.md)
- [FindPaginationParams](../classes/internal-4.FindPaginationParams.md)

## Type Aliases

### AdminCurrenciesListRes

Ƭ **AdminCurrenciesListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `currencies`: [`Currency`](../classes/internal-3.Currency.md)[]  }

**`Schema`**

AdminCurrenciesListRes
type: object
required:
  - currencies
  - count
  - offset
  - limit
properties:
  currencies:
    type: array
    description: An array of currency details.
    items:
      $ref: "#/components/schemas/Currency"
  count:
    type: integer
    description: The total number of items available
  offset:
    type: integer
    description: The number of currencies skipped when retrieving the currencies.
  limit:
    type: integer
    description: The number of items per page

#### Defined in

packages/medusa/dist/api/routes/admin/currencies/index.d.ts:29

___

### AdminCurrenciesRes

Ƭ **AdminCurrenciesRes**: `Object`

**`Schema`**

AdminCurrenciesRes
type: object
required:
  - currency
properties:
  currency:
    description: Currency details.
    $ref: "#/components/schemas/Currency"

#### Type declaration

| Name | Type |
| :------ | :------ |
| `currency` | [`Currency`](../classes/internal-3.Currency.md) |

#### Defined in

packages/medusa/dist/api/routes/admin/currencies/index.d.ts:42
