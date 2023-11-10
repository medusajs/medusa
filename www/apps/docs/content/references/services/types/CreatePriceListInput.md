# CreatePriceListInput

 **CreatePriceListInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customer_groups?` | { `id`: `string`  }[] |
| `description` | `string` |
| `ends_at?` | `Date` |
| `includes_tax?` | `boolean` |
| `name` | `string` |
| `prices` | [`AdminPriceListPricesCreateReq`](../classes/AdminPriceListPricesCreateReq.md)[] |
| `starts_at?` | `Date` |
| `status?` | [`PriceListStatus`](../enums/PriceListStatus.md) |
| `type` | [`PriceListType`](../enums/PriceListType.md) |

#### Defined in

[packages/medusa/src/types/price-list.ts:175](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L175)
