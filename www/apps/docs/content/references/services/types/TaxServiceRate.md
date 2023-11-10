# TaxServiceRate

 **TaxServiceRate**: `Object`

The tax rate object as configured in Medusa. These may have an unspecified
numerical rate as they may be used for lookup purposes in the tax provider
plugin.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` \| ``null`` | The tax rate's code. |
| `name` | `string` | The tax rate's name. |
| `rate?` | `number` \| ``null`` | The tax rate. |

#### Defined in

[packages/medusa/src/types/tax-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/tax-service.ts#L15)
