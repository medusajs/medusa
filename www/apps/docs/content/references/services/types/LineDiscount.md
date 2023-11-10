# LineDiscount

 **LineDiscount**: `Object`

Associates a line item and discount allocation.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | - |
| `lineItem` | [`LineItem`](../classes/LineItem.md) | Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits. |
| `variant` | `string` | - |

#### Defined in

[packages/medusa/src/types/totals.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/totals.ts#L53)
