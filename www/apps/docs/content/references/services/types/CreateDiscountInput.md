# CreateDiscountInput

 **CreateDiscountInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `ends_at?` | `Date` |
| `is_disabled` | `boolean` |
| `is_dynamic` | `boolean` |
| `metadata?` | Record<`string`, `unknown`\> |
| `regions?` | `string`[] \| [`Region`](../classes/Region.md)[] |
| `rule` | [`CreateDiscountRuleInput`](CreateDiscountRuleInput.md) |
| `starts_at?` | `Date` |
| `usage_limit?` | `number` |
| `valid_duration?` | `string` |

#### Defined in

[packages/medusa/src/types/discount.ts:172](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/discount.ts#L172)
