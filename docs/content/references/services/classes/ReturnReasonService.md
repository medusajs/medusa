# Class: ReturnReasonService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ReturnReasonService`**

## Constructors

### constructor

• **new ReturnReasonService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/return-reason.js:5](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L5)

## Methods

### create

▸ **create**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[services/return-reason.js:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L30)

___

### delete

▸ **delete**(`returnReasonId`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnReasonId` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/return-reason.js:114](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L114)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/return-reason.js:82](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L82)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/return-reason.js:97](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L97)

___

### update

▸ **update**(`id`, `data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[services/return-reason.js:52](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L52)

___

### withTransaction

▸ **withTransaction**(`manager`): [`ReturnReasonService`](ReturnReasonService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `manager` | `any` |

#### Returns

[`ReturnReasonService`](ReturnReasonService.md)

#### Defined in

[services/return-reason.js:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return-reason.js#L15)
