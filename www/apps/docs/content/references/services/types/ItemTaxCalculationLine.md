# ItemTaxCalculationLine

 **ItemTaxCalculationLine**: `Object`

A line item and the tax rates that have been configured to apply to the
product contained in the line item.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | [`LineItem`](../classes/LineItem.md) | Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits. |
| `rates` | [`TaxServiceRate`](TaxServiceRate.md)[] | - |

#### Defined in

[packages/medusa/src/interfaces/tax-service.ts:24](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/tax-service.ts#L24)
