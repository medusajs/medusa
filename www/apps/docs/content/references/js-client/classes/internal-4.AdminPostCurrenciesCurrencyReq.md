---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCurrenciesCurrencyReq

[internal](../modules/internal-4.md).AdminPostCurrenciesCurrencyReq

**`Schema`**

AdminPostCurrenciesCurrencyReq
type: object
properties:
  includes_tax:
    type: boolean
    x-featureFlag: "tax_inclusive_pricing"
    description: "Tax included in prices of currency."

## Properties

### includes\_tax

• `Optional` **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/currencies/update-currency.d.ts:66
